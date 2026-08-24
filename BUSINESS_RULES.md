# BUSINESS_RULES.md

## Estado del documento

Versión revisada alineada con el proyecto actual implementado en agosto de 2026.

Este documento recoge las reglas que el sistema ya soporta de forma real en backend y frontend, y marca también las reglas que están previstas para fases futuras y aún no están desarrolladas.

---

# 1. Alcance actual del negocio

El sistema actual cubre de forma operativa:

- autenticación por email + contraseña
- gestión de usuarios y roles
- gestión de alumnos
- gestión de profesores
- gestión de vehículos
- gestión de clases prácticas
- gestión de exámenes
- dashboard ejecutivo

No están todavía implementadas en la versión actual:

- pagos y facturación
- bonos y paquetes
- formación teórica completa
- roles administrativos / soporte
- auditoría avanzada
- gestión completa de permisos por entidad

---

# 2. Reglas de autenticación y usuarios

## BR-AUTH-001 - Email único

Cada usuario debe tener un email único en el sistema.

Esto se corresponde con la restricción de `email` como campo único en Prisma.

---

## BR-AUTH-002 - Contraseña obligatoria

Todo usuario debe disponer de una contraseña en formato hash almacenado en `passwordHash`.

La contraseña original nunca debe persistirse en texto plano.

---

## BR-AUTH-003 - Longitud mínima de contraseña

La contraseña de un usuario debe tener al menos 8 caracteres para poder ser registrada.

---

## BR-AUTH-004 - Login por credenciales

Un usuario puede autenticarse mediante:

- email
- password

Si el email no existe o la contraseña no coincide con el hash almacenado, el sistema debe devolver un error de autenticación.

---

## BR-AUTH-005 - Roles soportados por el sistema actual

Los roles definidos en el modelo actual son:

- ADMIN
- PROFESOR
- ALUMNO

El sistema debe validar el rol del usuario al generar el JWT y debe usarlo para controlar acceso a rutas protegidas.

---

## BR-AUTH-006 - Protección de rutas por rol

Las rutas administrativas deben estar protegidas con autenticación y autorización.

En la versión actual, la condición implementada es principalmente:

- ADMIN puede acceder a gestión administrativa y dashboard

Las reglas más detalladas por permisos específicos quedan como ampliación futura.

---

# 3. Reglas de alumnos

## BR-ALU-001 - Relación usuario-alumno obligatoria

Todo alumno debe estar asociado a un registro de `Usuario`.

Esto se cumple con la relación `alumno.id -> usuario.id` y la creación de ambos registros de forma consistente.

---

## BR-ALU-002 - Email único en alumnos

El email del usuario asociado al alumno debe ser único en todo el sistema.

---

## BR-ALU-003 - Licencia objetivo obligatoria

Cuando se crea un alumno, debe indicarse `tipoLicenciaObjetivo`.

Ejemplo:

- B (Turismos)
- A1, A2, A (Motocicletas)
- C (Camiones destinados al transporte de carga, cuya masa máxima autorizada supera los 3.500 kg, con un límite de hasta 9 plazas (incluyendo el conductor))
- D (autobuses y autocares destinados al transporte de pasajeros, diseñados para llevar a más de 8 pasajeros además del conductor)

---

## BR-ALU-004 - Estado activo/inactivo del alumno

El alumno tiene un campo `activo` con valor booleano.

- `true`: activo
- `false`: inactivo

La gestión de activación/desactivación debe hacerse desde una acción administrativa.

---

## BR-ALU-005 - Profesor asignado opcional

Un alumno puede tener o no un profesor asignado.

- `profesorAsignadoId = null` indica que no tiene profesor asignado actualmente.

---

## BR-ALU-006 - Registro mínimo requerido para creación

Para crear un alumno en la implementación actual, debe existir al menos:

- nombre
- email
- contraseña
- teléfono
- licencia objetivo

En el diseño actual:

- el DNI se gestiona en el modelo de `Usuario` y puede heredarse por perfiles asociados
- la fecha de nacimiento se gestiona en el modelo de `Alumno`

---

# 4. Reglas de profesores

## BR-PRO-001 - Relación usuario-profesor obligatoria

Todo profesor debe estar asociado a un `Usuario`.

---

## BR-PRO-002 - Datos mínimos obligatorios

Un profesor debe tener:

- licencia de conducir
- teléfono
- estado activo

---

## BR-PRO-003 - Estado activo/inactivo del profesor

El profesor dispone de un campo `activo` booleano.

- `true`: disponible para operaciones
- `false`: no disponible

---

## BR-PRO-004 - Asignación de alumnos

Un profesor puede tener alumnos asignados, pero esta relación se gestiona como asociación del lado de alumno y profesor.

---

# 5. Reglas de vehículos

## BR-VEH-001 - Matrícula única

Cada vehículo debe tener una matrícula única.

Esto se corresponde con la restricción `matricula` como campo único en Prisma.

---

## BR-VEH-002 - Tipo de permiso obligatorio

Todo vehículo debe indicar `tipoPermiso`.

---

## BR-VEH-003 - Estado activo/inactivo del vehículo

El vehículo dispone de un campo `activo`.

- `true`: disponible
- `false`: no disponible

---

## BR-VEH-004 - Uso administrativo del vehículo

Un vehículo inactivo no debe estar disponible para asignación a nuevas clases.

---

# 6. Reglas de clases prácticas

## BR-CLA-001 - Existencia de recursos obligatoria

Para crear una clase práctica deben existir:

- alumno
- profesor
- vehículo

---

## BR-CLA-002 - Fecha obligatoria

La clase práctica debe incluir una fecha y una duración.

---

## BR-CLA-003 - Estado de clase

Las clases se gestionan con un campo `estado` textual, y la aplicación debe permitir su evolución según el flujo de negocio.

---

## BR-CLA-004 - Validación de disponibilidad

La regla funcional esperada es que no debe permitirse solapar:

- alumno
- profesor
- vehículo

en la misma franja horaria.

Esta validación está prevista para mayor madurez del negocio, pero no está implementada con validación exhaustiva en la versión actual.

---

## BR-CLA-005 - Reprogramación y cancelación

La lógica de cancelación y reprogramación debe quedar controlada por la capa de negocio del sistema.

La regla de negocio general es que una clase debe poder ser modificada o anulada por un administrador o por el actor autorizado.

---

# 7. Reglas de exámenes

## BR-EXA-001 - Relación con alumno obligatoria

Todo examen debe estar asociado a un alumno válido.

---

## BR-EXA-002 - Fecha y tipo obligatorios

Un examen debe incluir:

- tipo
- fecha
- estado

---

## BR-EXA-003 - Estado del examen

El estado del examen se gestiona con un valor textual del dominio, y la aplicación debe reflejar la evolución de su tramitación.

---

# 8. Reglas del dashboard

## BR-DASH-001 - Visibilidad administrativa

El dashboard está orientado a perfiles administrativos y a la supervisión operativa de la autoescuela.

---

## BR-DASH-002 - Cálculo de métricas

El dashboard debe presentar indicadores de rendimiento, evolución y actividad global del negocio.

Las métricas actuales se basan en:

- clases programadas
- exámenes pendientes
- tasa de éxito
- éxito mensual
- profesor con más clases
- profesor con más horas

---

# 9. Reglas pendientes / futuras

Las siguientes reglas forman parte del roadmap funcional y aún no están cubiertas por esta versión actual:

## BR-FUT-001 - Pagos y facturación

- bonos
- paquetes
- promociones
- pagos
- facturas
- impagos

## BR-FUT-002 - Formación teórica

- material educativo
- cursos en línea
- tests y simulacros
- evolución teórica del alumno

## BR-FUT-003 - Roles de soporte y administrativo

- ADMINISTRATIVO
- SOPORTE

## BR-FUT-004 - Permisos granulares

- permisos por entidad
- permisos por acción
- permisos por área funcional

## BR-FUT-005 - Auditoría avanzada

- registro de cambios críticos
- trazabilidad de acciones del administrador
- control de borrados y modificaciones sensibles

## BR-FUT-006 - Reglas avanzadas de negocio

- restricción por edad real para cada permiso
- validación de psicotécnico
- validación de documentación de exámenes
- control completo de solapamiento de calendario
- penalización por cancelaciones tardías con créditos reales

---

# 10. Conclusión

La versión actual del sistema está enfocada a la gestión operativa de una autoescuela con autenticación, alumnos, profesores, vehículos, clases, exámenes y dashboard.

Las reglas que aparecen aquí son las que realmente se corresponden con el código y el modelo de datos actuales. El resto debe entenderse como planificación funcional futura, no como requisito ya implementado.
