const USER_AGENT =
  process.env.WIKIPEDIA_USER_AGENT ??
  "BooWho/0.1 (https://github.com/local/boowho)";

export type WikiThumb = {
  imageUrl: string;
  pageUrl: string;
} | null;

export async function fetchWikiThumb(title: string): Promise<WikiThumb> {
  const normalized = title.trim().replace(/\s+/g, "_");
  if (!normalized) return null;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    normalized,
  )}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.type === "disambiguation") return null;

    const imageUrl = data.thumbnail?.source ?? data.originalimage?.source;
    if (!imageUrl) return null;

    return {
      imageUrl,
      pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${normalized}`,
    };
  } catch {
    return null;
  }
}
