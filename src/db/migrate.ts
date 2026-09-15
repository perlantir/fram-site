import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  console.log("→ running migrations");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("✓ migrations complete");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
