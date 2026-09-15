import { hash } from "@node-rs/argon2";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!url || !email || !password) {
    console.error("DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD are required");
    process.exit(1);
  }
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  const rows = await db
    .insert(schema.users)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
      name: "Nick",
    })
    .onConflictDoNothing()
    .returning();
  if (rows.length === 0) {
    console.log(`ℹ user ${email} already exists — did not touch`);
  } else {
    console.log(`✓ admin created: ${email}`);
  }
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
