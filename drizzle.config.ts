import { defineConfig } from "drizzle-kit";
import { getDrizzleDatabasePath } from "./app/backend/infra/database/paths";

export default defineConfig({
  schema: "./app/backend/infra/database/schema.ts",
  out: "./app/backend/infra/database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: getDrizzleDatabasePath(),
  },
});
