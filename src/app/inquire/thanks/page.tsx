import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = { title: "Thank you" };

export default function ThanksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto px-6 py-32 md:px-10 min-h-[60vh]">
        <p className="kicker kicker-muted">Thank you.</p>
        <h1
          className="mt-8 font-serif-display"
          style={{ fontSize: "var(--text-hero)" }}
        >
          We'll be in touch.
        </h1>
        <p className="mt-8 max-w-lg text-base leading-relaxed">
          Your inquiry is received. Expect a personal reply within one business
          day — usually much sooner.
        </p>
        <div className="mt-12">
          <Link href="/" className="btn-ghost">
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
