-- CreateTable
CREATE TABLE "tarifas_matricula" (
    "id" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifas_matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "precioBase" DECIMAL(10,2) NOT NULL,
    "precioFinal" DECIMAL(10,2) NOT NULL,
    "promocionId" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),
    "observaciones" TEXT,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_matricula_licencia_key" ON "tarifas_matricula"("licencia");

-- CreateIndex
CREATE INDEX "matriculas_alumnoId_idx" ON "matriculas"("alumnoId");

-- CreateIndex
CREATE INDEX "matriculas_estado_idx" ON "matriculas"("estado");

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
