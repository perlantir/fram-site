import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { evidenceCitations } from "@/db/schema";
import { EvidenceForm } from "../EvidenceForm";

export default async function EditEvidence({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cid = Number(id);
  if (!cid) notFound();
  const row = await db.query.evidenceCitations.findFirst({
    where: eq(evidenceCitations.id, cid),
  });
  if (!row) notFound();
  return (
    <div>
      <p className="kicker kicker-muted">Edit.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2rem" }}>
        {row.title}
      </h1>
      <EvidenceForm
        initial={{
          id: row.id,
          category: row.category,
          kicker: row.kicker,
          title: row.title,
          authors: row.authors,
          journal: row.journal,
          year: row.year,
          url: row.url,
          order: row.order,
          published: row.published,
        }}
      />
    </div>
  );
}
