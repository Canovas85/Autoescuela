# Autoescuela EGUZKILORE

## Actualizacion de estado (2026-11-03)

Este documento refleja el estado funcional y tecnico real del proyecto segun:

- codigo backend y frontend actualmente versionado
- modelo de datos Prisma en PostgreSQL
- rutas activas montadas en `backend/src/app.js`
- validaciones y reglas implementadas en servicios y middleware

---

## Indice

1. Descripcion
2. Objetivos
3. Alcance
4. Roles de usuario
5. Funcionalidades
6. Estado actual del proyecto
7. Arquitectura
8. Estructura del proyecto
9. Stack tecnologico
10. Backend
11. Frontend
12. Base de datos
13. Reglas de negocio
14. Autenticacion y autorizacion
15. Testing
16. Instalacion y puesta en marcha
17. Documentacion funcional
18. Roadmap realista
19. Seguridad

---

## Descripcion

Aplicacion web de gestion integral para autoescuela, orientada actualmente a una unica organizacion.
Incluye operativa academica, administrativa y economica:

- usuarios y roles
- alumnos y profesores
- matriculas, pagos y facturacion
- clases, hoja de ruta y progreso de expediente
- temarios, test DGT, convocatorias y solicitudes de examen
- notificaciones y reporting operativo

---

## Objetivos

- centralizar la gestion diaria de la autoescuela
- mantener trazabilidad de expediente y economia por alumno
- soportar operativa por rol (admin, administrativo, soporte, profesor, alumno)
- garantizar consistencia entre backend, frontend y reglas documentadas

---

## Alcance

### Ambito actual

- despliegue single-autoescuela
- autenticacion JWT y control de permisos por rol
- CRUD y procesos principales de operacion academica y economica
- soporte de estados de expediente unificados

### Posible evolucion futura

- separacion multi-autoescuela
- permisos mas granulares
- auditoria extendida de operaciones criticas

---

## Roles de usuario

Roles definidos en Prisma (`enum Rol`):

- `ADMIN`
- `ADMINISTRATIVO`
- `SOPORTE`
- `PROFESOR`
- `ALUMNO`

Notas relevantes:

- en backend y frontend se normaliza el rol legado `GESTOR` a `SOPORTE`
- menu y vistas se ajustan dinamicamente por rol y estado del alumno

---

## Funcionalidades

### Gestion academica

- alumnos, profesores, vehiculos
- clases practicas (circulacion/pista), reservas, cancelaciones
- hojas de ruta y catalogo de faltas
- examenes y convocatorias
- solicitudes de examen teorico y practico con evaluacion y fases

### Gestion teorica

- temarios por licencia
- progreso por alumno
- test DGT y resultados por intento
- clases en directo (contenido formativo)

### Gestion economica

- tarifas de matricula y tarifas por concepto
- promociones y bonos
- matriculas, pagos y facturas (incluye vista/pdf/duplicado)
- gastos de combustible
- nominas

### Soporte operativo

- notificaciones por eventos de negocio
- dashboard por rol
- informes y vistas agregadas
- gestion de otros usuarios operativos

---

## Estado actual del proyecto

### Implementado y activo

- backend Express modular por features
- frontend React con rutas protegidas y layout por rol
- persistencia con Prisma sobre PostgreSQL
- pruebas backend amplias por capa y modulo
- pruebas frontend puntuales en flujo de temarios

### Observaciones de estado real

- feature `convocatorias-teorico` montada y expuesta en API principal (`/api/convocatorias-teorico`)
- existe feature `matriculas-conceptos` a nivel de modelo/dominio, integrada via `matriculas`, sin router dedicado montado
- el expediente de alumno usa catalogo unificado de fases y compatibilidad con codigos legacy

---

## Arquitectura

### Backend

Patron aplicado por modulo:

`routes -> controller -> service -> repository`

### Frontend

Organizacion por funcionalidad:

- `pages/`
- `services/`
- `components/`
- `routes/`
- `utils/`

---

## Estructura del proyecto

- `backend/`
  - `src/features/` (modulos de negocio)
  - `src/shared/` (dominio comun, middleware, utilidades)
  - `prisma/schema.prisma`
- `frontend/`
  - `src/pages/`, `src/services/`, `src/components/`, `src/utils/`
- `audits/documentacion-funcional/`
  - inventarios y documentacion modular de apoyo

---

## Stack tecnologico

### Backend

- Node.js + Express (ES Modules)
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs
- Vitest + Supertest

### Frontend

- React + Vite
- Material UI + DataGrid
- Axios
- Vitest + Testing Library

---

## Backend

### Modulos montados actualmente (API)

`auth`, `alumnos`, `profesores`, `clases`, `examenes`, `dashboard`, `vehiculos`,
`temarios`, `bonos`, `matriculas`, `tarifas-matricula`, `tarifas-concepto`,
`promociones`, `solicitudes-examen`, `clases-directo`, `facturas`, `pagos`,
`preguntas-dgt`, `documentos-alumno`, `convocatorias-examen`, `convocatorias-teorico`, `notificaciones`,
`hojas-ruta`, `gastos-combustible`, `informes`, `otros-usuarios`, `nominas`.

### Salud y soporte

- `GET /api/health`
- Swagger en `/api-docs`

---

## Frontend

### Caracteristicas de navegacion

- login, activacion de cuenta y primer cambio de password
- rutas protegidas por token y condicion de primer acceso
- menu lateral dinamico por rol y estado de expediente/licencia

### Cobertura de pantallas

Incluye vistas para todos los modulos principales operativos:
alumnos, profesores, vehiculos, clases, examenes, temarios, test DGT,
solicitudes/convocatorias, matriculas, pagos/facturas, gastos, nominas,
hojas de ruta, notificaciones, informes y administracion de usuarios.

---

## Base de datos

### Motor y ORM

- PostgreSQL
- Prisma (`backend/prisma/schema.prisma`)

### Entidades relevantes

Usuario, Alumno, Profesor, Vehiculo, ClasePractica, HojaRuta,
SolicitudExamen, Examen, Temario, TestPractica, PreguntaDGT,
Bono, CompraBono, Matricula, Pago, Factura, Promocion,
TarifaMatricula, TarifaConcepto, Nomina, Notificacion, entre otras.

---

## Reglas de negocio

Referencia principal:

- `BUSINESS_RULES.md` (catalogo actualizado de reglas aplicadas)
- `BR_TRACEABILITY_INDEX.md` (trazabilidad regla -> evidencia)

Reglas destacadas implementadas:

- matricula pagada como condicion para avance del expediente
- estados de solicitud/examen con validaciones de transicion
- fases practicas por tipo de licencia (circulacion/pista)
- control de ownership en acciones de alumno (pagos, facturas, etc.)
- gestion de activos/inactivos en entidades operativas

---

## Autenticacion y autorizacion

- JWT obligatorio en rutas protegidas
- middleware `authenticate` + `authorize(...roles)`
- restriccion de primer acceso hasta cambio de password
- soporte de roles multi-perfil con restricciones por endpoint

---

## Testing

### Backend

- suite amplia en `backend/src/features/**/__tests__`
- pruebas por capas (routes, controller, service, repository) en gran parte de modulos

### Frontend

- pruebas focalizadas en flujos de temario
- pendiente ampliar cobertura transversal por modulos

### Validacion de estado documental (2026-11-03)

- backend: `npm test` -> 81 archivos / 689 tests superados
- frontend: `npm test` -> 2 archivos / 2 tests superados
- frontend: `npm run build` -> compilacion correcta

---

## Instalacion y puesta en marcha

### Backend

1. `cd backend`
2. `npm install`
3. configurar `.env` (`DATABASE_URL`, `JWT_SECRET`, etc.)
4. `npm run prisma:generate`
5. `npm run prisma:migrate`
6. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. configurar `VITE_API_BASE_URL` si aplica
4. `npm run dev`

---

## Documentacion funcional

- `README.md`
- `BUSINESS_RULES.md`
- `DOMAIN_MODEL.md`
- `FUNCTIONAL_SPECIFICATION.md`
- `BR_TRACEABILITY_INDEX.md`
- `ESTADOS_EXPEDIENTE.md`
- `audits/documentacion-funcional/DOCUMENTACION_MODULOS_DETALLADA.md`
- `audits/documentacion-funcional/INVENTARIO_DOCUMENTACION_EXISTENTE.md`
- `audits/documentacion-funcional/INVENTARIO_MAESTRO_FUNCIONAL.md`

---

## Roadmap realista

1. cerrar trazabilidad funcional completa de reglas por modulo
2. ampliar cobertura de tests frontend y casos de regresion
3. consolidar procesos batch de examenes y auditoria operativa
4. evaluar requisitos para evolucion multi-autoescuela

---

## Seguridad

- no exponer secretos ni credenciales
- mantener controles de autenticacion/autorizacion existentes
- evitar bypass de validaciones de negocio y ownership
- mantener actualizadas dependencias y reglas de acceso por rol
