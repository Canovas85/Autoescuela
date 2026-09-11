-- CreateTable
CREATE TABLE "hojas_ruta" (
    "id" TEXT NOT NULL,
    "clasePracticaId" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'EN_CURSO',
    "observacionesProfesor" TEXT,
    "kilometrosInicio" INTEGER,
    "kilometrosFin" INTEGER,
    "combustibleInicioPct" INTEGER,
    "combustibleFinPct" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finalizedAt" TIMESTAMP(3),

    CONSTRAINT "hojas_ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hojas_ruta_faltas" (
    "id" TEXT NOT NULL,
    "hojaRutaId" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "catalogoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hojas_ruta_faltas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hojas_ruta_faltas_catalogo" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hojas_ruta_faltas_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hojas_ruta_clasePracticaId_key" ON "hojas_ruta"("clasePracticaId");

-- CreateIndex
CREATE INDEX "hojas_ruta_profesorId_idx" ON "hojas_ruta"("profesorId");

-- CreateIndex
CREATE INDEX "hojas_ruta_alumnoId_idx" ON "hojas_ruta"("alumnoId");

-- CreateIndex
CREATE INDEX "hojas_ruta_estado_idx" ON "hojas_ruta"("estado");

-- CreateIndex
CREATE INDEX "hojas_ruta_createdAt_idx" ON "hojas_ruta"("createdAt");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_hojaRutaId_idx" ON "hojas_ruta_faltas"("hojaRutaId");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_tipo_idx" ON "hojas_ruta_faltas"("tipo");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_catalogoId_idx" ON "hojas_ruta_faltas"("catalogoId");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_catalogo_tipo_idx" ON "hojas_ruta_faltas_catalogo"("tipo");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_catalogo_activo_idx" ON "hojas_ruta_faltas_catalogo"("activo");

-- CreateIndex
CREATE INDEX "hojas_ruta_faltas_catalogo_orden_idx" ON "hojas_ruta_faltas_catalogo"("orden");

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_clasePracticaId_fkey" FOREIGN KEY ("clasePracticaId") REFERENCES "clases_practicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta_faltas" ADD CONSTRAINT "hojas_ruta_faltas_hojaRutaId_fkey" FOREIGN KEY ("hojaRutaId") REFERENCES "hojas_ruta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta_faltas" ADD CONSTRAINT "hojas_ruta_faltas_catalogoId_fkey" FOREIGN KEY ("catalogoId") REFERENCES "hojas_ruta_faltas_catalogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default catalog infractions (L = Leve, D = Deficiente, E = Eliminatoria)
INSERT INTO "hojas_ruta_faltas_catalogo" ("id", "tipo", "categoria", "descripcion", "activo", "orden", "createdAt", "updatedAt") VALUES
('CAT-L-001', 'LEVE', 'Señalización', 'No señalizar correctamente una maniobra cuando la situación no alcanza gravedad superior.', true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-002', 'LEVE', 'Observación', 'No realizar una comprobación suficientemente adecuada.', true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-003', 'LEVE', 'Marchas', 'Seleccionar una relación de marcha mejorable.', true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-004', 'LEVE', 'Mandos del vehículo', 'Uso inadecuado de los mandos.', true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-005', 'LEVE', 'Conducción eficiente', 'Frenada o aceleración poco adecuada.', true, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-006', 'LEVE', 'Velocidad', 'Mantener una velocidad que, sin ser peligrosa, no es la más adecuada para las circunstancias.', true, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-007', 'LEVE', 'Posicionamiento', 'Posicionarse de forma mejorable.', true, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-008', 'LEVE', 'Estacionamiento', 'Errores leves durante estacionamiento.', true, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-009', 'LEVE', 'Control motor', 'Calar el motor, cuando las circunstancias no elevan la gravedad.', true, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-L-010', 'LEVE', 'Observación', 'Algún error puntual de observación que no provoque una situación de peligro.', true, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-001', 'DEFICIENTE', 'Incorporación', 'Incorporarse dificultando notablemente la circulación.', true, 110, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-002', 'DEFICIENTE', 'Maniobras', 'Realizar una maniobra obligando a otros usuarios a modificar sustancialmente su trayectoria.', true, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-003', 'DEFICIENTE', 'Distancia de seguridad', 'Mantener una distancia de seguridad insuficiente de forma relevante.', true, 130, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-004', 'DEFICIENTE', 'Observación', 'Realizar una observación claramente insuficiente que comprometa la seguridad, pero sin llegar al nivel de peligro de una eliminatoria.', true, 140, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-005', 'DEFICIENTE', 'Cambios de dirección', 'Ejecutar un cambio de dirección de manera que obstaculice notablemente a otros usuarios.', true, 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-006', 'DEFICIENTE', 'Posicionamiento', 'Posicionarse incorrectamente afectando significativamente a la circulación.', true, 160, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-D-007', 'DEFICIENTE', 'Mandos del vehículo', 'Realizar determinadas maniobras con una utilización claramente inadecuada de los mandos.', true, 170, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-001', 'ELIMINATORIA', 'Peligro', 'Provocar una situación de peligro.', true, 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-002', 'ELIMINATORIA', 'Accidente', 'Colisión o accidente.', true, 190, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-003', 'ELIMINATORIA', 'Intervención terceros', 'Necesitar una maniobra evasiva de otro usuario.', true, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-004', 'ELIMINATORIA', 'Control del vehículo', 'Pérdida importante del dominio del vehículo.', true, 210, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-005', 'ELIMINATORIA', 'Intervención profesor', 'Que el profesor tenga que intervenir para evitar una situación peligrosa.', true, 220, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-006', 'ELIMINATORIA', 'Semáforos', 'No respetar un semáforo en rojo.', true, 230, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-007', 'ELIMINATORIA', 'Prioridad', 'No respetar determinadas señales de prioridad.', true, 240, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-008', 'ELIMINATORIA', 'Señalización', 'Incumplir una señal o indicación de forma que genere una situación grave.', true, 250, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-009', 'ELIMINATORIA', 'Ceder el paso', 'No ceder el paso cuando corresponde y generar peligro.', true, 260, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-010', 'ELIMINATORIA', 'Intersecciones', 'Entrar en una intersección sin respetar la prioridad.', true, 270, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-011', 'ELIMINATORIA', 'Peatones y ciclistas', 'No respetar la prioridad de peatones o ciclistas cuando la situación alcanza gravedad eliminatoria.', true, 280, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-012', 'ELIMINATORIA', 'Incorporación', 'Incorporarse poniendo en peligro a otros usuarios.', true, 290, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-013', 'ELIMINATORIA', 'Intervención terceros', 'Obligar a otro vehículo a realizar una maniobra evasiva.', true, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-014', 'ELIMINATORIA', 'Conducción peligrosa', 'Circular de forma manifiestamente peligrosa.', true, 310, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-015', 'ELIMINATORIA', 'Sentido contrario', 'Invadir el sentido contrario generando peligro.', true, 320, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-016', 'ELIMINATORIA', 'Adelantamiento', 'Realizar un adelantamiento peligroso.', true, 330, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAT-E-017', 'ELIMINATORIA', 'Normas de circulación', 'No respetar determinadas obligaciones de circulación cuando la conducta genera peligro.', true, 340, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
