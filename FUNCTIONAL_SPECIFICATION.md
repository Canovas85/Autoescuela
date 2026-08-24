# FUNCTIONAL_SPECIFICATION.md

## Estado del documento

Versión revisada de la especificación funcional alineada con la implementación actual del proyecto.

Este documento describe lo que el sistema realmente cubre hoy y marca con claridad qué funcionalidades están todavía pendientes como evolución del producto.

---

# 1. Alcance actual del sistema

La aplicación actual ya cubre funcionalmente estas áreas:

- login y autenticación
- gestión de alumnos
- gestión de profesores
- gestión de vehículos
- gestión de clases prácticas
- gestión de exámenes
- gestión básica de formación teórica
- gestión administrativa de temarios, bonos y solicitudes de examen
- dashboard ejecutivo
- dashboard de alumno

Las siguientes áreas quedan fuera del alcance actual y forman parte del roadmap:

- pagos y facturación
- formación teórica completa
- soporte y administración interna
- gestión avanzada de permisos

---

# 2. Actor principal: Administrador

## 2.1 Autenticación y acceso

Capacidades actuales:

- iniciar sesión con email y contraseña
- recibir token JWT
- recibir estado de primer acceso (`requiereCambioPassword`)
- acceder a páginas protegidas
- consultar dashboard administrativo
- cambiar contraseña obligatoriamente en primer login

Capacidades futuras:

- gestión de permisos por entidad
- permisos más granulares por acción
- logs de auditoría

---

## 2.2 Gestión de usuarios

Capacidades actuales:

- crear usuario con rol asignado
- autenticar al usuario
- consultar lista de usuarios por backend
- usar rol para controlar acceso a rutas

Capacidades futuras:

- gestión completa de usuarios por interfaz administrativa
- desactivar/reactivar usuario con control detallado
- edición de perfiles con más campos y permisos

---

## 2.3 Gestión de alumnos

Capacidades actuales:

- crear alumno
- listar alumnos
- consultar alumno por id
- actualizar datos básicos
- activar/desactivar alumno
- asignar profesor opcional

Casos funcionales reales del sistema actual:

- nombre, email, teléfono, dni, fecha de nacimiento y licencia objetivo
- estado activo/inactivo
- profesor asignado opcional
- horas prácticas registradas

---

## 2.4 Gestión de profesores

Capacidades actuales:

- crear profesor
- listar profesores
- actualizar datos básicos
- activar/desactivar profesor
- mantener relación con alumnos

---

## 2.5 Gestión de vehículos

Capacidades actuales:

- crear vehículo
- listar vehículos
- actualizar datos del vehículo
- activar/desactivar vehículo
- gestionar matrícula, marca, modelo y tipo de permiso
- gestionar imagen opcional del vehículo
- añadir, cambiar o eliminar la foto del vehículo desde edición
- visualizar la imagen en detalle y en el listado

### 2.5.1 Vehículos con imagen opcional

El vehículo puede crearse con o sin foto. En edición, la pantalla sigue el mismo patrón de detalle:

- lado izquierdo: campos del vehículo
- lado derecho: bloque de imagen con opciones de subir, cambiar o eliminar

El caso soportado actualmente es:

- si no tiene imagen, se puede añadir una nueva
- si ya tiene imagen, se puede cambiar por otra o marcarla para eliminación
- si se elimina, el backend borra el archivo físico y actualiza `imagenRuta = null`

### 2.5.2 Reglas de validación de imagen

Las restricciones actuales son:

- máximo 5 MB
- formatos permitidos: PNG, JPG/JPEG, WEBP
- almacenamiento físico en `backend/uploads/vehiculos`
- persistencia en BBDD con solo la ruta relativa pública

### 2.5.3 Comportamiento tras guardar edición

Cuando se actualiza un vehículo desde la edición:

- la vista del formulario se cierra
- el listado se refresca
- si el detalle estaba abierto, se actualiza inmediatamente con la respuesta del backend
- si la imagen se eliminó, la foto ya no vuelve a mostrarse en ese vehículo

---

## 2.6 Gestión de clases prácticas

Capacidades actuales:

- crear clase práctica
- listar clases
- actualizar información básica
- consultar estado de la clase
- relacionar alumno, profesor y vehículo

La lógica de negocio de disponibilidad y solapamientos debe reforzarse en una fase posterior.

---

## 2.7 Gestión de exámenes

Capacidades actuales:

- crear examen
- listar exámenes
- asociar examen a alumno
- registrar tipo, fecha y estado

---

## 2.8 Dashboard ejecutivo

Capacidades actuales:

- consultar KPIs principales
- consultar tasa de éxito
- consultar éxito mensual
- consultar exámenes pendientes
- consultar clases programadas
- identificar profesor con más clases
- identificar profesor con más horas

---

## 2.9 Gestión de formación teórica, bonos y solicitudes de examen

Capacidades actuales:

- crear, editar, listar y eliminar temarios
- registrar progreso de temarios por alumno
- almacenar tests prácticos por alumno y temario
- crear, editar, listar, activar y desactivar bonos
- consultar y mantener compras de bono
- crear, editar, listar y eliminar solicitudes de examen
- consultar las solicitudes con la relación alumno + usuario

---

# 3. Actor: Profesor

La entidad `PROFESOR` existe en el modelo actual, pero en la versión actual la lógica funcional está muy centrada en la administración.

## Funciones esperadas en el dominio

- impartir clases prácticas
- gestionar alumnos asignados
- consultar calendario y disponibilidad
- ver datos de sus clases

## Estado actual

El proyecto define el rol, pero aún no está completamente desarrollado como flujo de usuario específico con experiencia y permisos diferenciados.

---

# 4. Actor: Alumno

## Funciones esperadas en el dominio

- autenticarse en la aplicación
- consultar su información personal
- consultar clases asignadas
- consultar exámenes asociados
- consultar su estado activo/inactivo

## Estado actual

La experiencia del alumno ya está desarrollada de forma funcional en el dashboard de alumno, con información personal, progreso, clases, tests, bonos y solicitudes de examen integrada con el backend.

---

# 5. Funcionalidad general del sistema actual

## 5.1 Login

### Flujo actual

- el usuario introduce email y contraseña
- backend busca el usuario por email
- compara la contraseña con `passwordHash`
- genera un JWT con rol, email e indicador de primer acceso
- frontend guarda token y estado de primer acceso

### Flujo de primer acceso (obligatorio)

- si `requiereCambioPassword = true`, el frontend redirige a pantalla de primer login
- el usuario debe informar nueva contraseña y confirmación
- backend valida formato y coincidencia
- backend guarda nuevo hash y actualiza `requiereCambioPassword = false`
- frontend fuerza nuevo login con la contraseña recién establecida

### Restricción de seguridad durante primer acceso

- mientras `requiereCambioPassword = true`, el backend bloquea rutas autenticadas
- solo se permite el endpoint de cambio de contraseña de primer acceso

---

## 5.2 Listado y mantenimiento de entidades

La aplicación actual gestiona las entidades principales mediante CRUD básico:

- alumnos
- profesores
- vehículos
- clases
- exámenes
- temarios
- bonos
- solicitudes de examen

---

## 5.3 Protección por roles

El sistema actual usa esta lógica:

- autenticación obligatoria
- autorización por rol para rutas protegidas
- prioridad de acceso para ADMIN

La validación completa por permisos más finos queda como ampliación futura.

---

# 6. Funcionalidades futuras no implementadas

Estas funcionalidades están previstas en el proyecto y deben documentarse como roadmap:

## 6.1 Pagos y facturación

- bonos
- paquetes
- promociones
- pagos
- facturas
- impagos

## 6.2 Formación teórica

- temario
- materiales
- vídeos
- tests y simulacros
- seguimiento académico

## 6.3 Roles administrativos y de soporte

- ADMINISTRATIVO
- SOPORTE

## 6.4 Auditoría y trazabilidad

- registro de operaciones sensibles
- control de cambios críticos
- trazabilidad por usuario

## 6.5 Reglas avanzadas de negocio

- validación de edades específicas por permiso
- control de documentación de exámenes
- validación total de solapamiento de clases
- penalizaciones por cancelación tardía real

---

# 7. Matriz de funcionalidad actual vs futura

| Área                  | Estado       |
| --------------------- | ------------ |
| Login y JWT           | Implementado |
| Gestión de alumnos    | Implementado |
| Gestión de profesores | Implementado |
| Gestión de vehículos  | Implementado |
| Gestión de clases     | Implementado |
| Gestión de exámenes   | Implementado |
| Dashboard ejecutivo   | Implementado |
| Dashboard de alumno   | Implementado |
| Temarios              | Implementado |
| Bonos                 | Implementado |
| Solicitudes de examen | Implementado |
| Pagos y facturación   | Pendiente    |
| Formación teórica     | Pendiente    |
| Roles administrativos | Pendiente    |
| Soporte               | Pendiente    |
| Auditoría avanzada    | Pendiente    |
| Permisos granulares   | Pendiente    |

---

# 8. Conclusión

La especificación funcional actual del proyecto debe entenderse como una versión operativa orientada a la administración de la autoescuela, no como una visión completa de tipo producto final.

La implementación real ya cubre la base funcional crítica de la operación diaria; lo restante debe gestionarse como backlog funcional y no como requisito ya entregado.

---

# 9. Actualización funcional agosto 2026

## 9.1 Cambios implementados recientemente

### Autenticación en frontend

- el cliente HTTP incluye token JWT en cabecera `Authorization` para rutas protegidas
- se evita el fallo de token no enviado en operaciones administrativas
- se bloquea el acceso durante el primer login cuando `requiereCambioPassword` está activo

### Flujo de profesor

- creación y edición con `dni` obligatorio
- soporte de permisos múltiples de licencias para impartición (`B`, `A1`, `A2`, `A`, `C`, `D`, `E`)
- actualización consistente de datos de `Usuario` y `Profesor` en una sola operación transaccional
- edición administrativa sin modificación de contraseña

### Flujo de alumno

- en edición, si contraseña va vacía, se conserva la contraseña existente
- se muestra aviso visual explícito en modal de edición
- el dashboard de alumno ya consume la información personal, progresos, clases, tests, bonos y solicitudes de examen
- en la gestión académica se registra el estado de matrícula pagada con `matriculaPagada` y `fechaMatriculaPago`

### Formación teórica, bonos y solicitudes

- se han incorporado endpoints y pantallas para temarios, bonos y solicitudes de examen
- el backend dispone de sus capas `repository`, `service`, `controller` y `routes` para estas tres features
- se ha añadido cobertura de tests de servicio, controlador, rutas y repositorio
- el backend completo queda validado con la suite total de Vitest
- se han integrado progreso de temarios, tests prácticos, compras de bono y estados de solicitudes

### Vehículos con imagen

- el alta y la edición de vehículos admiten imagen opcional
- la imagen se guarda en filesystem del backend y se persiste como ruta pública en base de datos
- se admite sustituir, añadir o eliminar la foto desde la edición
- las validaciones actuales incluyen `png`, `jpg/jpeg`, `webp` y tamaño máximo de 5 MB

---

## 9.2 Decisiones aprobadas para vehículos (siguiente iteración)

### Imagen de vehículo

- el alta de vehículo permite imagen opcional
- la edición permite añadir, cambiar o no informar imagen
- el archivo de imagen se almacenará en carpeta del servidor
- la base de datos almacenará la referencia/ruta del archivo

### Validaciones de imagen

- tamaño máximo `5 MB`
- formatos permitidos: `png`, `jpg/jpeg`, `webp`

### Detalle de vehículo (fase posterior)

- desde el listado administrativo se podrá abrir una vista de detalle
- la vista mostrará datos completos e imagen en mayor tamaño
