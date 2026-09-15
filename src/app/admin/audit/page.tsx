import { desc, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { auditLog } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const rows = await db
    .select()
    .from(auditLog)
    .where(
      query
        ? or(
            ilike(auditLog.userEmail, `%${query}%`),
            ilike(auditLog.action, `%${query}%`),
            ilike(auditLog.entity, `%${query}%`),
            ilike(sql`${auditLog.entityId}::text`, `%${query}%`)
          )
        : undefined
    )
    .orderBy(desc(auditLog.at))
    .limit(250);

  return (
    <div>
      <p className="kicker kicker-muted">Trail.</p>
      <h1 className="mt-4 mb-8 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Audit log.
      </h1>

      <form method="get" className="mb-6 flex items-end gap-3">
        <div className="flex-1 md:max-w-md">
          <label>Search</label>
          <input name="q" defaultValue={query} placeholder="email, action, entity, or id" />
        </div>
        <button className="btn-primary" type="submit">
          Search
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            <th className="py-2">When</th>
            <th className="py-2">Actor</th>
            <th className="py-2">Action</th>
            <th className="py-2">Entity</th>
            <th className="py-2">Id</th>
            <th className="py-2">IP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b rule-soft">
              <td className="py-2 font-mono text-xs">
                {r.at.toISOString().replace("T", " ").slice(0, 19)}
              </td>
              <td className="py-2 text-xs">{r.userEmail ?? "system"}</td>
              <td className="py-2 font-mono text-xs">{r.action}</td>
              <td className="py-2 text-xs">{r.entity}</td>
              <td className="py-2 text-xs">{r.entityId ?? "—"}</td>
              <td className="py-2 text-xs">{r.ip ?? "—"}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[color:var(--color-muted)]">
                No entries.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
