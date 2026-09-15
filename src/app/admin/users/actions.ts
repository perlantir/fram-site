"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, newTotp, requireRole, verifyTotp } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const inviteSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.enum(["admin", "editor", "viewer"]),
  password: z.string().min(12).max(200),
});

export async function createUser(_prev: unknown, formData: FormData) {
  const actor = await requireRole("admin");
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const data = parsed.data;
  const emailNorm = data.email.toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, emailNorm) });
  if (existing) return { ok: false, error: "Email already exists." };
  const passwordHash = await hashPassword(data.password);
  const [row] = await db
    .insert(users)
    .values({
      email: emailNorm,
      name: data.name || null,
      role: data.role,
      passwordHash,
    })
    .returning();
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.create",
    entity: "user",
    entityId: row.id,
    after: { email: row.email, role: row.role },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

const updateSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["admin", "editor", "viewer"]),
  disabled: z.string().optional(),
});

export async function updateUser(formData: FormData) {
  const actor = await requireRole("admin");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const disabled = parsed.data.disabled === "on";
  const before = await db.query.users.findFirst({ where: eq(users.id, parsed.data.id) });
  const [row] = await db
    .update(users)
    .set({
      role: parsed.data.role,
      disabledAt: disabled ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, parsed.data.id))
    .returning();
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.update",
    entity: "user",
    entityId: row.id,
    before,
    after: row,
  });
  revalidatePath("/admin/users");
}

const passwordSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(12).max(200),
});

export async function resetPassword(formData: FormData) {
  const actor = await requireRole("admin");
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const passwordHash = await hashPassword(parsed.data.password);
  await db
    .update(users)
    .set({
      passwordHash,
      failedAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, parsed.data.id));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.password_reset",
    entity: "user",
    entityId: parsed.data.id,
  });
  revalidatePath("/admin/users");
}

export async function begin2fa(userId: string): Promise<{ secret: string; qr: string; url: string }> {
  const actor = await requireRole("admin");
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error("NOT_FOUND");
  const totp = newTotp(user.email);
  const url = totp.toString();
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 280 });
  const secret = (totp.secret as OTPAuth.Secret).base32;
  await db
    .update(users)
    .set({ totpSecret: secret, totpEnabled: false, updatedAt: new Date() })
    .where(eq(users.id, userId));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.2fa_begin",
    entity: "user",
    entityId: userId,
  });
  return { secret, qr, url };
}

export async function confirm2fa(formData: FormData) {
  const actor = await requireRole("admin");
  const userId = String(formData.get("id") ?? "");
  const token = String(formData.get("token") ?? "");
  if (!userId || !token) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.totpSecret) return;
  if (!verifyTotp(user.totpSecret, token)) return;
  await db
    .update(users)
    .set({ totpEnabled: true, updatedAt: new Date() })
    .where(eq(users.id, userId));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.2fa_enabled",
    entity: "user",
    entityId: userId,
  });
  revalidatePath("/admin/users");
}

export async function disable2fa(formData: FormData) {
  const actor = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db
    .update(users)
    .set({ totpSecret: null, totpEnabled: false, updatedAt: new Date() })
    .where(eq(users.id, id));
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.2fa_disabled",
    entity: "user",
    entityId: id,
  });
  revalidatePath("/admin/users");
}
