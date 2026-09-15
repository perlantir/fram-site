"use server";

import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const schema = z.object({
  token: z.string().min(8),
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  password: z.string().min(12).max(200),
});

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function bootstrapAdmin(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, error: "Invalid input." };
  }
  const [{ v }] = await db.select({ v: count() }).from(users);
  if (v > 0) return { ok: false, error: "Bootstrap disabled — users already exist." };

  const expected = process.env.BOOTSTRAP_TOKEN;
  if (!expected || !safeEqual(parsed.data.token, expected)) {
    return { ok: false, error: "Invalid bootstrap token." };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const [row] = await db
    .insert(users)
    .values({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || null,
      role: "admin",
      passwordHash,
    })
    .returning();
  await recordAudit({
    userId: row.id,
    userEmail: row.email,
    action: "user.bootstrap",
    entity: "user",
    entityId: row.id,
  });
  redirect("/admin/login");
}
