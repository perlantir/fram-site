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

      <main className="mx-auto px-6 pt-8 pb-24 md:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          <Link href="/saunas" className="hover:text-[color:var(--color-charcoal)]">
            Saunas
          </Link>
          <span>/</span>
          <span className="text-[color:var(--color-charcoal)]">{product.name}</span>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-12">
          {/* Left rail — sibling models */}
          <aside className="md:col-span-1">
            <ul className="space-y-4 md:sticky md:top-24">
              {siblings.map((s) => {
                const active = s.slug === product.slug;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/saunas/${s.slug}`}
                      className={`block text-[11px] uppercase tracking-[0.18em] ${
                        active
                          ? "text-[color:var(--color-charcoal)]"
                          : "text-[color:var(--color-muted)] hover:text-[color:var(--color-charcoal)]"
                      }`}
                    >
                      {s.name.replace("FRAM ", "FRAM ")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Middle — title + specs */}
          <section className="md:col-span-4">
            <h1 className="font-serif-display" style={{ fontSize: "var(--text-hero)" }}>
              {product.name}.
            </h1>
            <p className="mt-4 text-lg text-[color:var(--color-charcoal)]/80">
              {product.tagline}
              <br />
              <span className="text-[color:var(--color-charcoal)]">{product.subtitle}</span>
            </p>

            {/* Spec grid */}
            <dl className="mt-10 grid grid-cols-[7rem_1fr] gap-y-3 text-xs uppercase tracking-[0.14em]">
              {Object.entries(spec).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[color:var(--color-muted)]">{k}</dt>
                  <dd className="text-[color:var(--color-charcoal)]">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 max-w-md text-sm leading-relaxed text-[color:var(--color-charcoal)]/80">
              {product.description}
            </p>

            {/* Sizes / prices */}
            <div className="mt-10">
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

            <div className="mt-10 flex items-center gap-8">
              <Link
                href={`/inquire?product=${product.slug}`}
                className="btn-primary"
              >
                Inquire
              </Link>
              <a
                href={`/api/spec/${product.slug}`}
                className="btn-ghost"
                rel="noopener"
              >
                Download Specs
              </a>
            </div>
          </section>

          {/* Right — product hero image */}
          <section className="md:col-span-7">
            <div className="aspect-[4/3] w-full overflow-hidden border rule bg-[color:var(--color-ivory-soft)]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 50% 70%, rgba(23,23,22,0.20), transparent 65%), linear-gradient(135deg, rgba(23,23,22,0.06), rgba(23,23,22,0.10))",
                }}
              />
            </div>
          </section>
        </div>

        {/* Drawings + Details row */}
        <div className="mt-24 grid gap-10 border-t rule-soft pt-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="kicker kicker-muted">Plan View</p>
            <div className="mt-4 aspect-[4/3] w-full border rule bg-white/40">
              {product.planSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.planSvg}
                  alt={`${product.name} plan view`}
                  className="h-full w-full object-contain p-4"
                />
              ) : null}
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="kicker kicker-muted">Front Elevation</p>
            <div className="mt-4 aspect-[4/3] w-full border rule bg-white/40">
              {product.elevationSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.elevationSvg}
                  alt={`${product.name} elevation`}
                  className="h-full w-full object-contain p-4"
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
