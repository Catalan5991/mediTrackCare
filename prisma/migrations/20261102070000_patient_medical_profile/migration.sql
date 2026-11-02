CREATE TABLE "patient_medical_profiles" (
 "id" SERIAL PRIMARY KEY,
 "patient_id" INTEGER NOT NULL UNIQUE,
 "blood_type" TEXT,
 "allergies" TEXT,
 "conditions" TEXT,
 "medical_notes" TEXT,
 "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "patient_medical_profiles" ADD CONSTRAINT "patient_medical_profiles_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
