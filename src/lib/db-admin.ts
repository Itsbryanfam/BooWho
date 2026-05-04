import { init } from "@instantdb/admin";
import schema from "../instant.schema";

let _db: ReturnType<typeof init<typeof schema>> | null = null;

export function getAdminDb() {
  if (_db) return _db;
  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
  const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN;
  if (!appId || !adminToken) {
    throw new Error(
      "InstantDB credentials missing. Check NEXT_PUBLIC_INSTANT_APP_ID and INSTANT_APP_ADMIN_TOKEN in .env.",
    );
  }
  _db = init({ appId, adminToken, schema });
  return _db;
}
