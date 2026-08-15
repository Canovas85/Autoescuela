# 🚗 AutoDrive Admin Backend

Backend desarrollado como Proyecto Fin de Máster para la gestión integral de una autoescuela.

---

# 📋 Descripción

AutoDrive Admin Backend es una API REST construida con Node.js, Express, Prisma y PostgreSQL para gestionar:

- Alumnos
- Profesores
- Vehículos
- Clases prácticas
- Exámenes
- Dashboard ejecutivo
- Autenticación JWT
- Control de roles
- Documentación Swagger/OpenAPI

---

# 🏗️ Arquitectura

```text
Client
│
▼
Express API
│
▼
Controllers
│
▼
Services
│
▼
Repositories
│
▼
Prisma ORM
│
▼
PostgreSQL
```

---

# 🛠️ Tecnologías

## Backend

- Node.js
- Express
- JavaScript ES Modules

## Base de Datos

- PostgreSQL
- Prisma ORM

## Autenticación

- JWT
- bcryptjs

## Testing

- Vitest

## Documentación

- Swagger UI
- OpenAPI 3.0

## Contenedores

- Docker
- Docker Compose

---

# ✅ Funcionalidades Implementadas

## Autenticación

- Login JWT
- Validación de tokens
- Middleware de autenticación
- Middleware de autorización por rol

## Alumnos

- Crear alumno
- Obtener alumnos
- Obtener alumno por ID
- Actualizar alumno
- Desactivar alumno

## Profesores

- Crear profesor
- Obtener profesores
- Actualizar profesor
- Desactivar profesor

## Vehículos

- Crear vehículo
- Obtener vehículos
- Actualizar vehículo
- Desactivar vehículo

## Clases

- Crear clase
- Consultar clases
- Modificar clases
- Cancelar clases

## Exámenes

- Crear examen
- Consultar examen
- Actualizar examen
- Registrar resultado

## Dashboard

### Dashboard Básico

- KPIs generales

### Dashboard Avanzado

- Ratios
- Métricas por periodo
- Profesores destacados

### Dashboard Ejecutivo

- Tasa de éxito
- Tasa mensual
- Exámenes pendientes
- Clases programadas
- Profesor con más clases
- Profesor con más horas

---

# 🔐 Roles

## ADMIN

Acceso completo al sistema:

```text
Alumnos
Profesores
Vehículos
Clases
Exámenes
Dashboard
```

---

# 📚 Swagger

La documentación interactiva está disponible en:

```text
http://localhost:5000/api-docs
```

Permite:

- Visualizar endpoints
- Ejecutar peticiones
- Autenticarse mediante JWT
- Probar rutas protegidas

---

# 🗄️ Base de Datos

Motor utilizado:

```text
PostgreSQL 16
```

ORM:

```text
Prisma
```

---

# 🐳 Docker

El proyecto está dockerizado.

## Construcción

````Siempre hay que tener abierto: Docker Desktop
``` Desde: C:\Users\cano0\Desktop\Sergio_proyecto_master\Autoescuela\backend

```bash
docker compose build
````

## Arranque

```bash
docker compose up
```

## Parada

```bash
docker compose down
```

---

# ⚙️ Variables de Entorno

Ejemplo:

```env
PORT=5000

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/autodrive_db

JWT_SECRET=Autoescuela2026JWTScecret
```

---

# 🚀 Ejecución Local

Instalar dependencias:

```bash
npm install
```

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones:

```bash
npx prisma migrate deploy
```

Iniciar servidor:

```bash
npm run dev
```

---

# 🧪 Testing

Ejecutar todos los tests:

```bash
npx vitest run
```

Modo watch:

```bash
npx vitest
```

---

# 📦 Estructura del Proyecto

```text
backend/
│
├── src/
│ ├── config/
│ ├── features/
│ │ ├── auth/
│ │ ├── alumnos/
│ │ ├── profesores/
│ │ ├── vehiculos/
│ │ ├── clases/
│ │ ├── examenes/
│ │ └── dashboard/
│ │
│ └── shared/
│
├── prisma/
│
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md
```

---

# 📌 Estado del Proyecto

## Completado

- Autenticación JWT
- Autorización por Roles
- CRUD Alumnos
- CRUD Profesores
- CRUD Vehículos
- CRUD Clases
- CRUD Exámenes
- Dashboard Básico
- Dashboard Avanzado
- Dashboard Ejecutivo
- Swagger/OpenAPI
- Prisma ORM
- PostgreSQL
- Docker
- Docker Compose
- Testing

---

# 🎓 Proyecto Fin de Máster

Proyecto realizado como trabajo final del Máster de Desarrollo de Aplicaciones con Arquitectura Backend Moderna.

Autor:

**Sergio Cano Cabezas**
