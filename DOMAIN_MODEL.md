# DOMAIN_MODEL.md

## Estado del documento

Versión revisada del modelo de dominio alineada con el sistema real implementado.

Este documento describe el dominio que realmente existe en el proyecto actual, y deja además marcadas las extensiones futuras que se planean incorporar más adelante.

---

# 1. Contexto del negocio actual

La aplicación gestiona una autoescuela con las siguientes áreas funcionales ya presentes:

- autenticación y roles
- gestión de alumnos
- gestión de profesores
- gestión de vehículos
- gestión de clases prácticas
- gestión de exámenes
- gestión básica de formación teórica
- gestión administrativa de temarios, bonos y solicitudes de examen
- dashboard ejecutivo
- dashboard de alumno

El modelo actual es más operativo que estratégico, y está centrado en la administración diaria de la autoescuela.

---

# 2. Dominio actual

## 2.1 Identidad y acceso

### Usuario

Representa a cualquier persona que accede a la aplicación.

#### Atributos actuales

- id
- nombre
- dni
- email
- telefono
- passwordHash
- requiereCambioPassword
- rol
- fechaCreacion

#### Relaciones

- un usuario puede ser ADMIN, PROFESOR o ALUMNO
- un usuario puede estar asociado a un alumno o profesor

#### Estado actual

El sistema actual usa dos estados funcionales principales en usuario:

- rol (ADMIN, PROFESOR, ALUMNO)
- `requiereCambioPassword` para forzar cambio de contraseña en primer acceso

---

## 2.2 Gestión académica y operativa

### Alumno

Representa al estudiante matriculado en la autoescuela.

#### Atributos actuales

- id
- tipoLicenciaObjetivo
- fechaNacimiento
- horasPracticasCompletadas
- matriculaPagada
- fechaMatriculaPago
- profesorAsignadoId
- activo

#### Relaciones

- tiene un usuario asociado
- puede tener un profesor asignado
- puede tener varias clases prácticas
- puede tener varios exámenes
- puede tener varios tests prácticos
- puede tener varios progresos de temario
- puede tener varias compras de bono
- puede tener varias solicitudes de examen

#### Estado actual

- activo: boolean
- inactivo: boolean

Ejemplo real del sistema:

- `activo = true` para alumno disponible
- `activo = false` para alumno desactivado temporalmente

---

### Profesor

Representa al instructor responsable de impartir clases prácticas.

#### Atributos actuales

- id
- licenciaConducir
- permisosLicencias
- telefono
- activo

#### Relaciones

- tiene un usuario asociado
- puede tener varios alumnos asignados
- puede impartir varias clases prácticas

#### Estado actual

- activo: boolean

#### Notas de dominio implementadas

- `permisosLicencias` representa el conjunto de permisos que el profesor puede impartir
- `licenciaConducir` se mantiene como campo principal de compatibilidad
- el catálogo operativo de permisos actual es: `B`, `A1`, `A2`, `A`, `C`, `D`, `E`

---

### Vehiculo

Representa el vehículo disponible para las clases prácticas.

#### Atributos actuales

- id
- matricula
- marca
- modelo
- tipoPermiso
- imagenRuta (nullable)
- activo

#### Semántica actual de imagen

`imagenRuta` se usa para guardar la referencia pública de la imagen del vehículo:

- ejemplo: `/api/uploads/vehiculos/<nombre-archivo>`

El archivo físico real se almacena en la carpeta del backend:

- `backend/uploads/vehiculos`

Esto permite guardar solo la ruta en base de datos y mantener el contenido de los ficheros fuera del código fuente.

#### Relaciones

- puede estar asociado a varias clases prácticas

#### Estado actual

- activo: boolean
- imagenRuta: nullable, opcional para vehículos sin foto

#### Reglas implementadas sobre imagen

- puede estar vacío si el vehículo no tiene foto
- puede añadirse en alta o en edición
- puede reemplazarse por otra imagen
- puede eliminarse explícitamente y entonces se guarda `null`
- si se elimina, también se borra el archivo físico del backend

---

### ClasePractica

Representa la clase práctica asignada a un alumno con un profesor y un vehículo.

#### Atributos actuales

- id
- alumnoId
- profesorId
- vehiculoId
- fecha
- duracion
- estado

#### Relaciones

- pertenece a un alumno
- pertenece a un profesor
- pertenece a un vehículo

#### Estado actual

El estado de la clase se gestiona como valor textual del dominio, por ejemplo:

- programada
- completada
- cancelada
- reprogramada

La definición exacta del catálogo de estados puede ampliarse según la evolución del negocio.

---

### Examen

Representa la convocatoria o registro de examen asociado a un alumno.

#### Atributos actuales

- id
- alumnoId
- tipo
- fecha
- estado

#### Relaciones

- pertenece a un alumno

#### Estado actual

El estado del examen se gestiona también como valor textual, por ejemplo:

- pendiente
- aprobado
- suspendido
- cancelado

---

### Temario

Representa el contenido base de formación teórica organizado por permiso objetivo.

#### Atributos actuales

- id
- titulo
- descripcion
- tipoLicenciaObjetivo
- orden

#### Relaciones

- puede tener varios progresos de temario
- puede tener varios tests prácticos asociados

---

### TemarioProgreso

Representa el seguimiento de un alumno sobre un temario concreto.

Este agregado mantiene el estado resumen más reciente del tema para el alumno (dominio actual y última revisión), incluso cuando existen múltiples intentos históricos.

#### Atributos actuales

- id
- alumnoId
- temarioId
- revisado
- dominio
- ultimaRevision

#### Relaciones

- pertenece a un alumno
- pertenece a un temario

---

### TestPractica

Representa el resultado de un test práctico vinculado a un alumno y, opcionalmente, a un temario.

En la versión actual también se utiliza para guardar el historial de intentos de mini test por tema desde la pantalla de detalle del alumno.

#### Atributos actuales

- id
- alumnoId
- temarioId
- fecha
- resultado
- respuestasCorrectas
- totalPreguntas

#### Relaciones

- pertenece a un alumno
- puede estar asociado a un temario

#### Semántica actual para mini test por tema

- cada intento genera un registro nuevo
- `resultado` se deriva del porcentaje (`APROBADO` con umbral 80%, `SUSPENDIDO` en caso contrario)
- `respuestasCorrectas` y `totalPreguntas` guardan el detalle cuantitativo del intento
- el historial se consulta por `alumnoId + temarioId`, ordenado por fecha descendente

---

### Bono

Representa el catálogo administrativo de bonos disponibles para alumnos.

#### Atributos actuales

- id
- nombre
- descripcion
- clasesIncluidas
- validezDias
- activo

#### Relaciones

- puede tener varias compras asociadas

---

### CompraBono

Representa la compra concreta de un bono por parte de un alumno.

#### Atributos actuales

- id
- alumnoId
- bonoId
- clasesCompradas
- clasesConsumidas
- pagado
- fechaCompra
- fechaValidezHasta

#### Relaciones

- pertenece a un alumno
- pertenece a un bono

---

### SolicitudExamen

Representa la petición administrativa de un alumno para convocar un examen.

#### Atributos actuales

- id
- alumnoId
- tipo
- estado
- fechaSolicitud
- fechaProgramada
- observaciones

#### Relaciones

- pertenece a un alumno

---

# 3. Roles actuales del sistema

## Rol

El modelo actual define el siguiente enum:

- ADMIN
- PROFESOR
- ALUMNO

Esto se corresponde con la implementación real del esquema Prisma.

---

# 4. Relaciones principales del dominio actual

```text
Usuario
  ├── ADMIN
  ├── PROFESOR
  └── ALUMNO

Alumno
  ├── 1:1 con Usuario
  ├── N:1 con Profesor (asignado opcional)
  ├── 1:N con ClasePractica
  └── 1:N con Examen

Profesor
  ├── 1:1 con Usuario
  ├── 1:N con ClasePractica
  └── 1:N con Alumno (asignación de alumnos)

Vehiculo
  └── 1:N con ClasePractica

ClasePractica
  ├── N:1 con Alumno
  ├── N:1 con Profesor
  └── N:1 con Vehiculo

Examen
  └── N:1 con Alumno
```

---

# 5. Entidades futuras previstas

Estas entidades no están implementadas todavía, pero forman parte del roadmap funcional del proyecto:

## 5.1 Pago

- id
- alumnoId
- importe
- concepto
- fecha
- estado

## 5.2 Factura

- id
- alumnoId
- numeroFactura
- importe
- fechaEmision
- estado

## 5.3 Rol administrativo / soporte

Se plantean como ampliación del sistema para gestionar operaciones internas y soporte al cliente.

---

# 6. Modelo de estados real del sistema actual

## Estados soportados en modelo implementado

### Usuario

- rol definido por enum
- `requiereCambioPassword` controla si debe completar el flujo de primer acceso

### Alumno

- activo / inactivo

### Profesor

- activo / inactivo

### Vehiculo

- activo / inactivo

### ClasePractica

- texto libre de negocio definido por la aplicación

### Examen

- texto libre de negocio definido por la aplicación

---

# 7. Qué NO forma parte del dominio actual

Las siguientes áreas pertenecen al proyecto futuro, no a la versión actual:

- pagos y facturación integrados
- formación teórica completa
- materiales educativos y tests online avanzados
- soporte técnico interno
- permisos granulares por acción
- auditoría avanzada
- evolución económica completa de bonos y paquetes con pasarela de pago

---

# 8. Conclusión

El dominio real del proyecto actual es una plataforma operativa de gestión de autoescuela centrada en:

- usuarios
- alumnos
- profesores
- vehículos
- clases
- exámenes
- dashboard

La finalidad de este documento es reflejar ese modelo real y distinguirlo de los conceptos de negocio más amplios que se prevén como evolución futura.

---

# 9. Actualización de dominio agosto 2026

## 9.1 Cambios ya aplicados

- el agregado `Profesor` amplía su capacidad con permisos múltiples de licencias (`permisosLicencias`)
- la edición administrativa de profesor se aplica de forma transaccional entre `Usuario` y `Profesor`
- la edición de alumno y profesor conserva la contraseña actual cuando no se informa nuevo valor
- el dominio incluye matrícula de alumno pagada y fecha asociada (`matriculaPagada`, `fechaMatriculaPago`)
- el dominio incorpora temarios, progreso de temarios, tests prácticos, bonos, compras de bono y solicitudes de examen
- el dashboard de alumno ya forma parte del modelo funcional real
- el usuario queda modelado con `dni` opcional, `telefono` y `requiereCambioPassword` para gestionar acceso inicial y perfil del alumno/profesor
- el agregado `Vehiculo` usa `imagenRuta` como referencia opcional y admite edición de imagen desde alta y actualización
- el backend gestiona archivos físicos de vehículo en `backend/uploads/vehiculos` y conserva solo la ruta pública en base de datos
- el dominio teórico incorpora mini test por tema con persistencia dual:
  - estado resumen en `TemarioProgreso`
  - historial de intentos en `TestPractica`

## 9.2 Cambios aún pendientes

- la evolución futura sigue siendo ampliar reglas de gestión sobre imágenes y adjuntos
- la imagen física se almacena en filesystem del backend
- tipos permitidos: `png`, `jpg/jpeg`, `webp`
- tamaño máximo: `5 MB`

## 9.3 Estado actual del dominio (agosto 2026)

El dominio real del proyecto ya ha evolucionado desde la primera versión hacia una estructura operativa más completa:

- `Usuario`: identidad, rol, alta de acceso, cambio de contraseña obligatorio y validación de primer login
- `Profesor`: perfil docente con permisos múltiples y relación con alumnos
- `Alumno`: expediente académico y administrativo con asignación de profesor, matricula pagada y dashboard asociado
- `Vehiculo`: disponibilidad operativa y soporte de imagen opcional
- `Temario` / `TemarioProgreso` / `TestPractica`: seguimiento teórico y análisis del aprendizaje
- `Bono` / `CompraBono`: catálogo y compra de bonos por alumno
- `SolicitudExamen`: flujo administrativo para solicitud, programación y estado
- `Dashboard`: indicadores operativos y vista personalizada del alumno

Este conjunto representa la base funcional real del sistema actual, y el resto de extensiones continúan planteadas como evolución futura.
