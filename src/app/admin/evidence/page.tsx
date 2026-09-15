import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { evidenceCitations } from "@/db/schema";
import { deleteEvidence } from "./actions";

export const dynamic = "force-dynamic";

export default async function EvidenceAdmin() {
  const rows = await db
    .select()
    .from(evidenceCitations)
    .orderBy(asc(evidenceCitations.category), asc(evidenceCitations.order));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="kicker kicker-muted">Research.</p>
          <h1 className="mt-4 font-serif-display" style={{ fontSize: "2.5rem" }}>
            Evidence.
          </h1>
        </div>
        <Link href="/admin/evidence/new" className="btn-primary">
          New citation
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            <th className="py-3">Category</th>
            <th className="py-3">Title</th>
            <th className="py-3">Journal</th>
            <th className="py-3">Year</th>
            <th className="py-3">Status</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b rule-soft">
              <td className="py-3 uppercase text-[11px] tracking-[0.14em]">{r.category}</td>
              <td className="py-3 max-w-md truncate">{r.title}</td>
              <td className="py-3">{r.journal}</td>
              <td className="py-3">{r.year}</td>
              <td className="py-3">
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                    r.published
                      ? "border-emerald-700 text-emerald-700"
                      : "border-[color:var(--color-muted)] text-[color:var(--color-muted)]"
                  }`}
                >
                  {r.published ? "Live" : "Draft"}
                </span>
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/evidence/${r.id}`}
                  className="mr-4 text-[11px] uppercase tracking-[0.16em] underline"
                >
                  Edit
                </Link>
                <form action={deleteEvidence} className="inline">
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="text-[11px] uppercase tracking-[0.16em] text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[color:var(--color-muted)]">
                No citations yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
