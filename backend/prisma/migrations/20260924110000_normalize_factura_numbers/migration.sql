-- Normaliza numeracion de facturas a formato FAC-<digitos>.
-- Tambien sincroniza numeroFacturaPago cuando referencia una factura renumerada.

CREATE TEMP TABLE tmp_factura_numero_mapping (
  factura_id TEXT PRIMARY KEY,
  old_numero TEXT NOT NULL,
  new_numero TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_factura_numero_mapping (factura_id, old_numero, new_numero)
WITH invalid_facturas AS (
  SELECT
    id,
    numero AS old_numero,
    "fechaEmision"
  FROM facturas
  WHERE numero !~ '^FAC-[0-9]+$'
),
max_factura AS (
  SELECT COALESCE(MAX((SUBSTRING(numero FROM 5))::numeric), 0) AS max_value
  FROM facturas
  WHERE numero ~ '^FAC-[0-9]+$'
)
SELECT
  i.id,
  i.old_numero,
  'FAC-' || (m.max_value + ROW_NUMBER() OVER (ORDER BY i."fechaEmision", i.id))::text AS new_numero
FROM invalid_facturas i
CROSS JOIN max_factura m;

UPDATE facturas f
SET numero = m.new_numero
FROM tmp_factura_numero_mapping m
WHERE f.id = m.factura_id;

UPDATE pagos p
SET "numeroFacturaPago" = m.new_numero
FROM tmp_factura_numero_mapping m
WHERE p."numeroFacturaPago" = m.old_numero;

WITH orphan_invalid_pagos AS (
  SELECT
    p.id,
    p."fechaCreacion"
  FROM pagos p
  WHERE p."numeroFacturaPago" IS NOT NULL
    AND p."numeroFacturaPago" !~ '^FAC-[0-9]+$'
),
max_codigo AS (
  SELECT COALESCE(MAX(valor_num), 0) AS max_value
  FROM (
    SELECT (SUBSTRING(numero FROM 5))::numeric AS valor_num
    FROM facturas
    WHERE numero ~ '^FAC-[0-9]+$'
    UNION ALL
    SELECT (SUBSTRING("numeroFacturaPago" FROM 5))::numeric AS valor_num
    FROM pagos
    WHERE "numeroFacturaPago" ~ '^FAC-[0-9]+$'
  ) t
),
mapping_pagos AS (
  SELECT
    o.id,
    'FAC-' || (m.max_value + ROW_NUMBER() OVER (ORDER BY o."fechaCreacion", o.id))::text AS new_numero
  FROM orphan_invalid_pagos o
  CROSS JOIN max_codigo m
)
UPDATE pagos p
SET "numeroFacturaPago" = mp.new_numero
FROM mapping_pagos mp
WHERE p.id = mp.id;
