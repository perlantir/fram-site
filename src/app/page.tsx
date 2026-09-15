import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="mx-auto px-6 pt-16 pb-28 md:px-12 md:pt-24 md:pb-40">
          <p className="kicker kicker-muted">Residential Saunas.</p>
          <h1
            className="mt-8 font-serif-display text-[color:var(--color-charcoal)]"
            style={{ fontSize: "var(--text-display)" }}
          >
            A Nordic
            <br />
            Experience.
          </h1>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link href="/saunas" className="btn-primary">
              Explore Saunas
            </Link>
            <Link href="/inquire" className="btn-ghost">
              Begin a project <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Design section */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
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
            <div className="md:col-span-8">
              <div className="aspect-[16/10] w-full border rule bg-[color:var(--color-ivory-soft)]/40 p-4">
                <svg viewBox="0 0 800 500" className="h-full w-full">
                  <g fill="none" stroke="#171716" strokeWidth="1">
                    <rect x="30" y="30" width="740" height="440" strokeWidth="1.25" />
                    <rect x="70" y="70" width="660" height="360" />
                    <line x1="70" y1="210" x2="730" y2="210" />
                    <line x1="70" y1="310" x2="730" y2="310" />
                    <circle cx="170" cy="140" r="46" />
                    <circle cx="170" cy="140" r="28" />
                    <circle cx="170" cy="140" r="12" />
                    <path d="M580 430 Q580 340 660 340" strokeDasharray="4 4" />
                    <line x1="560" y1="430" x2="680" y2="430" strokeWidth="2" />
                  </g>
                </svg>
              </div>
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

        {/* Inquire CTA */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker kicker-muted">Inquire.</p>
            </div>
            <div className="md:col-span-8">
              <Link
                href="/inquire"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]"
              >
                Begin a Project <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
