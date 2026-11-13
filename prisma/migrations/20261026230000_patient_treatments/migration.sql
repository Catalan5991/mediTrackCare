-- Registros personales no son prescripciones medicas verificadas.
CREATE TYPE "TreatmentOrigin" AS ENUM ('SELF_REPORTED', 'EXTERNAL_PRESCRIPTION');
CREATE TYPE "TreatmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TreatmentIntakeStatus" AS ENUM ('TAKEN', 'SKIPPED');

CREATE TABLE "patient_treatments" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "medication_id" INTEGER NOT NULL,
  "registered_by_user_id" INTEGER NOT NULL,
  "origin" "TreatmentOrigin" NOT NULL,
  "status" "TreatmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "external_prescriber_name" TEXT,
  "external_prescription_date" DATE,
  "dose" TEXT,
  "dose_unit" TEXT,
  "frequency" TEXT,
  "instructions" TEXT,
  "notes" TEXT,
  "start_date" DATE,
  "end_date" DATE,
  "scheduled_times" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "days_of_week" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
  "time_zone" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "patient_treatments_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "patient_treatment_intakes" (
  "id" SERIAL NOT NULL,
  "patient_treatment_id" INTEGER NOT NULL,
  "recorded_by_user_id" INTEGER NOT NULL,
  "status" "TreatmentIntakeStatus" NOT NULL,
  "scheduled_at" TIMESTAMP(3),
  "taken_at" TIMESTAMP(3),
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_treatment_intakes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "patient_treatments_patient_id_status_idx" ON "patient_treatments"("patient_id", "status");
CREATE INDEX "patient_treatments_medication_id_idx" ON "patient_treatments"("medication_id");
CREATE INDEX "patient_treatments_registered_by_user_id_idx" ON "patient_treatments"("registered_by_user_id");
CREATE INDEX "patient_treatment_intakes_patient_treatment_id_created_at_idx" ON "patient_treatment_intakes"("patient_treatment_id", "created_at");
CREATE INDEX "patient_treatment_intakes_recorded_by_user_id_idx" ON "patient_treatment_intakes"("recorded_by_user_id");
ALTER TABLE "patient_treatments" ADD CONSTRAINT "patient_treatments_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "patient_treatments" ADD CONSTRAINT "patient_treatments_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "patient_treatments" ADD CONSTRAINT "patient_treatments_registered_by_user_id_fkey"
  FOREIGN KEY ("registered_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "patient_treatment_intakes" ADD CONSTRAINT "patient_treatment_intakes_patient_treatment_id_fkey"
  FOREIGN KEY ("patient_treatment_id") REFERENCES "patient_treatments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "patient_treatment_intakes" ADD CONSTRAINT "patient_treatment_intakes_recorded_by_user_id_fkey"
  FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
