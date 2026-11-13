CREATE TYPE "AdministrationKind" AS ENUM ('INJECTION','NEBULIZATION','INHALER');
CREATE TABLE "administration_sessions" (
 "id" SERIAL PRIMARY KEY,"patient_id" INTEGER NOT NULL,"created_by_user_id" INTEGER NOT NULL,
 "kind" "AdministrationKind" NOT NULL,"label" TEXT NOT NULL,
 "origin" "TreatmentOrigin" NOT NULL DEFAULT 'SELF_REPORTED',
 "instructions" TEXT,"notes" TEXT,"start_date" DATE NOT NULL,"end_date" DATE,
 "scheduled_times" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
 "days_of_week" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
 "time_zone" TEXT NOT NULL,"is_active" BOOLEAN NOT NULL DEFAULT TRUE,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "administration_components" (
 "id" SERIAL PRIMARY KEY,"session_id" INTEGER NOT NULL,"medication_id" INTEGER NOT NULL,
 "dose" TEXT NOT NULL,"dose_unit" TEXT NOT NULL,"instructions" TEXT
);
CREATE TABLE "administration_session_intakes" (
 "id" SERIAL PRIMARY KEY,"session_id" INTEGER NOT NULL,"scheduled_at" TIMESTAMP(3) NOT NULL,
 "status" "TreatmentIntakeStatus" NOT NULL,"taken_at" TIMESTAMP(3),
 "recorded_by_user_id" INTEGER NOT NULL,"notes" TEXT,
 CONSTRAINT "administration_session_intakes_session_id_scheduled_at_key" UNIQUE ("session_id","scheduled_at")
);
ALTER TABLE "administration_sessions" ADD CONSTRAINT "administration_sessions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "administration_components" ADD CONSTRAINT "administration_components_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "administration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "administration_components" ADD CONSTRAINT "administration_components_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "administration_session_intakes" ADD CONSTRAINT "administration_session_intakes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "administration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "administration_sessions_patient_id_is_active_idx" ON "administration_sessions"("patient_id","is_active");
CREATE INDEX "administration_components_session_id_idx" ON "administration_components"("session_id");
