import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DetailAccordion } from "@/components/site/DetailAccordion";
import { PriceTiers } from "@/components/site/PriceTiers";
import { db } from "@/db";
import { priceTiers, products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await db.query.products.findFirst({ where: eq(products.slug, slug) });
  if (!p) return { title: "Sauna" };
  return {
    title: `${p.name} — ${p.tagline}`,
    description: p.subtitle,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  if (!product) notFound();

  const tiers = await db
    .select()
    .from(priceTiers)
    .where(eq(priceTiers.productId, product.id))
    .orderBy(asc(priceTiers.order));

  const siblings = await db
    .select({ slug: products.slug, name: products.name, order: products.order })
    .from(products)
    .orderBy(asc(products.order));

  const spec = (product.specJson ?? {}) as Record<string, string>;
  const details = (product.detailsJson ?? {}) as Record<string, string>;

  return (
    <>
      <Header />

      <main className="mx-auto px-6 pt-6 pb-24 md:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
          <Link href="/saunas" className="hover:text-[color:var(--color-charcoal)]">
            Saunas
          </Link>
          <span>/</span>
          <span className="text-[color:var(--color-charcoal)]">{product.name}</span>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {/* Left rail — sibling model list */}
          <aside className="md:col-span-1">
            <ul className="flex flex-row gap-6 md:flex-col md:gap-0 md:space-y-3 md:sticky md:top-24">
              {siblings.map((s) => {
                const active = s.slug === product.slug;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/saunas/${s.slug}`}
                      className={`block text-[10px] uppercase tracking-[0.22em] ${
                        active
                          ? "font-medium text-[color:var(--color-charcoal)]"
                          : "text-[color:var(--color-muted)] hover:text-[color:var(--color-charcoal)]"
                      }`}
                    >
                      {s.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Middle — title, specs, price, CTA */}
          <section className="md:col-span-4">
            <h1
              className="font-serif-display"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {product.name}.
            </h1>
            <p className="mt-4 font-serif-display text-[color:var(--color-charcoal)]"
               style={{ fontSize: "1.35rem", fontStyle: "italic", lineHeight: 1.2 }}>
              {product.tagline}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-charcoal)]">
              {product.subtitle}
            </p>

            {/* Spec grid */}
            <dl className="mt-10 grid grid-cols-[6.5rem_1fr]">
              {Object.entries(spec).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="spec-key">{k}</dt>
                  <dd className="spec-val">{v}</dd>
                </div>
              ))}
            </dl>

            {product.description ? (
              <p className="mt-10 max-w-md text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                {product.description}
              </p>
            ) : null}

            {/* Sizes */}
            <div className="mt-12">
              <p className="kicker kicker-muted mb-4">Sizes</p>
              {tiers.length > 0 ? (
                <PriceTiers
                  tiers={tiers.map((t) => ({
                    id: t.id,
                    label: t.label,
                    priceCents: t.priceCents,
                  }))}
                />
              ) : (
                <p className="text-sm text-[color:var(--color-muted)]">Pricing on request.</p>
              )}
            </div>

            <div className="mt-10 flex flex-col items-start gap-6">
              <Link
                href={`/inquire?product=${product.slug}`}
                className="btn-primary w-full max-w-xs justify-center"
              >
                Inquire
              </Link>
              <a
                href={`/api/spec/${product.slug}`}
                className="btn-ghost"
                rel="noopener"
              >
                Download Specs <span className="arrow">↓</span>
              </a>
            </div>
          </section>

          {/* Right — product hero */}
          <section className="md:col-span-7">
            <div className="w-full overflow-hidden border rule bg-[color:var(--color-ivory-soft)]">
              {product.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.heroImage}
                  alt={`${product.name} — ${product.tagline}`}
                  className="w-full h-auto block"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 60% 60% at 50% 70%, rgba(23,23,22,0.22), transparent 65%), linear-gradient(155deg, rgba(23,23,22,0.06), rgba(23,23,22,0.14))",
                  }}
                  aria-label={`${product.name} — image placeholder`}
                />
              )}
            </div>
          </section>
        </div>

        {/* Drawings + Details */}
        <div className="mt-24 grid gap-10 border-t rule-soft pt-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="kicker kicker-muted">Plan View</p>
            <div className="mt-4 aspect-[4/3] w-full border rule bg-white/50 p-3">
              {product.planSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.planSvg}
                  alt={`${product.name} plan view`}
                  className="h-full w-full object-contain"
                />
              ) : null}
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="kicker kicker-muted">Front Elevation</p>
            <div className="mt-4 aspect-[4/3] w-full border rule bg-white/50 p-3">
              {product.elevationSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.elevationSvg}
                  alt={`${product.name} elevation`}
                  className="h-full w-full object-contain"
                />
              ) : null}
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="kicker kicker-muted mb-4">Details</p>
            <DetailAccordion details={details} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
