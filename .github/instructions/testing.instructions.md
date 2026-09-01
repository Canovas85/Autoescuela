# Testing Instructions

Estas instrucciones aplican a todos los tests.

## Framework

Utilizar:

Vitest

## Estructura

Mantener tests separados por capa:

- routes
- controller
- service
- repository

## Repository Tests

Mockear Prisma.

Nunca utilizar base de datos real.

## Service Tests

Validar:

- reglas de negocio
- validaciones
- transformaciones
- errores

## Controller Tests

Validar:

- status HTTP
- json
- llamadas al servicio

## Route Tests

Utilizar:

Supertest

## Mocking

Utilizar:

vi.fn()

como patrón principal.

## Cobertura mínima

Toda nueva funcionalidad debe incluir:

- test feliz
- test error
- validación principal

## Regla importante

No modificar tests únicamente para que pasen.

Corregir primero el código.
