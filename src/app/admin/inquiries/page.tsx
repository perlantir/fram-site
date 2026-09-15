import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, products } from "@/db/schema";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_review: "In review",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = ["new", "in_review", "quoted", "won", "lost"].includes(status ?? "")
    ? (status as "new" | "in_review" | "quoted" | "won" | "lost")
    : undefined;
  const rows = await db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      email: inquiries.email,
      phone: inquiries.phone,
      status: inquiries.status,
      createdAt: inquiries.createdAt,
      productName: products.name,
    })
    .from(inquiries)
    .leftJoin(products, eq(inquiries.productId, products.id))
    .where(validStatus ? eq(inquiries.status, validStatus) : undefined)
    .orderBy(desc(inquiries.createdAt));

  const filters = ["new", "in_review", "quoted", "won", "lost"] as const;

  return (
    <div>
      <p className="kicker kicker-muted">Pipeline.</p>
      <h1 className="mt-4 mb-8 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Inquiries.
      </h1>

      <div className="mb-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em]">
        <Link
          href="/admin/inquiries"
          className={`border px-3 py-1 ${!validStatus ? "border-[color:var(--color-charcoal)] bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]" : "rule"}`}
        >
          All
        </Link>
        {filters.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${s}`}
            className={`border px-3 py-1 ${validStatus === s ? "border-[color:var(--color-charcoal)] bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]" : "rule"}`}
          >
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            <th className="py-3">Received</th>
            <th className="py-3">Name</th>
            <th className="py-3">Email</th>
            <th className="py-3">Product</th>
            <th className="py-3">Status</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b rule-soft">
              <td className="py-3 text-[color:var(--color-muted)] text-xs">
                {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </td>
              <td className="py-3">{r.name}</td>
              <td className="py-3">{r.email}</td>
              <td className="py-3">{r.productName ?? "—"}</td>
              <td className="py-3 uppercase text-[11px] tracking-[0.14em]">
                {STATUS_LABEL[r.status]}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/inquiries/${r.id}`}
                  className="text-[11px] uppercase tracking-[0.16em] underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[color:var(--color-muted)]">
                No inquiries.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
