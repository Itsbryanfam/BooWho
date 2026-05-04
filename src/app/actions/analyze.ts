"use server";

import { id } from "@instantdb/admin";
import { customAlphabet } from "nanoid";
import {
  ResponseSchema,
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
  getGeminiClient,
  type EnrichedSuggestion,
} from "@/lib/gemini";
import { fetchWikiThumb } from "@/lib/wiki";
import { getAdminDb } from "@/lib/db-admin";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  8,
);

const MAX_BASE64_BYTES = 8 * 1024 * 1024;

export type AnalyzeResult =
  | { ok: true; shortId: string }
  | { ok: false; error: "no_face" | "too_large" | "rate_limited" | "blocked" | "unknown" };

export async function analyzeSelfie(base64Jpeg: string): Promise<AnalyzeResult> {
  if (!base64Jpeg || base64Jpeg.length > MAX_BASE64_BYTES) {
    return { ok: false, error: "too_large" };
  }

  const cleaned = base64Jpeg.replace(/^data:image\/[a-z]+;base64,/, "");

  let parsed;
  try {
    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: cleaned } },
            {
              text: "Suggest 5 Halloween costumes per the system instructions, covering all four categories.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.9,
      },
    });

    const text = result.text;
    if (!text) return { ok: false, error: "blocked" };
    parsed = ResponseSchema.parse(JSON.parse(text));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/429|rate|quota/i.test(msg)) return { ok: false, error: "rate_limited" };
    if (/safety|block|prohibited/i.test(msg)) return { ok: false, error: "blocked" };
    console.error("[analyze] Gemini error:", msg);
    return { ok: false, error: "unknown" };
  }

  if (parsed.suggestions.length === 0) {
    return { ok: false, error: "no_face" };
  }

  const allEnriched: EnrichedSuggestion[] = await Promise.all(
    parsed.suggestions.map(async (s) => {
      const thumb = await fetchWikiThumb(s.wikipediaTitle);
      return {
        ...s,
        imageUrl: thumb?.imageUrl ?? null,
        pageUrl: thumb?.pageUrl ?? null,
      };
    }),
  );

  const enriched = allEnriched.filter((s) => s.imageUrl).slice(0, 4);
  if (enriched.length === 0) {
    return { ok: false, error: "no_face" };
  }

  const shortId = nanoid();

  try {
    const db = getAdminDb();
    await db.transact(
      db.tx.sessions[id()].update({
        shortId,
        suggestions: enriched,
        createdAt: Date.now(),
      }),
    );
  } catch (err: unknown) {
    console.error("[analyze] InstantDB write failed:", err);
    return { ok: false, error: "unknown" };
  }

  return { ok: true, shortId };
}
