import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, asc } from "drizzle-orm";
import * as schema from "../src/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });

  // FRAM 01: update lighting spec, clear description
  await db.update(schema.products)
    .set({
      description: "",
      specJson: {
        WOOD: "Western Red Cedar",
        PANELING: "Horizontal",
        BENCHES: "Closed",
        HEATER: "HUUM",
        DOOR: "Full Glass",
        LIGHT: "Marine light",
        CAPACITY: "2–6 People",
      },
    })
    .where(eq(schema.products.slug, "fram-01"));
  console.log("✓ FRAM 01 updated");

  // FRAM 02: tagline → "Aspen", specJson wood + lighting, clear description
  await db.update(schema.products)
    .set({
      tagline: "Aspen",
      description: "",
      specJson: {
        WOOD: "Aspen (Thermowood)",
        PANELING: "Vertical",
        BENCHES: "Closed",
        HEATER: "HUUM",
        DOOR: "Full Glass",
        LIGHT: "Concealed LED lighting",
        CAPACITY: "2–6 People",
      },
    })
    .where(eq(schema.products.slug, "fram-02"));
  console.log("✓ FRAM 02 updated");

  // FRAM 03 → OUTDOOR, subtitle updated with Harbor credit
  await db.update(schema.products)
    .set({
      name: "OUTDOOR",
      subtitle: "In Partnership with Harbor Saunas.",
    })
    .where(eq(schema.products.slug, "fram-03"));
  console.log("✓ OUTDOOR updated");

  // Price tiers: relabel all products' tiers to 2-Person / 4-Person / 6-Person
  const tiers = await db
    .select()
    .from(schema.priceTiers)
    .orderBy(asc(schema.priceTiers.productId), asc(schema.priceTiers.order));

  const labelMap: Record<number, string> = { 1: "2-Person", 2: "4-Person", 3: "6-Person" };
  for (const tier of tiers) {
    const label = labelMap[tier.order];
    if (label) {
      await db.update(schema.priceTiers)
        .set({ label })
        .where(eq(schema.priceTiers.id, tier.id));
    }
  }
  console.log("✓ Price tiers relabeled (2-Person / 4-Person / 6-Person)");

  await sql.end();
  console.log("Done.");
}

main().catch(console.error);
