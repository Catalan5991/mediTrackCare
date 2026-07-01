/*
  Warnings:

  - Added the required column `presentation` to the `medications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `medications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MedicationForm" AS ENUM ('TABLETA', 'CAPSULA', 'JARABE', 'SUSPENSION', 'INYECCION', 'GOTAS', 'CREMA', 'UNGUENTO', 'INHALADOR', 'POLVO', 'OTRO');

-- CreateEnum
CREATE TYPE "MedicationRoute" AS ENUM ('ORAL', 'INTRAVENOSA', 'INTRAMUSCULAR', 'SUBCUTANEA', 'TOPICA', 'OFTALMICA', 'OTICA', 'NASAL', 'INHALADA', 'RECTAL', 'OTRO');

-- AlterTable
ALTER TABLE "medications" DROP COLUMN "presentation",
ADD COLUMN     "presentation" "MedicationForm" NOT NULL,
DROP COLUMN "route",
ADD COLUMN     "route" "MedicationRoute" NOT NULL;
