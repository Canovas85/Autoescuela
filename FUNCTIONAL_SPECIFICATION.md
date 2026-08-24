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
- dashboard ejecutivo

Las siguientes áreas quedan fuera del alcance actual y forman parte del roadmap:

- pagos y facturación
- bonos y paquetes
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

La entidad existe y está integrada con el backend, pero la experiencia del alumno no está desarrollada todavía como flujo completo frente a la administración.

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

### Flujo de profesor

- creación y edición con `dni` obligatorio
- soporte de permisos múltiples de licencias para impartición (`B`, `A1`, `A2`, `A`, `C`, `D`, `E`)
- actualización consistente de datos de `Usuario` y `Profesor` en una sola operación transaccional
- edición administrativa sin modificación de contraseña

### Flujo de alumno

- en edición, si contraseña va vacía, se conserva la contraseña existente
- se muestra aviso visual explícito en modal de edición

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
