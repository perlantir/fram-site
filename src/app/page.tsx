import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="mx-auto px-6 pt-6 pb-14 md:px-12 md:pt-8 md:pb-20">
          <h1
            className="font-serif-display text-[color:var(--color-charcoal)]"
            style={{ fontSize: "var(--text-display)" }}
          >
            A Nordic
            <br />
            Experience.
          </h1>
          <p className="kicker kicker-muted mt-6">Residential Saunas.</p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/saunas" className="btn-primary">
              Explore Saunas
            </Link>
            <Link href="/inquire" className="btn-ghost">
              Begin a project <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Architectural plan image */}
        <div className="border-t rule-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home-design-illustration.png"
            alt="FRAM — architectural plan"
            className="w-full object-contain bg-[color:var(--color-ivory-soft)]"
            style={{ maxHeight: "520px" }}
          />
        </div>

        {/* Design section */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-14 px-6 py-16 md:grid-cols-12 md:px-12 md:py-20">
            <div className="md:col-span-4">
              <p className="kicker kicker-muted">Design.</p>
              <h2
                className="mt-8 font-serif-display"
                style={{ fontSize: "var(--text-title)" }}
              >
                Intentional.
                <br />
                Functional.
                <br />
                Timeless.
              </h2>
              <p className="mt-10 max-w-sm text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                Every FRAM sauna is drawn from the same principle — that the
                room disappears and only the experience remains. Materials are
                chosen for the way they age. Details for the way they feel.
              </p>
              <Link href="/saunas" className="mt-10 inline-flex btn-ghost">
                Explore Designs <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Evidence dark section */}
        <section className="bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]">
          <div className="mx-auto grid gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker" style={{ color: "var(--color-ivory)" }}>
                Evidence.
              </p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-serif-display" style={{ fontSize: "var(--text-title)" }}>
                Sauna,
                <br />
                Studied.
              </h2>
              <Link
                href="/evidence"
                className="mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]"
              >
                Explore Evidence <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Process section */}
        <section className="border-t rule-soft">
          <div className="mx-auto px-6 py-24 md:px-12 md:py-32">
            <h2
              className="font-serif-display"
              style={{ fontSize: "var(--text-title)" }}
            >
              Residential sauna,
              <br />
              resolved.
            </h2>
            <div className="mt-16 grid gap-12 border-t rule-soft pt-12 md:grid-cols-3 md:gap-8">
              <div>
                <p className="kicker kicker-muted">I — Select</p>
                <p className="mt-6 text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                  Choose the FRAM model designed for your space and expression.
                </p>
              </div>
              <div>
                <p className="kicker kicker-muted">II — Size</p>
                <p className="mt-6 text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                  Select the defined two-, four-, or six-person footprint.
                </p>
              </div>
              <div>
                <p className="kicker kicker-muted">III — Complete</p>
                <p className="mt-6 text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                  Materials, heat, lighting, and detailing are already resolved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inquire CTA */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker kicker-muted">Inquire.</p>
            </div>
            <div className="md:col-span-8">
              <Link href="/inquire" className="btn-primary">
                Begin a Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
