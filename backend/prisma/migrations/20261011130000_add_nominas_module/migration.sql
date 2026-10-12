ALTER TABLE "profesores"
ADD COLUMN "fechaAlta" TIMESTAMP(3),
ADD COLUMN "fechaBaja" TIMESTAMP(3),
ADD COLUMN "salarioBaseMensual" DECIMAL(10, 2) NOT NULL DEFAULT 1253.50;

UPDATE "profesores"
SET "fechaAlta" = COALESCE("fechaAlta", (
  SELECT "fechaCreacion"
  FROM "usuarios"
  WHERE "usuarios"."id" = "profesores"."id"
));

ALTER TABLE "solicitudes_examen"
ADD COLUMN "fechaResolucion" TIMESTAMP(3);

ALTER TABLE "solicitudes_examen"
ADD COLUMN "profesorResolucionId" TEXT;

UPDATE "solicitudes_examen"
SET "fechaResolucion" = COALESCE("fechaProgramada", "fechaSolicitud")
WHERE "fechaResolucion" IS NULL
  AND "tipo" = 'PRACTICO'
  AND "estado" IN ('APTO', 'NO_APTO');

CREATE INDEX "solicitudes_examen_fechaResolucion_idx"
ON "solicitudes_examen"("fechaResolucion");

CREATE INDEX "solicitudes_examen_profesorResolucionId_idx"
ON "solicitudes_examen"("profesorResolucionId");

ALTER TABLE "solicitudes_examen"
ADD CONSTRAINT "solicitudes_examen_profesorResolucionId_fkey"
FOREIGN KEY ("profesorResolucionId") REFERENCES "profesores"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "nominas" (
  "id" TEXT NOT NULL,
  "numero" TEXT NOT NULL,
  "profesorId" TEXT NOT NULL,
  "anio" INTEGER NOT NULL,
  "mes" INTEGER NOT NULL,
  "periodoInicio" TIMESTAMP(3) NOT NULL,
  "periodoFin" TIMESTAMP(3) NOT NULL,
  "diasMes" INTEGER NOT NULL,
  "diasTrabajados" INTEGER NOT NULL,
  "salarioBaseMensual" DECIMAL(10, 2) NOT NULL,
  "importeSalarioBase" DECIMAL(10, 2) NOT NULL,
  "plusTransporte" DECIMAL(10, 2) NOT NULL,
  "plusProductividad" DECIMAL(10, 2) NOT NULL,
  "presentadosApto" INTEGER NOT NULL DEFAULT 0,
  "presentadosNoApto" INTEGER NOT NULL DEFAULT 0,
  "totalPresentados" INTEGER NOT NULL DEFAULT 0,
  "prorrataPagasExtra" DECIMAL(10, 2) NOT NULL,
  "deduccionContingenciasComunes" DECIMAL(10, 2) NOT NULL,
  "deduccionDesempleo" DECIMAL(10, 2) NOT NULL,
  "deduccionFormacionProfesional" DECIMAL(10, 2) NOT NULL,
  "deduccionIrpf" DECIMAL(10, 2) NOT NULL,
  "totalDevengos" DECIMAL(10, 2) NOT NULL,
  "totalDeducciones" DECIMAL(10, 2) NOT NULL,
  "liquidoPercibir" DECIMAL(10, 2) NOT NULL,
  "baseCotizacionComunes" DECIMAL(10, 2) NOT NULL,
  "baseCotizacionProfesionales" DECIMAL(10, 2) NOT NULL,
  "baseRetencionIrpf" DECIMAL(10, 2) NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'GENERADA',
  "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "nominas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "nominas_numero_key" ON "nominas"("numero");
CREATE UNIQUE INDEX "nominas_profesorId_anio_mes_key" ON "nominas"("profesorId", "anio", "mes");
CREATE INDEX "nominas_anio_mes_idx" ON "nominas"("anio", "mes");
CREATE INDEX "nominas_profesorId_idx" ON "nominas"("profesorId");
CREATE INDEX "nominas_fechaGeneracion_idx" ON "nominas"("fechaGeneracion");

ALTER TABLE "nominas"
ADD CONSTRAINT "nominas_profesorId_fkey"
FOREIGN KEY ("profesorId") REFERENCES "profesores"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
