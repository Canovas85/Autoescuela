# Backend Instructions

Estas instrucciones solo aplican cuando se modifica código backend.

## Arquitectura obligatoria

Mantener siempre:

routes → controller → service → repository

No saltarse capas.

## Routes

Responsabilidades permitidas:

- Definir endpoints.
- Registrar middleware.
- Configurar autenticación.
- Configurar autorización.
- Instanciar repository, service y controller.
- Mantener documentación Swagger existente.

No incluir:

- Lógica de negocio.
- Acceso a Prisma.
- Validaciones funcionales.

## Controllers

Responsabilidades permitidas:

- Leer req.params, req.body y req.query.
- Invocar servicios.
- Gestionar códigos HTTP.
- Construir respuestas JSON.

No incluir:

- Lógica de negocio compleja.
- Consultas Prisma.
- Reglas funcionales.

## Services

Lugar principal para:

- Validaciones.
- Reglas de negocio.
- Normalización de datos.
- Cálculos.
- Coordinación entre repositorios.
- Hash de contraseñas.
- Procesos de activación de cuenta.

Las validaciones deben implementarse aquí.

## Repositories

Responsabilidades:

- Acceso a Prisma.
- Consultas.
- Includes.
- Operaciones CRUD.

No implementar:

- Validaciones funcionales.
- Reglas de negocio.

## Prisma

- Prisma solo desde repository.
- Inyectar Prisma mediante constructor.
- Mantener compatibilidad PostgreSQL.
- No modificar schema.prisma sin explicarlo.

## Seguridad

Mantener:

authenticate(...)
authorize(...)

en las rutas protegidas.

## Soft Delete

Siempre priorizar:

activo = true
activo = false

antes que eliminaciones físicas.

## Código

Mantener:

- ES Modules.
- class NombreRepository
- class NombreService
- class NombreController

No cambiar patrones existentes.
