import { asc, eq } from "drizzle-orm";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EvidenceIcon } from "@/components/site/EvidenceIcon";
import { db } from "@/db";
import { evidenceCitations } from "@/db/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Evidence" };

const LABELS = {
  longevity: "LONGEVITY",
  mind: "MIND",
  heat: "HEAT",
  cold: "COLD",
} as const;

export default async function EvidencePage() {
  const rows = await db
    .select()
    .from(evidenceCitations)
    .where(eq(evidenceCitations.published, true))
    .orderBy(asc(evidenceCitations.category), asc(evidenceCitations.order));

  const byCategory: Record<string, typeof rows> = {
    longevity: [],
    mind: [],
    heat: [],
    cold: [],
  };
  for (const r of rows) byCategory[r.category].push(r);

  return (
    <>
      <Header />
      <main className="mx-auto px-6 pt-20 pb-24 md:px-10">
        <p className="kicker kicker-muted">Evidence.</p>
        <h1
          className="mt-6 font-serif-display"
          style={{ fontSize: "var(--text-hero)" }}
        >
          Evidence.
        </h1>
        <p className="mt-8 max-w-lg text-sm uppercase tracking-[0.18em] text-[color:var(--color-charcoal)]/80">
          Research on heat and cold exposure and human health.
        </p>

        <div className="mt-24 space-y-16 border-t rule-soft pt-16">
          {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((cat) => {
            const items = byCategory[cat];
            if (items.length === 0) return null;
            return (
              <section
                key={cat}
                className="grid gap-8 md:grid-cols-[10rem_1fr]"
              >
                <div className="flex flex-col items-start gap-4">
                  <EvidenceIcon category={cat} />
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
                    {LABELS[cat]}
                  </p>
                </div>
                <ul className="divide-y rule-soft border-y rule-soft">
                  {items.map((r) => (
                    <li
                      key={r.id}
                      className="grid gap-6 py-6 md:grid-cols-[1fr_auto] md:items-start"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                          {r.kicker}
                        </p>
                        <h3
                          className="mt-3 font-serif-display"
                          style={{ fontSize: "1.5rem", lineHeight: 1.15 }}
                        >
                          {r.title}
                        </h3>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                          {r.journal} · {r.year}
                          {r.authors ? ` · ${r.authors}` : ""}
                        </p>
                      </div>
                      {r.url ? (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost self-start md:self-center"
                        >
                          Read Study
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-24 border-t rule-soft pt-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            Selected peer-reviewed research on heat and cold exposure
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            FRAM does not provide medical advice.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
