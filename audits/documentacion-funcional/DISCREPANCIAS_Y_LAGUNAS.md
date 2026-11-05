# DISCREPANCIAS Y LAGUNAS

## 1. Propósito

Este documento recoge las diferencias y vacíos detectados entre la documentación del proyecto y la evidencia real del repositorio. La intención no es corregir código ni reescribir la aplicación, sino detectar qué áreas requieren todavía documentación, verificación o consolidación.

## 2. Discrepancias principales

### D-01. Roles documentados versus roles reales en esquema

**Evidencia documental:**

- `README.md` indica que el sistema contempla roles base y que algunos roles formarán parte del alcance futuro.

**Evidencia técnica real:**

- `backend/prisma/schema.prisma` define el enum `Rol` con:
  - `ADMIN`
  - `ADMINISTRATIVO`
  - `SOPORTE`
  - `PROFESOR`
  - `ALUMNO`

**Conclusión:**

La documentación del proyecto no siempre refleja el estado real del esquema Prisma ni la actividad operativa de los roles. El modelo actual ya contempla `ADMINISTRATIVO` y `SOPORTE` como roles reales.

### D-02. Permisos granulares no consolidados

**Evidencia técnica:**

- `backend/src/shared/middleware/role.middleware.js` aplica validación por rol mediante `authorize(...roles)`.
- `backend/src/features/auth/auth.routes.js` restringe endpoints específicos como reenviar activación a `ADMIN` y `ADMINISTRATIVO`.

**Observación:**

La infraestructura de autorización existe y funciona con base en roles. Sin embargo, la documentación funcional todavía no consolida, con profundidad, permisos finos por entidad, pantalla y acción para el conjunto completo del sistema.

### D-03. Documentación de módulos vs evidencia del código

**Evidencia documental:**

- README y especificaciones describen los módulos del negocio de forma amplia.

**Evidencia técnica:**

- `backend/src/app.js` registra rutas de múltiples features de forma real.

**Observación:**

La funcionalidad está presente en la arquitectura y el proyecto, pero no llega a documentarse con el mismo detalle para cada operación, validación y flujo alternativo.

### D-04. Reglas avanzadas de agenda y disponibilidad

**Evidencia documental:**

- `BUSINESS_RULES.md` menciona reglas como solapamiento, descanso y carga máxima.

**Observación:**

Estas reglas están descritas como parte del negocio, pero la verificación profunda de implementación puede requerir un análisis más detallado en servicios o validaciones del flujo de clases y horarios.

### D-05. Cobertura de soporte y administrativo en UI

**Evidencia técnica:**

- `frontend/src/routes/AppRouter.jsx` incluye múltiples pantallas y rutas del área administrativa.

**Observación:**

No siempre queda documentado de forma explícita cuál es la visibilidad exacta de cada экран para cada rol, ni la consistencia entre la UI y la autorización real del backend.

## 3. Lagunas detectadas

### L-01. Falta de trazabilidad por operación

No todas las funcionalidades tienen una trazabilidad clara entre:

- ruta backend
- controlador
- servicio
- repositorio
- permisos
- Pantalla frontend
- regla de negocio

### L-02. Falta de detalle por excepción

Para varias features se documentan el propósito general, pero no se registran:

- errores comunes
- validaciones de negocio
- casos límite
- estados intermedios
- transiciones de flujo

### L-03. Falta de documento de cobertura por módulo actualizada

El repositorio dispone de documentación funcional, pero no existe todavía un catálogo maestro que relacione cada módulo con:

- estado de implementación
- evidencia real
- estado de verificación
- discrepancias detectadas

### L-04. Permisos por módulo no completamente formalizados

Se comprueba base técnica y ruta, pero no hay un documento único con las autorizaciones exactas por módulo y por acción.

## 4. Impacto para la documentación final

La auditoría funcional final debe tener cuidado de no convertir estas lagunas en suposiciones. El enfoque correcto es:

- documentar lo verificado
- indicar lo parcialmente verificado
- separar lo implementado y lo solo previsto
- dejar constancia de lo no verificable con la información actual

## 5. Conclusión

La principal oportunidad del proyecto no es inventar más funcionalidad, sino cerrar la trazabilidad y la coherencia entre la documentación, la implementación y los permisos reales. La calidad de la documentación funcional dependerá de esta validación final, no solo del volumen del contenido documentado.
