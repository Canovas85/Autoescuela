# Exports Instructions

Estas instrucciones aplican a PDF y Excel.

## Objetivo

Las exportaciones deben reflejar exactamente los datos visibles al usuario.

## Fuente de datos

Usar siempre:

rows filtrados actualmente

No volver a consultar backend.

## Excel

Mantener:

- cabeceras claras
- nombres descriptivos
- formato tabular

## PDF

Mantener:

- título
- fecha de generación
- tabla principal

## Módulos soportados

- Alumnos
- Profesores
- Vehículos
- Promociones
- Bonos

## Coherencia

El orden de columnas debe coincidir con DataGrid.

## Rendimiento

No recalcular información ya disponible.

## UX

Después de pulsar exportar:

- generar archivo directamente
- evitar pasos intermedios innecesarios

## Futuras exportaciones

Si se crea una exportación nueva:

1. Crear utilidad en utils/
2. Reutilizar patrón existente
3. Mantener nombre:

exportEntidadExcel.js
exportEntidadPdf.js
