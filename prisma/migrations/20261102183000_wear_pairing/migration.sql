CREATE TABLE "wear_pairings" ("id" TEXT PRIMARY KEY, "code_hash" TEXT NOT NULL UNIQUE, "secret_hash" TEXT NOT NULL, "expires_at" TIMESTAMP(3) NOT NULL, "approved_by_id" INTEGER, "consumed_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX "wear_pairings_expires_at_idx" ON "wear_pairings"("expires_at");
CREATE TABLE "wear_devices" ("id" TEXT PRIMARY KEY, "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "token_hash" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL DEFAULT 'Galaxy Watch', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "revoked_at" TIMESTAMP(3));
CREATE INDEX "wear_devices_user_id_idx" ON "wear_devices"("user_id");
