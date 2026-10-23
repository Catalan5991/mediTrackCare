-- CreateEnum
CREATE TYPE "ProfessionalVerification" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'REVOKED');

-- AlterEnum
ALTER TYPE "IntakeStatus" ADD VALUE 'CANCELADA';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "time_zone" TEXT NOT NULL DEFAULT 'America/Mexico_City',
ALTER COLUMN "birth_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "verification_status" "ProfessionalVerification" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "caregivers" ADD COLUMN     "accepted_at" TIMESTAMP(3),
ADD COLUMN     "can_manage_reminders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_read" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "can_track" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requested_by_user_id" INTEGER,
ADD COLUMN     "status" "LinkStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "creation_key" TEXT,
ADD COLUMN     "request_hash" TEXT;

-- AlterTable
ALTER TABLE "prescription_items" ADD COLUMN     "days_of_week" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "dose_unit" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "effective_from" TIMESTAMP(3),
ADD COLUMN     "patient_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "patient_confirmed_by_user_id" INTEGER,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "retired_at" TIMESTAMP(3),
ADD COLUMN     "scheduled_times" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "time_zone" TEXT NOT NULL DEFAULT 'America/Mexico_City';

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "advance_minutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notify_caregiver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeat_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "repeat_minutes" INTEGER;

-- AlterTable
ALTER TABLE "intakes" ADD COLUMN     "occurrence_key" TEXT,
ADD COLUMN     "prescription_snapshot" JSONB;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "deduplication_key" TEXT,
ADD COLUMN     "scheduled_for" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "doctor_patients" ADD COLUMN     "accepted_at" TIMESTAMP(3),
ADD COLUMN     "can_manage_reminders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_read" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "can_track" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requested_by_user_id" INTEGER,
ADD COLUMN     "status" "LinkStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_token_key" ON "devices"("token");

-- CreateIndex
CREATE INDEX "devices_user_id_idx" ON "devices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_creation_key_key" ON "prescriptions"("creation_key");

-- CreateIndex
CREATE UNIQUE INDEX "intakes_occurrence_key_key" ON "intakes"("occurrence_key");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_deduplication_key_key" ON "notifications"("deduplication_key");

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_patient_confirmed_by_user_id_fkey" FOREIGN KEY ("patient_confirmed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Preserve legacy authorizations; inactive links become revoked.
UPDATE "caregivers" SET "status" = CASE WHEN "is_active" THEN 'ACTIVE'::"LinkStatus" ELSE 'REVOKED'::"LinkStatus" END, "accepted_at" = CASE WHEN "is_active" THEN "created_at" ELSE NULL END;
UPDATE "doctor_patients" SET "status" = CASE WHEN "is_active" THEN 'ACTIVE'::"LinkStatus" ELSE 'REVOKED'::"LinkStatus" END, "accepted_at" = CASE WHEN "is_active" THEN "created_at" ELSE NULL END;
-- Existing patients retain their profile. Missing profiles use existing identity, without inventing birth dates.
INSERT INTO "patients" ("user_id", "full_name", "gender", "phone", "is_active", "created_at", "updated_at")
SELECT u."id", u."name", 'NO_ESPECIFICADO'::"Gender", u."phone", u."isActive", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users" u JOIN "roles" r ON r."id" = u."role_id"
WHERE UPPER(r."name") = 'PATIENT' AND NOT EXISTS (SELECT 1 FROM "patients" p WHERE p."user_id" = u."id");
-- Doctors deliberately remain PENDING until an administrator reviews their credentials.
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_notification_bounds" CHECK ("advance_minutes" BETWEEN 0 AND 1440 AND "repeat_count" BETWEEN 0 AND 5 AND ("repeat_minutes" IS NULL OR "repeat_minutes" BETWEEN 1 AND 1440));
