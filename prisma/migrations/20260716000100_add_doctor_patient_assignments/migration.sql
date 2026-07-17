CREATE TABLE "doctor_patients" (
    "doctor_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_patients_pkey" PRIMARY KEY ("doctor_id", "patient_id")
);

CREATE INDEX "doctor_patients_patient_id_idx" ON "doctor_patients"("patient_id");

ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_doctor_id_fkey"
FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_patient_id_fkey"
FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
