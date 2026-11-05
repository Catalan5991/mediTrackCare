CREATE TABLE "wear_daily_activities" (
  "id" SERIAL PRIMARY KEY,
  "patient_id" INTEGER NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "activity_date" DATE NOT NULL,
  "source" VARCHAR(32) NOT NULL DEFAULT 'WEAR_OS',
  "steps" INTEGER NOT NULL CHECK ("steps" >= 0 AND "steps" <= 1000000),
  "last_synced_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "wear_daily_activity_unique" UNIQUE ("patient_id", "activity_date", "source")
);
CREATE INDEX "wear_daily_activities_patient_date_idx"
  ON "wear_daily_activities"("patient_id", "activity_date" DESC);
