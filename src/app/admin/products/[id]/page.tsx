import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { priceTiers, products } from "@/db/schema";
import { ProductForm } from "../ProductForm";
import { addPriceTier, removePriceTier } from "../actions";
import { formatUSD } from "@/lib/utils";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pid = Number(id);
  if (!pid) notFound();
  const product = await db.query.products.findFirst({ where: eq(products.id, pid) });
  if (!product) notFound();
  const tiers = await db
    .select()
    .from(priceTiers)
    .where(eq(priceTiers.productId, pid))
    .orderBy(asc(priceTiers.order));

  return (
    <div>
      <p className="kicker kicker-muted">Edit.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2.5rem" }}>
        {product.name}.
      </h1>

      <ProductForm
        initial={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          tagline: product.tagline,
          subtitle: product.subtitle,
          wood: product.wood,
          paneling: product.paneling,
          benches: product.benches,
          heater: product.heater,
          door: product.door,
          light: product.light,
          capacity: product.capacity,
          description: product.description,
          heroImage: product.heroImage,
          planSvg: product.planSvg,
          elevationSvg: product.elevationSvg,
          order: product.order,
          published: product.published,
          detailsJson: (product.detailsJson ?? {}) as Record<string, string>,
        }}
      />

      <section className="mt-16 border-t rule-soft pt-12">
        <p className="kicker kicker-muted">Pricing.</p>
        <h2 className="mt-4 mb-6 font-serif-display" style={{ fontSize: "1.75rem" }}>
          Price tiers
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              <th className="py-2">Label</th>
              <th className="py-2">Price</th>
              <th className="py-2">Order</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.id} className="border-b rule-soft">
                <td className="py-2">{t.label}</td>
                <td className="py-2">{formatUSD(t.priceCents)}</td>
                <td className="py-2">{t.order}</td>
                <td className="py-2 text-right">
                  <form action={removePriceTier} className="inline">
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="text-[11px] uppercase tracking-[0.16em] text-red-700"
                    >
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form action={addPriceTier} className="mt-6 grid gap-4 md:grid-cols-4">
          <input type="hidden" name="productId" value={product.id} />
          <div>
            <label>Label</label>
            <input name="label" required placeholder="4 PERSON" />
          </div>
          <div>
            <label>Price (USD)</label>
            <input name="priceCents" type="number" required placeholder="1750000" />
          </div>
          <div>
            <label>Order</label>
            <input name="order" type="number" defaultValue={tiers.length + 1} />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" type="submit">
              Add tier
            </button>
          </div>
        </form>
        <p className="mt-2 text-xs text-[color:var(--color-muted)]">
          Price is stored in cents (e.g. 1750000 = $17,500).
        </p>
      </section>
    </div>
  );
}
