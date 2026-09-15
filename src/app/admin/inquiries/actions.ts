"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { sendMail } from "@/lib/mail";

const updateSchema = z.object({
  id: z.coerce.number().int(),
  status: z.enum(["new", "in_review", "quoted", "won", "lost"]),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export async function updateInquiry(formData: FormData) {
  const actor = await requireRole("editor");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const before = await db.query.inquiries.findFirst({
    where: eq(inquiries.id, parsed.data.id),
  });
  const [row] = await db
    .update(inquiries)
    .set({
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, parsed.data.id))
    .returning();
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "inquiry.update",
    entity: "inquiry",
    entityId: row.id,
    before,
    after: row,
  });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${row.id}`);
}

const replySchema = z.object({
  id: z.coerce.number().int(),
  subject: z.string().trim().min(2).max(200),
  body: z.string().trim().min(2).max(10000),
});

export async function replyToInquiry(formData: FormData) {
  const actor = await requireRole("editor");
  const parsed = replySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const inquiry = await db.query.inquiries.findFirst({
    where: eq(inquiries.id, parsed.data.id),
  });
  if (!inquiry) return;

  await sendMail({
    to: inquiry.email,
    subject: parsed.data.subject,
    text: parsed.data.body,
  });

  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "inquiry.reply",
    entity: "inquiry",
    entityId: inquiry.id,
    after: { subject: parsed.data.subject },
  });
}
