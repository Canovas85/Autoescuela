# 🚗 Autoescuela EGUZKILORE

Aplicación web para la gestión integral de una autoescuela, desarrollada inicialmente para **Autoescuela EGUZKILORE**.

El proyecto está concebido como una solución centralizada para gestionar alumnos, profesores, clases prácticas, vehículos, exámenes, formación teórica, usuarios, permisos, operaciones administrativas y, en futuras fases, pagos y facturación.

> **Estado:** 🚧 Proyecto en desarrollo  
> **Ámbito actual:** una única autoescuela — Autoescuela EGUZKILORE  
> **Evolución futura posible:** plataforma multi-autoescuela

---

## 📋 Índice

- [Descripción](#-descripción)
- [Objetivos](#-objetivos)
- [Alcance](#-alcance)
- [Roles de usuario](#-roles-de-usuario)
- [Funcionalidades](#-funcionalidades)
- [Estado actual del proyecto](#-estado-actual-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Stack tecnológico](#-stack-tecnológico)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Base de datos](#-base-de-datos)
- [Reglas de negocio](#-reglas-de-negocio)
- [Autenticación y autorización](#-autenticación-y-autorización)
- [Testing](#-testing)
- [Docker](#-docker)
- [Configuración](#-configuración)
- [Instalación y puesta en marcha](#-instalación-y-puesta-en-marcha)
- [Documentación del proyecto](#-documentación-del-proyecto)
- [Roadmap](#-roadmap)
- [Seguridad](#-seguridad)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

# 📌 Descripción

**Autoescuela EGUZKILORE** es un proyecto de aplicación web orientado a digitalizar y centralizar la gestión de una autoescuela.

La solución combina:

- Gestión de usuarios y roles.
- Gestión de alumnos.
- Gestión de profesores.
- Gestión de vehículos.
- Gestión de clases prácticas.
- Gestión de exámenes.
- Formación teórica.
- Seguimiento académico.
- Gestión administrativa.
- Gestión económica.
- Pagos y facturación.
- Comunicación y soporte.
- Estadísticas y dashboards.

La aplicación se está desarrollando progresivamente. Por este motivo, este README distingue entre las funcionalidades que forman parte del **alcance definitivo** y las que están **implementadas actualmente**.

---

# 🎯 Objetivos

Los objetivos principales del proyecto son:

1. Centralizar la gestión de la autoescuela en una única aplicación.
2. Facilitar la gestión diaria de alumnos, profesores y vehículos.
3. Digitalizar la formación teórica y práctica.
4. Permitir el seguimiento de la evolución académica de los alumnos.
5. Gestionar reservas de clases prácticas respetando las reglas de negocio.
6. Gestionar exámenes y sus correspondientes tramitaciones.
7. Incorporar progresivamente la gestión administrativa y económica.
8. Proporcionar diferentes niveles de acceso mediante roles y permisos.
9. Disponer de información y estadísticas para facilitar la toma de decisiones.
10. Mantener una arquitectura que pueda evolucionar en el futuro hacia una plataforma multi-autoescuela.

---

# 🎯 Alcance

## Ámbito actual

La primera versión del sistema está orientada exclusivamente a:

> **Autoescuela EGUZKILORE**

No se trata actualmente de una plataforma multi-tenant ni de un sistema destinado a gestionar múltiples autoescuelas.

## Posible evolución futura

Una vez finalizado el proyecto inicial, se podrá estudiar la evolución hacia una arquitectura capaz de gestionar:

```text
Plataforma
├── Autoescuela EGUZKILORE
├── Autoescuela 2
├── Autoescuela 3
└── ...
```

Esta posibilidad queda fuera del alcance actual.

---

# 👥 Roles de usuario

El sistema tendrá cinco roles funcionales:

| Rol                   | Descripción                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| 👑 **Administrador**  | Gestión global de usuarios, configuración, operaciones, permisos y supervisión del sistema. |
| 👨‍🏫 **Profesor**       | Gestión de agenda, alumnos, formación, clases prácticas y evaluaciones.                     |
| 🎓 **Alumno**         | Formación, tests, clases prácticas, seguimiento, exámenes y gestión económica.              |
| 🧾 **Administrativo** | Matrículas, documentación, operaciones, vehículos, facturación y tramitaciones.             |
| 🛠️ **Soporte**        | Atención a usuarios, incidencias, recuperación de acceso y soporte operativo.               |

### Estado actual de roles

El modelo de datos actual contempla:

- `ADMIN`
- `PROFESOR`
- `ALUMNO`

Los roles:

- `ADMINISTRATIVO`
- `SOPORTE`

forman parte del alcance definitivo y deberán incorporarse durante el desarrollo.

---

# ✨ Funcionalidades

## 👤 Gestión de usuarios

### Administrador

- Crear usuarios.
- Modificar usuarios.
- Desactivar usuarios.
- Reactivar usuarios.
- Gestionar roles.
- Gestionar permisos.
- Supervisar la actividad del sistema.

---

## 🎓 Gestión de alumnos

- Consultar expedientes.
- Actualizar información.
- Gestionar estado de la cuenta.
- Asignar profesor.
- Consultar progreso.
- Consultar clases.
- Consultar exámenes.
- Gestionar evolución teórica y práctica.

---

## 👨‍🏫 Gestión de profesores

- Registrar profesores.
- Actualizar información.
- Gestionar disponibilidad.
- Consultar agenda.
- Gestionar alumnos asignados.
- Registrar observaciones.
- Evaluar evolución práctica.
- Registrar información de las clases.

---

## 🚗 Gestión de vehículos

- Gestionar flota.
- Registrar vehículos.
- Asociar vehículos a clases.
- Controlar disponibilidad.
- Gestionar estados.
- Registrar mantenimiento.
- Controlar ITV.
- Reasignar vehículos cuando sea necesario.

---

## 📅 Clases prácticas

El sistema contempla:

- Reserva de clases.
- Consulta de agenda.
- Disponibilidad del alumno.
- Disponibilidad del profesor.
- Disponibilidad del vehículo.
- Reprogramación.
- Cancelación.
- Historial.
- Control de créditos.
- Penalizaciones por cancelación tardía.
- Asignación de profesor.
- Asignación de vehículo.

### Reglas principales

- Reserva mínima con 24 horas de antelación.
- Máximo de 3 clases futuras reservadas simultáneamente por alumno.
- No se permite solapamiento de alumno, profesor o vehículo.
- Se requiere disponer de créditos, bono activo o modalidad de pago autorizada.
- Las cancelaciones con más de 24 horas no tienen penalización.
- Las cancelaciones con menos de 24 horas consumen el crédito correspondiente.
- Un profesor no puede impartir más de 4 horas consecutivas sin descanso.
- El descanso mínimo inicial es de 30 minutos.
- Un profesor no puede impartir más de 8 horas prácticas al día.

Estas reglas pueden evolucionar durante el desarrollo.

---

## 📚 Formación teórica

Forma parte del alcance definitivo:

- Temario.
- Clases teóricas.
- Material educativo.
- Documentación descargable.
- Vídeos.
- Banco de preguntas.
- Tests.
- Simulacros.
- Resultados.
- Estadísticas.
- Seguimiento del aprendizaje.
- Análisis de errores.
- Evolución del alumno.

**Estado actual:** 📋 Planificado.

---

## 📝 Exámenes

El sistema contempla:

- Examen teórico.
- Examen práctico.
- Convocatorias.
- Solicitudes.
- Resultados.
- Documentación.
- Tasas.
- Psicotécnico.
- Gestión de suspensos.
- Clases de refuerzo.
- Seguimiento de la tramitación.

### Reglas principales

- El alumno debe tener la documentación obligatoria validada.
- Debe cumplir los requisitos administrativos.
- No debe tener pagos pendientes bloqueantes.
- Debe disponer de psicotécnico válido.
- Tras dos suspensos prácticos consecutivos se requieren al menos 5 clases de refuerzo antes de solicitar una nueva convocatoria.

---

## 💳 Pagos y facturación

Forma parte del alcance definitivo:

- Matrículas.
- Renovaciones.
- Bonos.
- Paquetes de clases.
- Promociones.
- Pagos.
- Facturas.
- Impagos.
- Tasas.
- Pagos mediante tarjeta.
- Stripe.
- PayPal.

### Estado actual

📋 **Planificado — los pagos todavía no están implementados.**

Los bonos y paquetes deberán disponer de fecha de caducidad. La duración inicial será configurable, con opciones de 6 o 12 meses.

---

## 📊 Dashboard y estadísticas

Se contempla un sistema de dashboards para consultar información como:

- Alumnos.
- Profesores.
- Clases.
- Exámenes.
- Vehículos.
- Rendimiento académico.
- Aprobados y suspensos.
- Evolución temporal.
- Actividad de la autoescuela.
- Información económica.
- Packs y bonos.
- Indicadores de gestión.

El proyecto ya contiene un módulo de dashboard en el backend y una estructura de frontend preparada para evolucionar esta funcionalidad.

---

## 🔔 Comunicación y soporte

El alcance definitivo incluye:

- Notificaciones.
- Anuncios.
- Gestión de incidencias.
- Tickets de soporte.
- FAQ.
- Base de conocimiento.
- Recuperación de acceso.
- Gestión de bloqueos.
- Monitorización básica.

**Estado actual:** 📋 Planificado o pendiente de ampliación según funcionalidad.

---

# 📈 Estado actual del proyecto

El proyecto se encuentra en una fase de desarrollo progresivo.

| Área                        | Estado                         |
| --------------------------- | ------------------------------ |
| Arquitectura general        | 🟢 Iniciada                    |
| Backend modular             | 🟢 Implementado                |
| Alumnos                     | 🟢 Implementado                |
| Profesores                  | 🟢 Implementado                |
| Clases prácticas            | 🟢 Implementado / en evolución |
| Vehículos                   | 🟢 Implementado / en evolución |
| Exámenes                    | 🟢 Implementado / en evolución |
| Dashboard                   | 🚧 En desarrollo               |
| Autenticación/autorización  | 🚧 En desarrollo               |
| Frontend                    | 🚧 En desarrollo               |
| Formación teórica           | 📋 Planificado                 |
| Vídeos y material educativo | 📋 Planificado                 |
| Tests teóricos              | 📋 Planificado                 |
| Pagos                       | 📋 Planificado                 |
| Stripe                      | 📋 Planificado                 |
| PayPal                      | 📋 Planificado                 |
| Facturación                 | 📋 Planificado                 |
| Impagos                     | 📋 Planificado                 |
| Administrativo              | 📋 Planificado                 |
| Soporte                     | 📋 Planificado                 |
| Multi-autoescuela           | 📋 Evolución futura            |

> Esta tabla deberá actualizarse a medida que avance el desarrollo.

---

# 🏗️ Arquitectura

El proyecto está dividido principalmente en:

```text
Autoescuela EGUZKILORE
│
├── Backend
│   └── API REST
│
├── Frontend
│   └── Aplicación web
│
├── PostgreSQL
│   └── Persistencia de datos
│
└── Prisma
    └── ORM y gestión del esquema
```

## Arquitectura backend

El backend utiliza una organización modular por funcionalidades:

```text
features/
├── alumnos/
├── auth/
├── clases/
├── dashboard/
├── examenes/
├── profesores/
└── vehiculos/
```

Cada funcionalidad separa responsabilidades mediante:

```text
Routes
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

### Responsabilidad de cada capa

**Routes**

Define los endpoints y conecta las peticiones HTTP con los controllers.

**Controller**

Gestiona la entrada/salida HTTP y coordina la operación solicitada.

**Service**

Contiene la lógica de negocio de la funcionalidad.

**Repository**

Gestiona el acceso a los datos.

**Prisma**

Actúa como ORM entre la aplicación y PostgreSQL.

---

# 📁 Estructura del proyecto

La estructura principal del proyecto es:

```text
Autoescuela/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   └── src/
│       ├── app.js
│       ├── server.js
│       │
│       ├── config/
│       │   ├── prisma.js
│       │   └── swagger.js
│       │
│       ├── features/
│       │   ├── alumnos/
│       │   ├── auth/
│       │   ├── clases/
│       │   ├── dashboard/
│       │   ├── examenes/
│       │   ├── profesores/
│       │   └── vehiculos/
│       │
│       └── shared/
│           ├── errors/
│           ├── middleware/
│           └── utils/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── theme/
│       └── utils/
│
├── BUSINESS_RULES.md
├── DOMAIN_MODEL.md
├── FUNCTIONAL_SPECIFICATION.md
├── docker-compose.yml
└── README.md
```

> La estructura podrá ampliarse a medida que se incorporen nuevas funcionalidades.

---

# 🛠️ Stack tecnológico

## Backend

- **Node.js**
- **Express 5**
- **Prisma 6**
- **PostgreSQL**
- **JWT**
- **bcryptjs**
- **CORS**
- **dotenv**
- **Swagger / OpenAPI**
- **Vitest**
- **Supertest**
- **Nodemon**

## Frontend

- **React 19**
- **Vite**
- **React Router**
- **Material UI**
- **Emotion**
- **Axios**
- **React Hook Form**
- **React Icons**
- **Recharts**
- **ESLint**

## Infraestructura

- **Docker**
- **Docker Compose**
- **PostgreSQL 16**

---

# 🔙 Backend

El backend proporciona la API de la aplicación.

## Features actuales

```text
alumnos
auth
clases
dashboard
examenes
profesores
vehiculos
```

## Configuración

```text
backend/src/config/
├── prisma.js
└── swagger.js
```

## Punto de entrada

El servidor utiliza:

```text
backend/src/server.js
```

y la aplicación:

```text
backend/src/app.js
```

## Scripts

Desde `backend/`:

```bash
# Desarrollo
npm run dev

# Producción / ejecución normal
npm start

# Generar Prisma Client
npm run prisma:generate

# Crear/aplicar migraciones en desarrollo
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Ejecutar tests
npm test
```

---

# 🖥️ Frontend

El frontend está construido con React y Vite.

La aplicación está organizada mediante:

```text
components/
context/
hooks/
layouts/
pages/
routes/
services/
theme/
utils/
```

Entre las áreas de la interfaz actualmente contempladas se encuentran:

- Login.
- Dashboard.
- Alumnos.
- Clases.
- Exámenes.
- Profesores.
- Vehículos.

El diseño visual objetivo es:

### 🎨 Dark Mode + Glassmorphism

Con una interfaz:

- moderna;
- elegante;
- tecnológica;
- corporativa;
- intuitiva;
- responsive;
- orientada tanto a estudiantes como a usuarios internos de la autoescuela.

---

# 🗄️ Base de datos

La persistencia se realiza mediante:

```text
PostgreSQL
    +
Prisma ORM
```

## Modelos actuales

El esquema actual contempla:

```text
Usuario
Profesor
Alumno
Vehiculo
ClasePractica
Examen
Rol
```

## Roles actualmente definidos en Prisma

```text
ADMIN
PROFESOR
ALUMNO
```

Los roles `ADMINISTRATIVO` y `SOPORTE` forman parte del modelo funcional objetivo y se incorporarán posteriormente.

## Migraciones

Las modificaciones del esquema deben gestionarse mediante migraciones de Prisma.

Comandos principales:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

---

# 📐 Reglas de negocio

Las reglas oficiales del negocio se encuentran en:

**`BUSINESS_RULES.md`**

Entre las principales:

### Alumnos

- Edad mínima para acceso teórico: 17 años y 9 meses.
- Permiso B: mínimo 18 años para prácticas.
- El estado teórico debe estar aprobado para acceder a la fase práctica.
- El estado teórico puede caducar después de 2 años desde la aprobación oficial.

### Clases

- Antelación mínima de 24 horas.
- Máximo de 3 reservas futuras simultáneas.
- No puede existir solapamiento de alumno, profesor o vehículo.
- Cancelación con más de 24 horas: sin penalización.
- Cancelación con menos de 24 horas: consume el crédito.

### Profesores

- Máximo de 4 horas consecutivas sin descanso.
- Descanso mínimo inicial: 30 minutos.
- Máximo de 8 horas prácticas diarias.

### Vehículos

Los vehículos en:

- Mantenimiento.
- Taller.
- Inactivo.

no podrán asignarse a nuevas clases.

### Exámenes

Se contemplan requisitos de:

- documentación;
- pagos;
- psicotécnico;
- convocatorias;
- clases de refuerzo tras dos suspensos prácticos consecutivos.

---

# 🔐 Autenticación y autorización

El backend utiliza:

- JWT para autenticación.
- bcryptjs para gestión de contraseñas.
- Middleware de autenticación.
- Middleware de control de roles.

### Primer acceso y cambio obligatorio de contraseña

El sistema implementa un flujo de primer login para todos los usuarios creados con contraseña inicial:

- el usuario se crea con `requiereCambioPassword = true`
- al autenticarse, el backend devuelve `token` y `requiereCambioPassword`
- si ese indicador está activo, el frontend redirige a una pantalla obligatoria de cambio de contraseña
- durante ese estado, el backend solo permite el endpoint de cambio de contraseña de primer acceso
- al completar el cambio, se actualiza `passwordHash` y `requiereCambioPassword = false`
- desde ese momento, los siguientes logins se realizan con la nueva contraseña

El objetivo es aplicar:

### Control por roles

Las funcionalidades estarán protegidas mediante permisos asociados a roles.

### Principio de mínimo privilegio

Cada usuario deberá acceder únicamente a la información necesaria para sus funciones.

### Auditoría

Las modificaciones críticas deberán registrarse.

Entre ellas:

- Pagos.
- Estados de alumnos.
- Reservas.
- Exámenes.
- Usuarios.

---

# 🧪 Testing

El backend utiliza:

- **Vitest**
- **Supertest**

La estructura de tests sigue la separación de responsabilidades del backend.

Ejemplo:

```text
alumnos/
└── __tests__/
    ├── alumnos.controller.test.js
    ├── alumnos.repository.test.js
    ├── alumnos.routes.test.js
    └── alumnos.service.test.js
```

También existen pruebas relacionadas con middleware de autenticación y roles.

## Ejecutar tests

Desde `backend/`:

```bash
npm test
```

El objetivo es mantener pruebas asociadas a las distintas capas de cada feature.

---

# 🐳 Docker

El proyecto dispone de `docker-compose.yml`.

Actualmente se contempla:

```text
Docker Compose
│
├── PostgreSQL 16
│   └── puerto 5432
│
└── Backend
    └── puerto 5000
```

Para levantar los servicios:

```bash
docker compose up
```

Para ejecutarlos en segundo plano:

```bash
docker compose up -d
```

Para detenerlos:

```bash
docker compose down
```

> La configuración de Docker deberá evolucionar junto con el proyecto y, especialmente, con la gestión de secretos y variables de entorno.

---

# 🔐 Configuración

El backend utiliza variables de entorno para la configuración.

Entre ellas se encuentran:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Recomendación

No deben almacenarse secretos reales en el repositorio.

Se recomienda mantener:

```text
.env
```

fuera del control de versiones y proporcionar un archivo:

```text
.env.example
```

con las variables necesarias pero sin valores sensibles.

---

# 🚀 Instalación y puesta en marcha

## Requisitos previos

Se requiere disponer de:

- Node.js.
- npm.
- Docker y Docker Compose si se utiliza el entorno Docker.
- PostgreSQL si se ejecuta sin Docker.

---

## 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd Autoescuela
```

---

## 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

---

## 3. Configurar variables de entorno

Crear el archivo:

```text
backend/.env
```

con las variables necesarias, por ejemplo:

```env
PORT=5000
DATABASE_URL=<URL_DE_POSTGRESQL>
JWT_SECRET=<SECRET_SEGURO>
```

---

## 4. Generar Prisma Client

```bash
npm run prisma:generate
```

---

## 5. Ejecutar migraciones

```bash
npm run prisma:migrate
```

---

## 6. Arrancar backend

```bash
npm run dev
```

El backend utiliza el puerto configurado en `PORT` y, en el entorno actual, está preparado para trabajar con el puerto `5000`.

---

## 7. Instalar dependencias del frontend

Desde otra terminal:

```bash
cd frontend
npm install
```

---

## 8. Arrancar frontend

```bash
npm run dev
```

Vite proporcionará la URL local del frontend.

---

# 📚 Documentación del proyecto

El proyecto mantiene documentación separada según su responsabilidad.

## `README.md`

Documento principal del proyecto.

Explica:

- qué es el proyecto;
- arquitectura;
- tecnologías;
- instalación;
- ejecución;
- estado;
- roadmap.

## `BUSINESS_RULES.md`

Contiene las reglas oficiales del negocio:

- restricciones;
- validaciones;
- comportamientos;
- condiciones de las operaciones.

## `DOMAIN_MODEL.md`

Define:

- entidades;
- relaciones;
- estados;
- responsabilidades;
- bounded contexts.

## `FUNCTIONAL_SPECIFICATION.md`

Describe las funcionalidades agrupadas por actor:

- Administrador.
- Profesor.
- Alumno.
- Administrativo.
- Soporte.

---

# 🗺️ Roadmap

## Fase 1 — Núcleo de gestión

- [x] Estructura inicial del backend.
- [x] Arquitectura modular.
- [x] Gestión de alumnos.
- [x] Gestión de profesores.
- [x] Gestión de vehículos.
- [x] Gestión de clases prácticas.
- [x] Gestión inicial de exámenes.
- [x] Prisma + PostgreSQL.
- [x] Base de testing.
- [x] Estructura inicial del frontend.

## Fase 2 — Consolidación backend/frontend

- [ ] Completar autenticación y autorización.
- [ ] Completar control de roles.
- [ ] Completar dashboard.
- [ ] Completar integración frontend/backend.
- [ ] Ampliar validaciones.
- [ ] Consolidar reglas de negocio.
- [ ] Mejorar cobertura de tests.

## Fase 3 — Formación teórica

- [ ] Temario.
- [ ] Material educativo.
- [ ] Vídeos.
- [ ] Banco de preguntas.
- [ ] Tests.
- [ ] Simulacros.
- [ ] Estadísticas.
- [ ] Seguimiento académico.

## Fase 4 — Gestión administrativa

- [ ] Rol Administrativo.
- [ ] Matrículas.
- [ ] Documentación.
- [ ] Gestión administrativa.
- [ ] Tramitaciones.
- [ ] Gestión avanzada de profesores.
- [ ] Gestión avanzada de vehículos.

## Fase 5 — Gestión económica

- [ ] Bonos.
- [ ] Paquetes.
- [ ] Promociones.
- [ ] Pagos.
- [ ] Facturas.
- [ ] Impagos.
- [ ] Tasas.
- [ ] Stripe.
- [ ] PayPal.
- [ ] Pago mediante tarjeta.

## Fase 6 — Soporte y comunicación

- [ ] Rol Soporte.
- [ ] Tickets.
- [ ] Incidencias.
- [ ] FAQ.
- [ ] Base de conocimiento.
- [ ] Notificaciones.
- [ ] Anuncios.
- [ ] Monitorización.

## Fase 7 — Evolución futura

- [ ] Auditoría avanzada.
- [ ] Sistema avanzado de permisos.
- [ ] Mejoras de analítica.
- [ ] Arquitectura multi-autoescuela.
- [ ] Gestión de múltiples centros.

---

# 🔒 Seguridad

La seguridad es una preocupación transversal del proyecto.

Principios establecidos:

- Autenticación mediante JWT.
- Contraseñas almacenadas mediante hash.
- Autorización mediante roles.
- Principio de mínimo privilegio.
- Variables sensibles mediante configuración de entorno.
- Auditoría de operaciones críticas.
- Validación de operaciones según reglas de negocio.

Los secretos y credenciales reales **no deben almacenarse en Git**.

---

# 🤝 Contribución

El proyecto se encuentra actualmente en desarrollo.

Antes de realizar cambios importantes se recomienda:

1. Revisar la documentación funcional.
2. Revisar las reglas de negocio.
3. Revisar el modelo de dominio.
4. Identificar la feature afectada.
5. Mantener la separación `routes → controller → service → repository`.
6. Añadir o actualizar tests.
7. Comprobar que las migraciones de Prisma sean coherentes.
8. Verificar frontend y backend cuando el cambio afecte a ambos.

---

# 📄 Licencia

Actualmente el proyecto utiliza la licencia indicada en `backend/package.json`:

```text
ISC
```

La licencia definitiva del proyecto deberá establecerse cuando se defina la estrategia de distribución del software.

---

# 🚧 Nota sobre el estado del README

Este documento representa el estado conocido del proyecto en **agosto de 2026**.

Autoescuela EGUZKILORE continúa en desarrollo. Las funcionalidades, reglas de negocio, entidades, roles, arquitectura y roadmap podrán evolucionar.

El README deberá actualizarse cuando una funcionalidad pase por los estados:

```text
📋 Planificado
      ↓
🚧 En desarrollo
      ↓
🟢 Implementado
```

La documentación funcional y las reglas de negocio deberán evolucionar conjuntamente con la implementación.

Configuracion del frontend React + Vite para trabajar en development, staging y production sin cambiar codigo.

## Variables de entorno

El cliente usa estas variables:

- VITE_API_BASE_URL: base de la API para llamadas Axios.
- VITE_DEV_PROXY_TARGET: destino del proxy de Vite cuando VITE_API_BASE_URL es relativa (/api).

Archivos incluidos:

- .env.development
- .env.staging
- .env.production
- .env.example

## Scripts plug-and-play

Desarrollo:

- npm run dev
- npm run dev:staging
- npm run dev:production

Build:

- npm run build
- npm run build:staging
- npm run build:production

Preview:

- npm run preview
- npm run preview:staging

## Flujo recomendado

1. Development local:
   usar .env.development (VITE_API_BASE_URL=/api) y proxy al backend local.
2. Staging:
   usar .env.staging con dominio de API de preproduccion.
3. Produccion:
   usar .env.production con dominio de API productivo.

---

# Actualizacion agosto 2026

## Cambios implementados recientemente

- autenticacion frontend reforzada con envio de cabecera `Authorization: Bearer <token>` en llamadas protegidas
- flujo de primer acceso con cambio obligatorio de contrasena para usuarios nuevos
- profesores con permisos multiples para imparticion (`B`, `A1`, `A2`, `A`, `C`, `D`, `E`)
- edicion de profesor con actualizacion consistente entre datos de usuario y profesor
- en edicion de alumno, si la contrasena se deja vacia, se conserva la actual
- mensajes visuales en modales de edicion para dejar explicito que no se cambia la contrasena al dejarla vacia
- gestión real de imagen en vehículos: alta opcional, edición con cambio o eliminación, y soporte para mantener el vehículo sin imagen
- borrado físico de imagen al eliminar la foto en edición, junto con actualización de `imagenRuta = null` en base de datos
- refresco inmediato del detalle del vehículo tras guardar cambios para que la vista muestre el estado actualizado al instante
- interfaz de edición reestructurada con layout tipo detalle: campos a la izquierda y bloque de imagen a la derecha
- validación del caso de edición sin imagen y nueva subida para prevenir regresiones

## Ruta real de almacenamiento de imágenes de vehículos

Los archivos físicos se guardan en:

- `backend/uploads/vehiculos`

La referencia que se persiste en base de datos es:

- `/api/uploads/vehiculos/<nombre-archivo>`

La API de Express sirve esos archivos desde el backend, por lo que la imagen se puede mostrar en frontend sin guardar el fichero en el repositorio como parte del código fuente.

## Decisiones funcionales aprobadas para vehiculos

- imagen de vehiculo opcional en alta
- en edicion se podra anadir/cambiar imagen o mantener el vehiculo sin imagen
- los archivos se guardan en una carpeta del backend (`backend/uploads/vehiculos`)
- en base de datos se guarda solo la referencia de imagen (`imagenRuta`)
- restricciones de subida de imagen: maximo `5 MB`, formatos `png`, `jpg/jpeg`, `webp`
- se implementa una vista de detalle desde el listado para mostrar datos completos e imagen en tamano mayor
- la edición incluye un bloque visual de imagen a la derecha y un botón de eliminación real de la foto actual
- cuando se elimina una imagen, se borra el fichero físico y el valor en la base de datos
