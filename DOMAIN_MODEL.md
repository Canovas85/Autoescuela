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
- dashboard ejecutivo

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
- profesorAsignadoId
- activo

#### Relaciones

- tiene un usuario asociado
- puede tener un profesor asignado
- puede tener varias clases prácticas
- puede tener varios exámenes

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
- activo

#### Extensión aprobada (próxima iteración)

- imagenRuta (nullable): referencia al archivo de imagen almacenado en carpeta del servidor

#### Relaciones

- puede estar asociado a varias clases prácticas

#### Estado actual

- activo: boolean

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

## 5.1 Bono / Paquete

- id
- nombre
- tipo
- precio
- fechaCaducidad
- activo

## 5.2 Pago

- id
- alumnoId
- importe
- concepto
- fecha
- estado

## 5.3 Factura

- id
- alumnoId
- numeroFactura
- importe
- fechaEmision
- estado

## 5.4 Rol administrativo / soporte

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
- bonos y paquetes
- formación teórica completa
- materiales educativos y tests online
- soporte técnico interno
- permisos granulares por acción
- auditoría avanzada

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

## 9.2 Cambios acordados para la siguiente iteración

- el agregado `Vehiculo` incorporará una referencia de imagen opcional (`imagenRuta`)
- la imagen física se almacenará en filesystem del backend
- tipos permitidos: `png`, `jpg/jpeg`, `webp`
- tamaño máximo: `5 MB`
