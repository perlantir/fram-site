import Link from "next/link";
import { asc } from "drizzle-orm";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata = { title: "Saunas" };

export default async function SaunasIndex() {
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.order));

  return (
    <>
      <Header />
      <main className="mx-auto px-6 pt-20 pb-24 md:px-10">
        <p className="kicker kicker-muted">Saunas.</p>
        <h1
          className="mt-6 font-serif-display"
          style={{ fontSize: "var(--text-hero)" }}
        >
          Three saunas.
          <br />
          One philosophy.
        </h1>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-[color:var(--color-charcoal)]/80">
          Each model is a distinct expression of the same idea — that a sauna
          should be honest, considered, and built to be lived with.
        </p>

        <div className="mt-24 grid gap-12 border-t rule-soft pt-16 md:grid-cols-3 md:gap-8">
          {rows.map((p) => (
            <Link
              key={p.id}
              href={`/saunas/${p.slug}`}
              className="group block"
            >
              <div className="aspect-[4/5] w-full overflow-hidden border rule bg-[color:var(--color-ivory-soft)]">
                {p.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/images/${p.slug}-hero-card.jpg`}
                    alt={`${p.name} — ${p.tagline}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div
                    className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(23,23,22,0.04), rgba(23,23,22,0.08))`,
                    }}
                  />
                )}
              </div>
              <div className="mt-6">
                <p className="kicker kicker-muted">{p.tagline}</p>
                <h3
                  className="mt-3 font-serif-display"
                  style={{ fontSize: "2.25rem" }}
                >
                  {p.name}.
                </h3>
                <p className="mt-3 text-sm text-[color:var(--color-charcoal)]/80">
                  {p.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
