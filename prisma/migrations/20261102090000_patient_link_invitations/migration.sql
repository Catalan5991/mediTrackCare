CREATE TABLE "patient_link_invitations" (
 "id" SERIAL NOT NULL,
 "patient_id" INTEGER NOT NULL,
 "kind" TEXT NOT NULL,
 "token_hash" TEXT NOT NULL,
 "expires_at" TIMESTAMP(3) NOT NULL,
 "claimed_at" TIMESTAMP(3),
 "claimed_by_user_id" INTEGER,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "patient_link_invitations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "patient_link_invitations_token_hash_key" ON "patient_link_invitations"("token_hash");
CREATE INDEX "patient_link_invitations_patient_id_created_at_idx" ON "patient_link_invitations"("patient_id","created_at");
ALTER TABLE "patient_link_invitations" ADD CONSTRAINT "patient_link_invitations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
