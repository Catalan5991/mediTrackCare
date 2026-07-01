/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMENINO', 'MASCULINO', 'OTRO', 'NO_ESPECIFICADO');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('ACTIVO', 'FINALIZADO', 'CANCELADO', 'PAUSADO');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('PENDIENTE', 'TOMADA', 'OMITIDA', 'RETRASADA');

-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('PRESION_ARTERIAL', 'GLUCOSA', 'TEMPERATURA', 'SATURACION_OXIGENO', 'PESO', 'FRECUENCIA_CARDIACA');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RECORDATORIO_TOMA', 'TOMA_OMITIDA', 'TOMA_CONFIRMADA', 'ALERTA_MEDICA', 'GENERAL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDIENTE', 'ENVIADA', 'LEIDA', 'FALLIDA');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'NO_ESPECIFICADO',
    "phone" TEXT,
    "address" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "professional_license" TEXT,
    "specialty" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregivers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "presentation" TEXT,
    "concentration" TEXT,
    "unit" TEXT,
    "route" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER,
    "diagnosis" TEXT,
    "notes" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_items" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "medication_id" INTEGER NOT NULL,
    "dose" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "instructions" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "prescription_item_id" INTEGER NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "days_of_week" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intakes" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "prescription_item_id" INTEGER NOT NULL,
    "reminder_id" INTEGER,
    "confirmed_by_user_id" INTEGER,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "taken_at" TIMESTAMP(3),
    "status" "IntakeStatus" NOT NULL DEFAULT 'PENDIENTE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_measurements" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "registered_by_user_id" INTEGER,
    "measurement_type" "MeasurementType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "second_value" DECIMAL(10,2),
    "unit" TEXT NOT NULL,
    "notes" TEXT,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_id" INTEGER,
    "intake_id" INTEGER,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "sent_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "prescription_id" INTEGER,
    "medication_id" INTEGER,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "entity_id" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_user_id_key" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_professional_license_key" ON "doctors"("professional_license");

-- CreateIndex
CREATE INDEX "caregivers_patient_id_idx" ON "caregivers"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "caregivers_user_id_patient_id_key" ON "caregivers"("user_id", "patient_id");

-- CreateIndex
CREATE INDEX "prescriptions_patient_id_idx" ON "prescriptions"("patient_id");

-- CreateIndex
CREATE INDEX "prescriptions_doctor_id_idx" ON "prescriptions"("doctor_id");

-- CreateIndex
CREATE INDEX "prescription_items_prescription_id_idx" ON "prescription_items"("prescription_id");

-- CreateIndex
CREATE INDEX "prescription_items_medication_id_idx" ON "prescription_items"("medication_id");

-- CreateIndex
CREATE INDEX "reminders_patient_id_idx" ON "reminders"("patient_id");

-- CreateIndex
CREATE INDEX "reminders_prescription_item_id_idx" ON "reminders"("prescription_item_id");

-- CreateIndex
CREATE INDEX "intakes_patient_id_idx" ON "intakes"("patient_id");

-- CreateIndex
CREATE INDEX "intakes_prescription_item_id_idx" ON "intakes"("prescription_item_id");

-- CreateIndex
CREATE INDEX "intakes_reminder_id_idx" ON "intakes"("reminder_id");

-- CreateIndex
CREATE INDEX "intakes_confirmed_by_user_id_idx" ON "intakes"("confirmed_by_user_id");

-- CreateIndex
CREATE INDEX "medical_measurements_patient_id_idx" ON "medical_measurements"("patient_id");

-- CreateIndex
CREATE INDEX "medical_measurements_registered_by_user_id_idx" ON "medical_measurements"("registered_by_user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_patient_id_idx" ON "notifications"("patient_id");

-- CreateIndex
CREATE INDEX "notifications_intake_id_idx" ON "notifications"("intake_id");

-- CreateIndex
CREATE INDEX "files_patient_id_idx" ON "files"("patient_id");

-- CreateIndex
CREATE INDEX "files_prescription_id_idx" ON "files"("prescription_id");

-- CreateIndex
CREATE INDEX "files_medication_id_idx" ON "files"("medication_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_prescription_item_id_fkey" FOREIGN KEY ("prescription_item_id") REFERENCES "prescription_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_prescription_item_id_fkey" FOREIGN KEY ("prescription_item_id") REFERENCES "prescription_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "reminders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_confirmed_by_user_id_fkey" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_measurements" ADD CONSTRAINT "medical_measurements_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_measurements" ADD CONSTRAINT "medical_measurements_registered_by_user_id_fkey" FOREIGN KEY ("registered_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "intakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
