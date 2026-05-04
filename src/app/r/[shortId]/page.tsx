import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/db-admin";
import type { EnrichedSuggestion } from "@/lib/gemini";
import { CostumeStack } from "@/components/CostumeStack";

type Params = { shortId: string };

export default async function ResultsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { shortId } = await params;
  const db = getAdminDb();
  const data = await db.query({
    sessions: { $: { where: { shortId }, limit: 1 } },
  });

  const session = data.sessions[0];
  if (!session) notFound();

  const suggestions = session.suggestions as EnrichedSuggestion[];

  return (
    <main className="min-h-screen px-6 py-20">
      <CostumeStack suggestions={suggestions} />
    </main>
  );
}
