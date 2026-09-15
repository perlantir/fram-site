import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "editor", "viewer"]);

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("viewer"),
    totpSecret: text("totp_secret"),
    totpEnabled: boolean("totp_enabled").notNull().default(false),
    failedAttempts: integer("failed_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_uniq").on(t.email),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    ip: text("ip"),
    userAgent: text("user_agent"),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
    expiresIdx: index("sessions_expires_idx").on(t.expiresAt),
  })
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    subtitle: text("subtitle").notNull(),
    wood: text("wood").notNull(),
    paneling: text("paneling"),
    benches: text("benches"),
    heater: text("heater"),
    door: text("door"),
    light: text("light"),
    capacity: text("capacity"),
    description: text("description").notNull(),
    heroImage: text("hero_image"),
    planSvg: text("plan_svg"),
    elevationSvg: text("elevation_svg"),
    order: integer("order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    specJson: jsonb("spec_json").$type<Record<string, string>>(),
    detailsJson: jsonb("details_json").$type<Record<string, string>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("products_slug_uniq").on(t.slug),
  })
);

export const priceTiers = pgTable(
  "price_tiers",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    priceCents: integer("price_cents").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => ({
    productIdx: index("price_tiers_product_idx").on(t.productId),
  })
);

export const inquiryStatus = pgEnum("inquiry_status", [
  "new",
  "in_review",
  "quoted",
  "won",
  "lost",
]);

export const inquiries = pgTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    location: text("location"),
    timeline: text("timeline"),
    message: text("message").notNull(),
    status: inquiryStatus("status").notNull().default("new"),
    notes: text("notes"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index("inquiries_created_idx").on(t.createdAt),
    statusIdx: index("inquiries_status_idx").on(t.status),
  })
);

export const evidenceCategory = pgEnum("evidence_category", [
  "longevity",
  "mind",
  "heat",
  "cold",
]);

export const evidenceCitations = pgTable(
  "evidence_citations",
  {
    id: serial("id").primaryKey(),
    category: evidenceCategory("category").notNull(),
    kicker: text("kicker").notNull(),
    title: text("title").notNull(),
    authors: text("authors"),
    journal: text("journal").notNull(),
    year: integer("year").notNull(),
    url: text("url"),
    order: integer("order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    categoryIdx: index("evidence_category_idx").on(t.category),
  })
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    before: jsonb("before"),
    after: jsonb("after"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    atIdx: index("audit_at_idx").on(t.at),
    entityIdx: index("audit_entity_idx").on(t.entity, t.entityId),
    userIdx: index("audit_user_idx").on(t.userId),
  })
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    email: text("email"),
    ip: text("ip"),
    success: boolean("success").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    atIdx: index("login_attempts_at_idx").on(t.at),
    ipIdx: index("login_attempts_ip_idx").on(t.ip),
  })
);

export const productsRelations = relations(products, ({ many }) => ({
  priceTiers: many(priceTiers),
  inquiries: many(inquiries),
}));

export const priceTiersRelations = relations(priceTiers, ({ one }) => ({
  product: one(products, {
    fields: [priceTiers.productId],
    references: [products.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  auditEntries: many(auditLog),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type PriceTier = typeof priceTiers.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type EvidenceCitation = typeof evidenceCitations.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
