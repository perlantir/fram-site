import { hash } from "@node-rs/argon2";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });

  console.log("→ seeding products");

  const [fram01] = await db
    .insert(schema.products)
    .values({
      slug: "fram-01",
      name: "FRAM 01",
      tagline: "Cedar",
      subtitle: "Warm. Crafted. Timeless.",
      wood: "Western Red Cedar",
      paneling: "Horizontal",
      benches: "Closed",
      heater: "HUUM",
      door: "Full Glass",
      light: "Warm",
      capacity: "4–6 People",
      description:
        "Clean red cedar with wide closed benches create a warm, timeless sauna experience designed to restore body and mind.",
      heroImage: "/images/fram-01-hero.jpg",
      order: 1,
      specJson: {
        WOOD: "Western Red Cedar",
        PANELING: "Horizontal",
        BENCHES: "Closed",
        HEATER: "HUUM",
        DOOR: "Full Glass",
        LIGHT: "Warm",
        CAPACITY: "4–6 People",
      },
      detailsJson: {
        MATERIALS:
          "FSC-certified Western Red Cedar throughout. Stainless fasteners. Marine-grade glass door with tempered safety glass.",
        CONSTRUCTION:
          "Framed on kiln-dried spruce with a 2-layer thermal envelope. Delivered fully assembled or as a factory-cut kit.",
        HEATER:
          "HUUM DROP electric heater in stainless. 6kW or 9kW depending on volume. UL-listed control unit included.",
        LIGHTING:
          "Warm-toned indirect LED strips beneath the upper bench. Dimmable at the wall.",
        DIMENSIONS: "76\" W × 76\" D × 84\" H interior. Custom sizes available.",
        "INCLUDED FEATURES":
          "Heater, stones, backrest, bucket + ladle, digital control, delivery within US.",
      },
      planSvg: "/plans/fram-01-plan.svg",
      elevationSvg: "/plans/fram-01-elevation.svg",
    })
    .returning();

  const [fram02] = await db
    .insert(schema.products)
    .values({
      slug: "fram-02",
      name: "FRAM 02",
      tagline: "Thermowood",
      subtitle: "Clean. Nordic. Modern.",
      wood: "Thermowood (Thermo Aspen)",
      paneling: "Vertical",
      benches: "Closed",
      heater: "HUUM",
      door: "Full Glass",
      light: "Warm",
      capacity: "4–6 People",
      description:
        "Thermally modified aspen with closed benches and hidden lighting deliver a clean, modern sauna experience built for balance and performance.",
      heroImage: "/images/fram-02-hero.jpg",
      order: 2,
      specJson: {
        WOOD: "Thermowood (Thermo Aspen)",
        PANELING: "Vertical",
        BENCHES: "Closed",
        HEATER: "HUUM",
        DOOR: "Full Glass",
        LIGHT: "Warm",
        CAPACITY: "4–6 People",
      },
      detailsJson: {
        MATERIALS:
          "Thermally modified aspen. Naturally rot-resistant, low-odor, dimensionally stable.",
        CONSTRUCTION:
          "Vertical paneling on kiln-dried framing with hidden LED channels. Assembled or knock-down.",
        HEATER: "HUUM DROP or CLIFF, 6kW–9kW, wall or floor mount.",
        LIGHTING: "Concealed dimmable LED wash behind upper bench.",
        DIMENSIONS: "76\" W × 76\" D × 84\" H interior.",
        "INCLUDED FEATURES":
          "Heater, stones, backrest, bucket + ladle, digital control, delivery within US.",
      },
      planSvg: "/plans/fram-02-plan.svg",
      elevationSvg: "/plans/fram-02-elevation.svg",
    })
    .returning();

  const [fram03] = await db
    .insert(schema.products)
    .values({
      slug: "fram-03",
      name: "FRAM 03",
      tagline: "Outdoor",
      subtitle: "Refined. Natural. Elemental.",
      wood: "Thermally Modified Cedar",
      paneling: "Horizontal (light)",
      benches: "Distinct Slates",
      heater: "HUUM",
      door: "Full Glass Panoramic",
      light: "Warm",
      capacity: "4–6 People",
      description:
        "Distills the Nordic lighthouse into a modern outdoor form. FRAM 03 brings timeless Scandinavian design to outdoor wellness, inspired by coastal boathouses. Elemental materials and thoughtful details for an experience that stands apart.",
      heroImage: "/images/fram-03-hero.jpg",
      order: 3,
      specJson: {
        WOOD: "Thermally Modified Cedar",
        PANELING: "Horizontal (light)",
        BENCHES: "Distinct Slates",
        HEATER: "HUUM",
        DOOR: "Full Glass Panoramic",
        LIGHT: "Warm",
        CAPACITY: "4–6 People",
      },
      detailsJson: {
        MATERIALS:
          "Charred cedar exterior (shou sugi ban). Thermo cedar interior. Standing-seam metal roof.",
        CONSTRUCTION:
          "Weather-sealed exterior on pressure-treated skids. Insulated for four-season use. Prewired.",
        HEATER: "HUUM DROP 9kW with outdoor-rated control panel.",
        LIGHTING: "Warm LED wash inside; low-glare exterior wall sconce.",
        DIMENSIONS: "10' × 8' footprint. 8'-8\" ridge height.",
        "INCLUDED FEATURES":
          "Heater, stones, backrest, bucket + ladle, digital control, delivery within US.",
      },
      planSvg: "/plans/fram-03-plan.svg",
      elevationSvg: "/plans/fram-03-elevation.svg",
    })
    .returning();

  console.log("→ seeding price tiers");
  await db.insert(schema.priceTiers).values([
    { productId: fram01.id, label: "4 PERSON", priceCents: 1750000, order: 1 },
    { productId: fram01.id, label: "5 PERSON", priceCents: 1990000, order: 2 },
    { productId: fram01.id, label: "6 PERSON", priceCents: 2290000, order: 3 },
    { productId: fram02.id, label: "4 PERSON", priceCents: 1990000, order: 1 },
    { productId: fram02.id, label: "5 PERSON", priceCents: 2290000, order: 2 },
    { productId: fram02.id, label: "6 PERSON", priceCents: 2590000, order: 3 },
    { productId: fram03.id, label: "4–5 PERSON", priceCents: 3550000, order: 1 },
    { productId: fram03.id, label: "6 PERSON", priceCents: 3990000, order: 2 },
  ]);

  console.log("→ seeding evidence citations");
  await db.insert(schema.evidenceCitations).values([
    {
      category: "longevity",
      kicker: "Sauna Bathing & Longevity — JAMA Internal Medicine",
      title:
        "Association Between Sauna Bathing and Fatal Cardiovascular and All-Cause Mortality Events",
      journal: "JAMA Internal Medicine",
      year: 2015,
      authors: "Laukkanen T, Khan H, Zaccardi F, Laukkanen JA",
      url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2130724",
      order: 1,
    },
    {
      category: "mind",
      kicker: "Sauna Bathing & Cognitive Health — Age and Ageing",
      title:
        "Sauna Bathing is Inversely Associated with Dementia and Alzheimer's Disease in Middle-Aged Finnish Men",
      journal: "Age and Ageing",
      year: 2017,
      authors: "Laukkanen T et al.",
      url: "https://academic.oup.com/ageing/article/46/2/245/2654230",
      order: 1,
    },
    {
      category: "heat",
      kicker: "Health Benefits of Sauna Bathing — Mayo Clinic Proceedings",
      title:
        "Cardiovascular and Other Health Benefits of Sauna Bathing: A Review of the Evidence",
      journal: "Mayo Clinic Proceedings",
      year: 2018,
      authors: "Laukkanen JA, Laukkanen T, Kunutsor SK",
      url: "https://www.mayoclinicproceedings.org/article/S0025-6196(18)30275-1/fulltext",
      order: 1,
    },
    {
      category: "cold",
      kicker: "Cold-Water Immersion & Wellbeing — PLOS ONE PDF",
      title:
        "Effects of Cold-Water Immersion on Health and Wellbeing: A Systematic Review and Meta-Analysis",
      journal: "PLOS ONE",
      year: 2022,
      authors: "Espeland D, de Weerd L, Mercer JB",
      url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0275414",
      order: 1,
    },
  ]);

  console.log("→ seeding bootstrap admin (if BOOTSTRAP_ADMIN_EMAIL is set)");
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    await db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        role: "admin",
        name: "Bootstrap Admin",
      })
      .onConflictDoNothing();
    console.log(`✓ bootstrap admin: ${email}`);
  } else {
    console.log("  (skipped — set BOOTSTRAP_ADMIN_EMAIL + BOOTSTRAP_ADMIN_PASSWORD to create one)");
  }

  console.log("✓ seed complete");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
