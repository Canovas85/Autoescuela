# INVENTARIO DE DOCUMENTACION EXISTENTE

## 1. Objetivo

Inventariar la documentacion funcional y de referencia actualmente disponible,
indicando su utilidad real y su estado de alineacion con el codigo.

Fecha de revision: 2026-11-03.

---

## 2. Documento principal del proyecto

### README.md

**Estado:** actualizado.

**Cobertura:**

- contexto del producto
- stack y arquitectura
- estado funcional real
- instalacion y rutas generales

**Uso recomendado:**

- punto de entrada para vision general y operativa actual

---

## 3. Documentos de negocio y dominio

### BUSINESS_RULES.md

**Estado:** actualizado.

**Cobertura:**

- reglas aplicadas por area funcional
- reglas de ownership, estados y permisos
- gaps detectados

### DOMAIN_MODEL.md

**Estado:** actualizado.

**Cobertura:**

- entidades Prisma principales
- relaciones de dominio
- estados funcionales y procesos tecnicos de soporte

### FUNCTIONAL_SPECIFICATION.md

**Estado:** actualizado.

**Cobertura:**

- funcionalidad por actor
- alcance operativo por modulo
- funcionalidades parciales/no expuestas

### BR_TRACEABILITY_INDEX.md

**Estado:** actualizado.

**Cobertura:**

- trazabilidad regla -> evidencia tecnica
- estado de implementacion (implementada/parcial/pendiente)

### ESTADOS_EXPEDIENTE.md

**Estado:** actualizado.

**Cobertura:**

- catalogo oficial de fases de expediente
- criterio funcional y paleta visual
- referencia de implementacion backend/frontend

---

## 4. Documentacion modular y de inventario funcional

### audits/documentacion-funcional/DOCUMENTACION_MODULOS_DETALLADA.md

**Estado:** actualizado.

**Cobertura:**

- revision funcional por modulo
- evidencia de rutas, servicios, pantallas y modelos
- estado por modulo y observaciones de gap

### audits/documentacion-funcional/INVENTARIO_MAESTRO_FUNCIONAL.md

**Estado:** actualizado.

**Cobertura:**

- mapa maestro de cobertura funcional
- estado de implementacion por dimension
- prioridades de mantenimiento documental

---

## 5. Documentos historicos no encontrados en el repositorio actual

En esta revision no se localizan los siguientes archivos citados en versiones anteriores del inventario:

- `DOCUMENTACION_FUNCIONAL_AUTOESCUELA_EGUSKILORE.md`
- `DOCUMENTACION_MODULOS_AUTOESCUELA_EGUSKILORE.md`
- `PROTOCOLO_RENOVACION_JEFATURA.md`
- `PROTOCOLO_RENOVACION_SECRETARIA.md`

Conclusiones:

1. no se usan como evidencia activa en esta version
2. si deben recuperarse, conviene reintroducirlos con trazabilidad clara a codigo real

---

## 6. Cobertura documental actual

### Cobertura fuerte

- arquitectura general
- reglas de negocio clave
- dominio de datos principal
- especificacion funcional por actor
- catalogo de estados de expediente

### Cobertura media

- trazabilidad detallada endpoint a endpoint por rol
- documentacion de procesos batch tecnicos

### Cobertura pendiente

- ampliar catalogo de pruebas frontend en documentacion (actualizado con avance hasta fase 7 de BR-GAP-002)
- mantener actualizada la trazabilidad de fases de BR-GAP-002 conforme se amplie cobertura

---

## 7. Criterio de mantenimiento recomendado

Para mantener consistencia documental:

1. actualizar primero codigo y tests
2. actualizar `BUSINESS_RULES.md` y `DOMAIN_MODEL.md`
3. propagar cambios a `FUNCTIONAL_SPECIFICATION.md` y `BR_TRACEABILITY_INDEX.md`
4. cerrar con `README.md` e inventarios

---

## 8. Riesgos documentales actuales

- riesgo de desalineacion si cambian rutas/servicios sin actualizar trazabilidad
- riesgo de sobre-documentar funcionalidad no montada como si fuera activa
- riesgo de infra-documentar reglas de ownership y permisos finos
