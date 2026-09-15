import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="mx-auto px-6 pt-24 pb-40 md:px-10 md:pt-40 md:pb-56">
          <p className="kicker kicker-muted">Residential Saunas.</p>
          <h1 className="mt-8 font-serif-display text-[color:var(--color-charcoal)]"
              style={{ fontSize: "var(--text-display)" }}>
            A Nordic
            <br />
            Experience.
          </h1>
          <div className="mt-14 max-w-md">
            <p className="text-lg leading-relaxed text-[color:var(--color-charcoal)]/80">
              We build considered, hand-crafted saunas for the modern home —
              engineered for four-season use, softened by the honest character
              of wood and steam.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <Link href="/saunas" className="btn-primary">
              Explore Saunas
            </Link>
            <Link href="/inquire" className="btn-ghost">
              Begin a project
            </Link>
          </div>
        </section>

        {/* Design section */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-10 px-6 py-24 md:grid-cols-12 md:px-10 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker kicker-muted">01 — Design.</p>
              <h2 className="mt-6 font-serif-display" style={{ fontSize: "var(--text-title)" }}>
                Intentional.
                <br />
                Functional.
                <br />
                Timeless.
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-[color:var(--color-charcoal)]/80">
                Every FRAM sauna is drawn from the same principle — that the
                room disappears and only the experience remains. Materials are
                chosen for the way they age. Details for the way they feel.
              </p>
              <Link href="/saunas" className="mt-10 inline-flex btn-ghost">
                Explore Designs
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="aspect-[16/11] w-full border rule bg-[color:var(--color-ivory-soft)]">
                <svg viewBox="0 0 800 550" className="h-full w-full">
                  <g fill="none" stroke="#171716" strokeWidth="1">
                    <rect x="40" y="40" width="720" height="470" strokeWidth="1.5" />
                    <rect x="80" y="80" width="640" height="390" />
                    <line x1="80" y1="230" x2="720" y2="230" />
                    <line x1="80" y1="330" x2="720" y2="330" />
                    <circle cx="180" cy="160" r="46" />
                    <circle cx="180" cy="160" r="28" />
                    <circle cx="180" cy="160" r="12" />
                    <path d="M560 470 Q560 380 660 380" strokeDasharray="4 4" />
                    <line x1="540" y1="470" x2="680" y2="470" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence dark section */}
        <section className="bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]">
          <div className="mx-auto grid gap-10 px-6 py-24 md:grid-cols-12 md:px-10 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker" style={{ color: "var(--color-ivory)" }}>
                02 — Evidence.
              </p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-serif-display" style={{ fontSize: "var(--text-title)" }}>
                Sauna,
                <br />
                Studied.
              </h2>
              <p className="mt-8 max-w-lg text-base leading-relaxed opacity-80">
                Peer-reviewed research on heat and cold exposure and human
                health — collected in one place so you can read the science
                yourself.
              </p>
              <Link
                href="/evidence"
                className="mt-10 inline-flex items-center gap-3 border-b border-[color:var(--color-ivory)] pb-1 text-[11px] uppercase tracking-[0.18em]"
              >
                Explore Evidence <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Inquire CTA */}
        <section className="border-t rule-soft">
          <div className="mx-auto grid gap-10 px-6 py-24 md:grid-cols-12 md:px-10 md:py-32">
            <div className="md:col-span-4">
              <p className="kicker kicker-muted">03 — Inquire.</p>
              <h2 className="mt-6 font-serif-display" style={{ fontSize: "var(--text-title)" }}>
                Begin a
                <br />
                project.
              </h2>
            </div>
            <div className="md:col-span-8 flex md:justify-end md:items-end">
              <Link href="/inquire" className="btn-primary">
                Begin a Project →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
