import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="mt-32 border-t rule-soft">
      <div className="mx-auto px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Wordmark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[color:var(--color-charcoal)]/80">
              FRAM designs residential saunas rooted in Nordic tradition —
              refined, natural, elemental.
            </p>
          </div>
          <div>
            <p className="kicker kicker-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/saunas" className="hover:underline">
                  Saunas
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="hover:underline">
                  Evidence
                </Link>
              </li>
              <li>
                <Link href="/inquire" className="hover:underline">
                  Inquire
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="kicker kicker-muted">Contact</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>hello@fram.example</li>
              <li>Mon — Fri 9–5 CT</li>
              <li>
                <Link href="/inquire" className="link-arrow">
                  Begin a project
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t rule-soft pt-6 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-muted)] md:flex-row">
          <p>© {new Date().getFullYear()} FRAM.</p>
          <p>FRAM does not provide medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
