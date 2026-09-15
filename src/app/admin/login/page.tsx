import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { Wordmark } from "@/components/site/Wordmark";

export const metadata = { title: "Sign in — Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-16">
        <Wordmark />
      </div>
      <p className="kicker kicker-muted">Admin.</p>
      <h1
        className="mt-4 font-serif-display"
        style={{ fontSize: "2.5rem" }}
      >
        Sign in.
      </h1>
      <LoginForm error={error} />
      <p className="mt-16 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
        <Link href="/">← Return to site</Link>
      </p>
    </main>
  );
}
