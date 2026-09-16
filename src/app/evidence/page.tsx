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
      <main className="mx-auto px-6 pt-10 pb-24 md:px-12">
        <h1
          className="font-serif-display"
          style={{ fontSize: "var(--text-hero)" }}
        >
          Evidence.
        </h1>
        <p className="mt-6 max-w-md text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-charcoal)]/70">
          Research on heat and cold exposure
          <br />
          and human health.
        </p>

        <div className="mt-16 border-t rule-soft">
          {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((cat) => {
            const items = byCategory[cat];
            if (items.length === 0) return null;
            return (
              <section
                key={cat}
                className="grid gap-8 border-b rule-soft py-10 md:grid-cols-[8rem_1fr]"
              >
                <div className="flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border rule text-[color:var(--color-charcoal)]">
                    <EvidenceIcon category={cat} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-charcoal)]/50">
                    {LABELS[cat]}
                  </p>
                </div>
                <ul className="divide-y rule-soft">
                  {items.map((r) => (
                    <li
                      key={r.id}
                      className="grid gap-6 py-6 md:grid-cols-[1fr_auto] md:items-start"
                    >
                      <div>
                        <h3
                          className="font-serif-display max-w-2xl"
                          style={{ fontSize: "1.5rem", lineHeight: 1.15 }}
                        >
                          {r.title}
                        </h3>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-charcoal)]/55">
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
                          Read Study <span className="arrow">→</span>
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-20 pt-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-charcoal)]/55">
            Selected peer-reviewed research on heat
            <br />
            and cold exposure.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-charcoal)]/55">
            FRAM does not provide medical advice.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
