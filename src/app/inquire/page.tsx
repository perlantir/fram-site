import { asc } from "drizzle-orm";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/db";
import { products } from "@/db/schema";
import { InquiryForm } from "./InquiryForm";

export const metadata = { title: "Inquire" };
export const dynamic = "force-dynamic";

export default async function InquirePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const list = await db
    .select({ slug: products.slug, name: products.name })
    .from(products)
    .orderBy(asc(products.order));

  return (
    <>
      <Header />
      <main className="mx-auto grid gap-16 px-6 pt-20 pb-24 md:grid-cols-12 md:px-10">
        <section className="md:col-span-4">
          <p className="kicker kicker-muted">Inquire.</p>
          <h1
            className="mt-6 font-serif-display"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Begin a<br />
            project.
          </h1>
          <p className="mt-8 max-w-sm text-base leading-relaxed text-[color:var(--color-charcoal)]/80">
            Tell us about your space, timeline, and how you'd like to use your
            sauna. We'll follow up with references, drawings, and a quote.
          </p>
          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="kicker kicker-muted">Email</dt>
              <dd className="mt-2">hello@fram.example</dd>
            </div>
            <div>
              <dt className="kicker kicker-muted">Hours</dt>
              <dd className="mt-2">Mon — Fri · 9–5 CT</dd>
            </div>
          </dl>
        </section>
        <section className="md:col-span-8">
          <InquiryForm products={list} defaultProduct={product} />
        </section>
      </main>
      <Footer />
    </>
  );
}
