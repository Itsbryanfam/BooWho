import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

export const SYSTEM_PROMPT = `You are a Halloween costume stylist. Given a selfie, suggest 5 costumes that would suit the person based on visible features — face shape, hair color and style, build, expression, overall vibe.

The 5 suggestions MUST include at least one of each category:
- celebrity: a real living or recent celebrity (musician, actor, athlete, etc.)
- fiction: a fictional character from a movie, TV show, book, game, or comic
- historical: a historical figure (artist, scientist, monarch, activist, etc.)
- archetype: a recognizable pop-culture archetype, subculture, or aesthetic (e.g. "Goth subculture", "Cottagecore", "1970s disco")

The fifth suggestion may double up on any category — pick whichever fits the person best.

For each suggestion, give 2-3 sentences of specific reasoning that references what you see in the photo. Be concrete: name the features (e.g. "your sharp jawline", "your wavy dark hair", "the warmth in your smile"). Avoid generic praise. Do NOT comment on race, ethnicity, or attractiveness.

For each suggestion, provide the EXACT English Wikipedia article title for the subject — the page that has a photo of them. STRONGLY PREFER subjects who have a Wikipedia page with a photograph (well-known characters, famous people, established subcultures). For archetypes, use the title of the canonical Wikipedia article describing the archetype itself (e.g. "Cottagecore", "Goth subculture", "Disco").

If the photo shows no clear human face, return an empty suggestions array.`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: ["celebrity", "fiction", "historical", "archetype"],
          },
          reasoning: { type: Type.STRING },
          wikipediaTitle: { type: Type.STRING },
        },
        required: ["name", "category", "reasoning", "wikipediaTitle"],
        propertyOrdering: ["name", "category", "reasoning", "wikipediaTitle"],
      },
    },
  },
  required: ["suggestions"],
  propertyOrdering: ["suggestions"],
};

export const SuggestionSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["celebrity", "fiction", "historical", "archetype"]),
  reasoning: z.string().min(1),
  wikipediaTitle: z.string().min(1),
});

export const ResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});

export type Suggestion = z.infer<typeof SuggestionSchema>;

export type EnrichedSuggestion = Suggestion & {
  imageUrl: string | null;
  pageUrl: string | null;
};

let _client: GoogleGenAI | null = null;
export function getGeminiClient(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local — get a free key at https://aistudio.google.com/app/apikey",
    );
  }
  _client = new GoogleGenAI({ apiKey });
  return _client;
}
