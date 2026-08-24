ALTER TABLE "alumnos"
ADD COLUMN IF NOT EXISTS "matriculaPagada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "fechaMatriculaPago" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "temarios" (
  "id" TEXT NOT NULL,
  "titulo" TEXT NOT NULL,
  "descripcion" TEXT,
  "tipoLicenciaObjetivo" TEXT NOT NULL,
  "orden" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "temarios_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "temarios_tipoLicenciaObjetivo_idx" ON "temarios"("tipoLicenciaObjetivo");

CREATE TABLE IF NOT EXISTS "temarios_progreso" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "temarioId" TEXT NOT NULL,
  "revisado" BOOLEAN NOT NULL DEFAULT false,
  "dominio" INTEGER NOT NULL DEFAULT 0,
  "ultimaRevision" TIMESTAMP(3),
  CONSTRAINT "temarios_progreso_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "temarios_progreso_alumnoId_idx" ON "temarios_progreso"("alumnoId");
CREATE INDEX IF NOT EXISTS "temarios_progreso_temarioId_idx" ON "temarios_progreso"("temarioId");

ALTER TABLE "temarios_progreso"
ADD CONSTRAINT "temarios_progreso_alumnoId_fkey"
FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "temarios_progreso"
ADD CONSTRAINT "temarios_progreso_temarioId_fkey"
FOREIGN KEY ("temarioId") REFERENCES "temarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "tests_practica" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "temarioId" TEXT,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resultado" TEXT NOT NULL,
  "respuestasCorrectas" INTEGER NOT NULL,
  "totalPreguntas" INTEGER NOT NULL,
  CONSTRAINT "tests_practica_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tests_practica_alumnoId_idx" ON "tests_practica"("alumnoId");
CREATE INDEX IF NOT EXISTS "tests_practica_temarioId_idx" ON "tests_practica"("temarioId");
CREATE INDEX IF NOT EXISTS "tests_practica_fecha_idx" ON "tests_practica"("fecha");

ALTER TABLE "tests_practica"
ADD CONSTRAINT "tests_practica_alumnoId_fkey"
FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tests_practica"
ADD CONSTRAINT "tests_practica_temarioId_fkey"
FOREIGN KEY ("temarioId") REFERENCES "temarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "bonos" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "descripcion" TEXT,
  "clasesIncluidas" INTEGER NOT NULL,
  "validezDias" INTEGER NOT NULL DEFAULT 90,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "bonos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "compras_bonos" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "bonoId" TEXT NOT NULL,
  "clasesCompradas" INTEGER NOT NULL,
  "clasesConsumidas" INTEGER NOT NULL DEFAULT 0,
  "pagado" BOOLEAN NOT NULL DEFAULT false,
  "fechaCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fechaValidezHasta" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "compras_bonos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "compras_bonos_alumnoId_idx" ON "compras_bonos"("alumnoId");
CREATE INDEX IF NOT EXISTS "compras_bonos_bonoId_idx" ON "compras_bonos"("bonoId");
CREATE INDEX IF NOT EXISTS "compras_bonos_fechaCompra_idx" ON "compras_bonos"("fechaCompra");

ALTER TABLE "compras_bonos"
ADD CONSTRAINT "compras_bonos_alumnoId_fkey"
FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "compras_bonos"
ADD CONSTRAINT "compras_bonos_bonoId_fkey"
FOREIGN KEY ("bonoId") REFERENCES "bonos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "solicitudes_examen" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
  "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fechaProgramada" TIMESTAMP(3),
  "observaciones" TEXT,
  CONSTRAINT "solicitudes_examen_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "solicitudes_examen_alumnoId_idx" ON "solicitudes_examen"("alumnoId");
CREATE INDEX IF NOT EXISTS "solicitudes_examen_tipo_idx" ON "solicitudes_examen"("tipo");
CREATE INDEX IF NOT EXISTS "solicitudes_examen_estado_idx" ON "solicitudes_examen"("estado");

ALTER TABLE "solicitudes_examen"
ADD CONSTRAINT "solicitudes_examen_alumnoId_fkey"
FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
