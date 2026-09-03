/*
  Warnings:

  - You are about to drop the column `fechaMatriculaPago` on the `alumnos` table. All the data in the column will be lost.
  - You are about to drop the column `matriculaPagada` on the `alumnos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "alumnos" DROP COLUMN "fechaMatriculaPago",
DROP COLUMN "matriculaPagada";
