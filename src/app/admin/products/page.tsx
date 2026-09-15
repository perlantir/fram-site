import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsList() {
  const rows = await db.select().from(products).orderBy(asc(products.order));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="kicker kicker-muted">Catalog.</p>
          <h1 className="mt-4 font-serif-display" style={{ fontSize: "2.5rem" }}>
            Products.
          </h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          New product
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            <th className="py-3">Name</th>
            <th className="py-3">Slug</th>
            <th className="py-3">Tagline</th>
            <th className="py-3">Order</th>
            <th className="py-3">Status</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b rule-soft align-middle">
              <td className="py-4 font-medium">{r.name}</td>
              <td className="py-4 font-mono text-xs">{r.slug}</td>
              <td className="py-4">{r.tagline}</td>
              <td className="py-4">{r.order}</td>
              <td className="py-4">
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                    r.published
                      ? "border-emerald-700 text-emerald-700"
                      : "border-[color:var(--color-muted)] text-[color:var(--color-muted)]"
                  }`}
                >
                  {r.published ? "Live" : "Draft"}
                </span>
              </td>
              <td className="py-4 text-right">
                <Link
                  href={`/admin/products/${r.id}`}
                  className="mr-4 underline text-[11px] uppercase tracking-[0.16em]"
                >
                  Edit
                </Link>
                <form action={deleteProduct} className="inline">
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    className="text-[11px] uppercase tracking-[0.16em] text-red-700"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[color:var(--color-muted)]">
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
