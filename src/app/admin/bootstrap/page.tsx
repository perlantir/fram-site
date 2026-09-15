import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { BootstrapForm } from "./BootstrapForm";
import { Wordmark } from "@/components/site/Wordmark";

export const metadata = { title: "Bootstrap admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BootstrapPage() {
  const [{ v }] = await db.select({ v: count() }).from(users);
  if (v > 0) redirect("/admin/login");
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-16">
        <Wordmark />
      </div>
      <p className="kicker kicker-muted">Bootstrap.</p>
      <h1 className="mt-4 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Create first admin.
      </h1>
      <p className="mt-6 text-sm text-[color:var(--color-charcoal)]/80">
        This page is only accessible while the users table is empty. Provide the
        <code className="mx-1 font-mono">BOOTSTRAP_TOKEN</code> from your env to
        prove you own the deployment.
      </p>
      <BootstrapForm />
    </main>
  );
}
