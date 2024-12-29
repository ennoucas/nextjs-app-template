/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { profilesTable, resumesTable } from "@/db/schema";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  resumes: resumesTable,
};

const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });
