import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, evidenceCitations, inquiries, products, users } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [
    [{ v: productCount }],
    [{ v: inquiryCount }],
    [{ v: newInquiries }],
    [{ v: evidenceCount }],
    [{ v: userCount }],
    recentInquiries,
    recentAudit,
  ] = await Promise.all([
    db.select({ v: count() }).from(products),
    db.select({ v: count() }).from(inquiries),
    db.select({ v: count() }).from(inquiries).where(eq(inquiries.status, "new")),
    db.select({ v: count() }).from(evidenceCitations),
    db.select({ v: count() }).from(users),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(5),
    db.select().from(auditLog).orderBy(desc(auditLog.at)).limit(8),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Inquiries", value: inquiryCount, href: "/admin/inquiries" },
    { label: "New Inquiries", value: newInquiries, href: "/admin/inquiries?status=new" },
    { label: "Evidence", value: evidenceCount, href: "/admin/evidence" },
    { label: "Users", value: userCount, href: "/admin/users" },
  ];

  return (
    <div>
      <p className="kicker kicker-muted">Overview.</p>
      <h1 className="mt-6 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Dashboard.
      </h1>

      <div className="mt-12 grid gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="block border rule p-6 hover:bg-[color:var(--color-ivory-soft)]"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              {s.label}
            </p>
            <p className="mt-4 font-serif-display" style={{ fontSize: "2.25rem" }}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="kicker kicker-muted mb-4">Recent inquiries</h2>
          <ul className="divide-y rule-soft border-y rule-soft">
            {recentInquiries.length === 0 && (
              <li className="py-4 text-sm text-[color:var(--color-muted)]">No inquiries yet.</li>
            )}
            {recentInquiries.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm">{i.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                    {i.email}
                  </p>
                </div>
                <Link
                  href={`/admin/inquiries/${i.id}`}
                  className="text-[11px] uppercase tracking-[0.18em] underline"
                >
                  {i.status}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="kicker kicker-muted mb-4">Recent activity</h2>
          <ul className="divide-y rule-soft border-y rule-soft">
            {recentAudit.length === 0 && (
              <li className="py-4 text-sm text-[color:var(--color-muted)]">No activity yet.</li>
            )}
            {recentAudit.map((a) => (
              <li key={a.id} className="py-3 text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                  {a.at.toISOString().slice(0, 16).replace("T", " ")}
                </span>
                <span className="mx-2">·</span>
                <span>{a.userEmail ?? "system"}</span>
                <span className="mx-2">·</span>
                <span className="font-mono">{a.action}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
