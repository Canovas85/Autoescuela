# PLAN DE COBERTURA DOCUMENTAL

## 1. Objetivo

Establecer una hoja de ruta para completar la documentación funcional con criterio documental y trazabilidad real, evitando resúmenes genéricos y manteniendo la diferencia entre lo implementado y lo previsto.

## 2. Criterio de análisis

La cobertura documental debe asignarse solo a elementos que puedan apoyarse en:

- rutas reales de backend
- modelos Prisma
- componentes/frontend relevantes
- documentación del negocio
- pruebas o evidencia explícita del repositorio

## 3. Módulos prioritarios a documentar con detalle

### Prioridad alta

1. Autenticación y primer acceso
2. Roles, permisos y middleware de autorización
3. Alumnos y expedientes
4. Profesores y horarios
5. Vehículos y gasto combustible
6. Clases prácticas y hojas de ruta
7. Temarios y progresos académicos
8. Exámenes, convocatorias y solicitudes

### Prioridad media

9. Matrículas, bonos, facturas y pagos
10. Promociones y tarifas
11. Informes y dashboards
12. Notificaciones y usuarios operativos
13. Nóminas

## 4. Plantilla de documentación por módulo

Cada módulo debe documentarse con esta estructura:

1. Descripción funcional
2. Entidades y modelos implicados
3. Pantallas o vistas asociadas
4. Roles participantes
5. Acciones del usuario
6. Validaciones y reglas
7. Permisos reales
8. Endpoints implicados
9. Flujos principales
10. Estados y transiciones
11. Evidencia técnica
12. Observaciones y lagunas

## 5. Estado de cada módulo

| Módulo | Estado analítico | Nivel de evidencia | Necesidad documental |
|---|---|---|---|
| Autenticación | Alto | Alta | Baja |
| Roles y permisos | Alto | Alta | Media |
| Alumnos | Alto | Alta | Media |
| Profesores | Alto | Alta | Media |
| Vehículos | Alto | Media | Media |
| Clases | Alto | Alta | Media |
| Exámenes | Medio | Media | Alta |
| Temarios | Alto | Alta | Media |
| Matrículas / bonos / facturas | Medio | Media | Alta |
| Informes | Medio | Media | Alta |
| Notificaciones | Medio | Media | Media |
| Nóminas | Medio | Media | Media |

## 6. Recomendación de ejecución

### Fase A — Consolidar inventario

- Documentar módulos con más evidencia real.
- Registrar permisos y rutas por módulo.
- Señalar contradicciones entre documentación y código.

### Fase B — Completar descripciones funcionales

- Añadir flujos de alta, edición, consulta, validación y excepción.
- Documentar casos alternativos y errores.

### Fase C — Validar permisos y trazabilidad

- revisar backend, frontend y schema.
- confirmar que cada acción está cubierta por roles y endpoints.
- cerrar discrepancias de roles y UI.

### Fase D — Redactado final

- producir el documento funcional definitivo por módulos.
- mantener la separación entre funcionalidad implementada, parcialmente implementada y no verificada.
- evitar resúmenes vacíos y trabajo por aproximación.

## 7. Criterio de cierre

La documentación solo puede considerarse cerrada cuando:

- cada módulo tiene evidencia técnica descrita
- cada permiso se ha validado o indicado como no verificado
- cada flujo principal tiene descripción de resultado esperado
- cada discrepancia y laguna están explicitadas
- no se han inventado funcionalidades no presentes en el repositorio

## 8. Conclusión

El proyecto ya tiene una base sólida para una documentación funcional de calidad, pero necesita una fase de consolidación documental específica. El enfoque correcto consiste en mantener el análisis por módulo, contrastar con código real y no convertir la documentación en un resumen no verificable.
