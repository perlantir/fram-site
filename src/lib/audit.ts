import { headers } from "next/headers";
import { db } from "@/db";
import { auditLog } from "@/db/schema";

type AuditPayload = {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | number | null;
  before?: unknown;
  after?: unknown;
};

export async function recordAudit(payload: AuditPayload) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const ua = h.get("user-agent") ?? null;
  await db.insert(auditLog).values({
    userId: payload.userId ?? null,
    userEmail: payload.userEmail ?? null,
    action: payload.action,
    entity: payload.entity,
    entityId: payload.entityId != null ? String(payload.entityId) : null,
    before: payload.before as never,
    after: payload.after as never,
    ip,
    userAgent: ua,
  });
}
