import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] px-6 py-32 md:px-10">
        <p className="kicker kicker-muted">404.</p>
        <h1 className="mt-8 font-serif-display" style={{ fontSize: "var(--text-hero)" }}>
          Not here.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed">
          The page you followed doesn't exist — or it's moved.
        </p>
        <div className="mt-10">
          <Link href="/" className="btn-ghost">
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
