"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { inquiries, products } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { verifyTurnstile } from "@/lib/turnstile";
import { recordAudit } from "@/lib/audit";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  product: z.string().trim().max(50).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(), // honeypot
  cfToken: z.string().optional(),
});

export type InquiryState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const ua = h.get("user-agent") ?? "";

  const rl = rateLimit(`inquire:${ip}`, 5, 60_000 * 10);
  if (!rl.ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please review the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  if (data.website) {
    // Honeypot tripped — silently succeed to avoid leaking the trap
    return { ok: true };
  }

  if (data.cfToken) {
    const ok = await verifyTurnstile(data.cfToken, ip);
    if (!ok) return { ok: false, error: "Spam check failed. Please try again." };
  }

  let productId: number | null = null;
  if (data.product) {
    const p = await db.query.products.findFirst({
      where: eq(products.slug, data.product),
      columns: { id: true },
    });
    productId = p?.id ?? null;
  }

  const [row] = await db
    .insert(inquiries)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      productId,
      location: data.location || null,
      timeline: data.timeline || null,
      message: data.message,
      ip,
      userAgent: ua,
    })
    .returning();

  await recordAudit({
    action: "inquiry.created",
    entity: "inquiry",
    entityId: row.id,
    after: { name: row.name, email: row.email, productId },
  });

  const notify = process.env.NOTIFY_EMAIL;
  if (notify) {
    await sendMail({
      to: notify,
      subject: `New inquiry from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "-"}`,
        `Product: ${data.product || "-"}`,
        `Location: ${data.location || "-"}`,
        `Timeline: ${data.timeline || "-"}`,
        "",
        data.message,
      ].join("\n"),
    });
  }

  redirect("/inquire/thanks");
}
