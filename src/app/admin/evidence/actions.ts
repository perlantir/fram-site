"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { evidenceCitations } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const schema = z.object({
  id: z.coerce.number().int().optional(),
  category: z.enum(["longevity", "mind", "heat", "cold"]),
  kicker: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(300),
  authors: z.string().trim().max(300).optional().or(z.literal("")),
  journal: z.string().trim().min(1).max(200),
  year: z.coerce.number().int().min(1900).max(2100),
  url: z.string().trim().url().max(500).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export async function upsertEvidence(_prev: unknown, formData: FormData) {
  const actor = await requireRole("editor");
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse({
    ...raw,
    published: raw.published === "on" || raw.published === "true",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const data = parsed.data;
  if (data.id) {
    const before = await db.query.evidenceCitations.findFirst({
      where: eq(evidenceCitations.id, data.id),
    });
    const [row] = await db
      .update(evidenceCitations)
      .set({
        category: data.category,
        kicker: data.kicker,
        title: data.title,
        authors: data.authors || null,
        journal: data.journal,
        year: data.year,
        url: data.url || null,
        order: data.order,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(evidenceCitations.id, data.id))
      .returning();
    await recordAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "evidence.update",
      entity: "evidence",
      entityId: row.id,
      before,
      after: row,
    });
  } else {
    const [row] = await db
      .insert(evidenceCitations)
      .values({
        category: data.category,
        kicker: data.kicker,
        title: data.title,
        authors: data.authors || null,
        journal: data.journal,
        year: data.year,
        url: data.url || null,
        order: data.order,
        published: data.published,
      })
      .returning();
    await recordAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "evidence.create",
      entity: "evidence",
      entityId: row.id,
      after: row,
    });
  }
  revalidatePath("/evidence");
  revalidatePath("/admin/evidence");
  redirect("/admin/evidence");
}

export async function deleteEvidence(formData: FormData) {
  const actor = await requireRole("admin");
  const id = Number(formData.get("id"));
  if (!id) return;
  const before = await db.query.evidenceCitations.findFirst({
    where: eq(evidenceCitations.id, id),
  });
  await db.delete(evidenceCitations).where(eq(evidenceCitations.id, id));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "evidence.delete",
    entity: "evidence",
    entityId: id,
    before,
  });
  revalidatePath("/evidence");
  revalidatePath("/admin/evidence");
}
