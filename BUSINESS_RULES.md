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

## BR-AUTH-007 - Cambio obligatorio en primer acceso

Todo usuario creado con contraseña inicial debe tener `requiereCambioPassword = true`.

Mientras esa marca esté activa, el usuario debe cambiar su contraseña antes de acceder al resto de funcionalidades protegidas.

---

## BR-AUTH-008 - Excepción de acceso durante primer login

Cuando `requiereCambioPassword = true`, el sistema solo debe permitir el endpoint de cambio de contraseña del primer acceso.

El resto de rutas autenticadas deben devolver acceso denegado hasta completar el cambio.

---

## BR-AUTH-009 - Reglas de contraseña para primer cambio

La nueva contraseña del primer acceso debe cumplir:

- mínimo 8 caracteres
- al menos una mayúscula
- al menos una minúscula
- al menos un número

---

## BR-AUTH-010 - Confirmación de contraseña obligatoria

En el cambio de contraseña de primer acceso, `newPassword` y `confirmPassword` deben coincidir.

Si no coinciden, el sistema debe rechazar la operación.

---

## BR-AUTH-011 - Persistencia del cambio y desactivación de primer acceso

Tras un cambio correcto de contraseña:

- se almacena el nuevo `passwordHash`
- se actualiza `requiereCambioPassword = false`

Desde ese momento, los siguientes logins deben funcionar con la nueva contraseña y sin redirección al flujo de primer acceso.

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
- E (Remolques)

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
- dni
- fecha de nacimiento
- licencia objetivo

En el diseño actual:

- el DNI se gestiona en el modelo de `Usuario`
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

## BR-VEH-005 - Imagen opcional en vehículos

Cada vehículo puede tener o no una imagen asociada.

La imagen se gestiona mediante el campo `imagenRuta`, que puede ser:

- una referencia pública tipo `/api/uploads/vehiculos/<nombre-archivo>`
- `null` cuando el vehículo no tiene imagen

La imagen no es obligatoria ni en alta ni en edición.

---

## BR-VEH-006 - Alta y edición con imagen

En la implementación actual, la edición de un vehículo puede hacerse con estas combinaciones:

- sin cambiar la imagen
- añadir una imagen nueva si el vehículo no tenía ninguna
- cambiar la foto por otra nueva
- eliminar la foto existente

Si se elimina la imagen, el sistema debe:

1. poner `imagenRuta = null`
2. borrar el archivo físico del backend
3. reflejar el resultado inmediatamente en la vista de detalle y en la fila del listado

---

## BR-VEH-007 - Ruta real de almacenamiento

La imagen física del vehículo se almacena en la carpeta del backend:

- `backend/uploads/vehiculos`

La API expone ese contenido a través de:

- `/api/uploads/vehiculos/<nombre-archivo>`

Esto permite guardar solo la referencia en base de datos y mantener el contenido del archivo fuera del código fuente.

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

---

# 11. Actualización agosto 2026 (cambios recientes)

## BR-AUTH-012 - Cabecera Authorization obligatoria en rutas protegidas

Las llamadas del frontend a endpoints protegidos deben enviar `Authorization: Bearer <token>`.

Si no se envía token, la API devuelve `401` con mensaje de token no enviado.

---

## BR-PRO-005 - DNI obligatorio en alta y edición de profesor

Para profesores, el `dni` es obligatorio y debe cumplir formato válido de 8 números + 1 letra.

---

## BR-PRO-006 - Permisos de licencias múltiples en profesor

Un profesor puede impartir clases para varios permisos simultáneamente.

Reglas aplicadas:

- debe existir al menos un permiso seleccionado
- se normalizan y deduplican los valores
- catálogo permitido: `B`, `A1`, `A2`, `A`, `C`, `D`, `E`

---

## BR-PRO-007 - Actualización transaccional de profesor

La edición de profesor debe actualizar de forma consistente:

- datos de usuario (`nombre`, `email`, `dni`, `telefono`)
- datos de profesor (`licenciaConducir`, `permisosLicencias`, `telefono`)

La operación se realiza en una transacción para evitar estados intermedios inconsistentes.

---

## BR-PRO-008 - Contraseña no modificable en edición administrativa de profesor

En la edición administrativa de profesor, si no se informa contraseña, se mantiene la actual sin cambios.

En la implementación actual la contraseña de profesor no se modifica desde este formulario.

---

## BR-ALU-007 - Contraseña no modificable si se deja vacía en edición

En edición de alumno, si la contraseña llega vacía, el sistema conserva la contraseña actual y no recalcula hash.

---

## BR-VEH-005 - Imagen de vehículo (acordado para siguiente iteración)

Se incorpora la decisión funcional de añadir una referencia de imagen por vehículo.

Reglas aprobadas:

- la imagen no es obligatoria en el alta
- en edición se puede añadir o cambiar imagen, o mantener sin imagen
- los archivos se guardan en carpeta del servidor
- en base de datos se guarda solo la referencia/ruta de imagen

---

## BR-VEH-006 - Validación de imagen de vehículo (acordado)

Para alta y edición de imagen de vehículo:

- tamaño máximo: `5 MB`
- formatos permitidos: `png`, `jpg/jpeg`, `webp`

---

## BR-VEH-007 - Vista detalle de vehículo (próxima fase)

Se implementará una vista de detalle desde el listado para visualizar:

- datos completos del vehículo
- imagen en tamaño mayor
