CREATE TABLE "external_consultations" (
 "id" SERIAL NOT NULL PRIMARY KEY,
 "patient_id" INTEGER NOT NULL,
 "registered_by_user_id" INTEGER NOT NULL,
 "visit_date" DATE NOT NULL,
 "doctor_name" TEXT NOT NULL,
 "specialty" TEXT,
 "clinic" TEXT,
 "next_visit_date" DATE,
 "notes" TEXT,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "external_consultations" ADD CONSTRAINT "external_consultations_patient_id_fkey"
 FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "external_consultations_patient_id_created_at_idx" ON "external_consultations"("patient_id","created_at");
ALTER TABLE "patient_treatments" ADD COLUMN "consultation_id" INTEGER;
ALTER TABLE "patient_treatments" ADD CONSTRAINT "patient_treatments_consultation_id_fkey"
 FOREIGN KEY ("consultation_id") REFERENCES "external_consultations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "patient_treatments_consultation_id_idx" ON "patient_treatments"("consultation_id");
