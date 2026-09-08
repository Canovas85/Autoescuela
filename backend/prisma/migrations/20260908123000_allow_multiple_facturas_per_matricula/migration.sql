-- Permite emitir varias facturas asociadas a la misma matricula.
-- Se mantiene la unicidad por numero de factura.
DROP INDEX IF EXISTS "facturas_matriculaId_key";

CREATE INDEX IF NOT EXISTS "facturas_matriculaId_idx"
  ON "facturas"("matriculaId");
