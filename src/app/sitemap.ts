import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let rows: { slug: string }[] = [];
  try {
    rows = await db.select({ slug: products.slug }).from(products);
  } catch {
    // DB not available yet (first build) — return the static routes only
  }
  const now = new Date();
  return [
    { url: "/", changeFrequency: "monthly", priority: 1, lastModified: now },
    { url: "/saunas", changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: "/evidence", changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: "/inquire", changeFrequency: "yearly", priority: 0.8, lastModified: now },
    ...rows.map((r) => ({
      url: `/saunas/${r.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: now,
    })),
  ];
}
