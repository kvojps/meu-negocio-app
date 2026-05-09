import { defineConfig } from "drizzle-kit";
import { getDatabasePath } from "./app/backend/infra/database/config";

export default defineConfig({
  schema: "./app/backend/infra/database/schema.ts",
  out: "./app/backend/infra/database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: getDatabasePath(),
  },
});
