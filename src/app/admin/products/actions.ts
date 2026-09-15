"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { priceTiers, products } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const productSchema = z.object({
  id: z.coerce.number().int().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "lowercase, digits, dashes only"),
  name: z.string().trim().min(1).max(120),
  tagline: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().min(1).max(200),
  wood: z.string().trim().min(1).max(120),
  paneling: z.string().trim().max(120).optional().or(z.literal("")),
  benches: z.string().trim().max(120).optional().or(z.literal("")),
  heater: z.string().trim().max(120).optional().or(z.literal("")),
  door: z.string().trim().max(120).optional().or(z.literal("")),
  light: z.string().trim().max(120).optional().or(z.literal("")),
  capacity: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().min(1).max(4000),
  heroImage: z.string().trim().max(500).optional().or(z.literal("")),
  planSvg: z.string().trim().max(500).optional().or(z.literal("")),
  elevationSvg: z.string().trim().max(500).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
  materials: z.string().trim().max(4000).optional().or(z.literal("")),
  construction: z.string().trim().max(4000).optional().or(z.literal("")),
  heaterDetail: z.string().trim().max(4000).optional().or(z.literal("")),
  lighting: z.string().trim().max(4000).optional().or(z.literal("")),
  dimensions: z.string().trim().max(4000).optional().or(z.literal("")),
  features: z.string().trim().max(4000).optional().or(z.literal("")),
});

function buildSpec(input: z.infer<typeof productSchema>) {
  return {
    WOOD: input.wood,
    ...(input.paneling ? { PANELING: input.paneling } : {}),
    ...(input.benches ? { BENCHES: input.benches } : {}),
    ...(input.heater ? { HEATER: input.heater } : {}),
    ...(input.door ? { DOOR: input.door } : {}),
    ...(input.light ? { LIGHT: input.light } : {}),
    ...(input.capacity ? { CAPACITY: input.capacity } : {}),
  };
}

function buildDetails(input: z.infer<typeof productSchema>) {
  const out: Record<string, string> = {};
  if (input.materials) out.MATERIALS = input.materials;
  if (input.construction) out.CONSTRUCTION = input.construction;
  if (input.heaterDetail) out.HEATER = input.heaterDetail;
  if (input.lighting) out.LIGHTING = input.lighting;
  if (input.dimensions) out.DIMENSIONS = input.dimensions;
  if (input.features) out["INCLUDED FEATURES"] = input.features;
  return out;
}

export async function upsertProduct(_prev: unknown, formData: FormData) {
  const actor = await requireRole("editor");
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    published: raw.published === "on" || raw.published === "true",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    };
  }
  const input = parsed.data;
  const specJson = buildSpec(input);
  const detailsJson = buildDetails(input);

  if (input.id) {
    const before = await db.query.products.findFirst({ where: eq(products.id, input.id) });
    const [row] = await db
      .update(products)
      .set({
        slug: input.slug,
        name: input.name,
        tagline: input.tagline,
        subtitle: input.subtitle,
        wood: input.wood,
        paneling: input.paneling || null,
        benches: input.benches || null,
        heater: input.heater || null,
        door: input.door || null,
        light: input.light || null,
        capacity: input.capacity || null,
        description: input.description,
        heroImage: input.heroImage || null,
        planSvg: input.planSvg || null,
        elevationSvg: input.elevationSvg || null,
        order: input.order,
        published: input.published,
        specJson,
        detailsJson,
        updatedAt: new Date(),
      })
      .where(eq(products.id, input.id))
      .returning();
    await recordAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "product.update",
      entity: "product",
      entityId: row.id,
      before,
      after: row,
    });
  } else {
    const [row] = await db
      .insert(products)
      .values({
        slug: input.slug,
        name: input.name,
        tagline: input.tagline,
        subtitle: input.subtitle,
        wood: input.wood,
        paneling: input.paneling || null,
        benches: input.benches || null,
        heater: input.heater || null,
        door: input.door || null,
        light: input.light || null,
        capacity: input.capacity || null,
        description: input.description,
        heroImage: input.heroImage || null,
        planSvg: input.planSvg || null,
        elevationSvg: input.elevationSvg || null,
        order: input.order,
        published: input.published,
        specJson,
        detailsJson,
      })
      .returning();
    await recordAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "product.create",
      entity: "product",
      entityId: row.id,
      after: row,
    });
  }

  revalidatePath("/saunas");
  revalidatePath(`/saunas/${input.slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const actor = await requireRole("admin");
  const id = Number(formData.get("id"));
  if (!id) return;
  const before = await db.query.products.findFirst({ where: eq(products.id, id) });
  await db.delete(products).where(eq(products.id, id));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "product.delete",
    entity: "product",
    entityId: id,
    before,
  });
  revalidatePath("/admin/products");
  revalidatePath("/saunas");
}

const tierSchema = z.object({
  productId: z.coerce.number().int(),
  label: z.string().trim().min(1).max(40),
  priceCents: z.coerce.number().int().min(0),
  order: z.coerce.number().int().default(0),
});

export async function addPriceTier(formData: FormData) {
  const actor = await requireRole("editor");
  const parsed = tierSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const [row] = await db.insert(priceTiers).values(parsed.data).returning();
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "price_tier.create",
    entity: "price_tier",
    entityId: row.id,
    after: row,
  });
  revalidatePath("/admin/products");
}

export async function removePriceTier(formData: FormData) {
  const actor = await requireRole("editor");
  const id = Number(formData.get("id"));
  const productId = Number(formData.get("productId"));
  if (!id || !productId) return;
  await db
    .delete(priceTiers)
    .where(and(eq(priceTiers.id, id), eq(priceTiers.productId, productId)));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "price_tier.delete",
    entity: "price_tier",
    entityId: id,
  });
  revalidatePath("/admin/products");
}
