ALTER TABLE "medications" ADD COLUMN "owner_patient_id" INTEGER;
ALTER TABLE "medications" ADD CONSTRAINT "medications_owner_patient_id_fkey"
 FOREIGN KEY ("owner_patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "medications_owner_patient_id_idx" ON "medications"("owner_patient_id");
