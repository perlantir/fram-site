import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { priceTiers, products } from "@/db/schema";
import { formatUSD } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = await db.query.products.findFirst({ where: eq(products.slug, slug) });
  if (!p) return new NextResponse("Not found", { status: 404 });
  const tiers = await db
    .select()
    .from(priceTiers)
    .where(eq(priceTiers.productId, p.id));

  const spec = (p.specJson ?? {}) as Record<string, string>;
  const details = (p.detailsJson ?? {}) as Record<string, string>;

  const lines: string[] = [];
  lines.push(`FRAM — ${p.name}`);
  lines.push(`${p.tagline} · ${p.subtitle}`);
  lines.push("");
  lines.push("SPECIFICATIONS");
  for (const [k, v] of Object.entries(spec)) lines.push(`  ${k.padEnd(12)} ${v}`);
  lines.push("");
  lines.push("SIZES");
  for (const t of tiers) lines.push(`  ${t.label.padEnd(12)} ${formatUSD(t.priceCents)}`);
  lines.push("");
  lines.push("DETAILS");
  for (const [k, v] of Object.entries(details)) lines.push(`  ${k}\n    ${v}\n`);
  lines.push("");
  lines.push("Inquire: /inquire?product=" + p.slug);

  const body = lines.join("\n");
  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="${p.slug}-specs.txt"`,
    },
  });
}
