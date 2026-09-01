# GitHub Copilot Instructions — Autoescuela EGUZKILORE

## Contexto del proyecto

Autoescuela EGUZKILORE es una aplicación web para la gestión integral de una autoescuela.

Estado actual:

- Proyecto en desarrollo.
- Actualmente orientado a una única autoescuela.
- Posible evolución futura a plataforma multi-autoescuela.

## Stack tecnológico

Backend:

- Node.js
- Express
- JavaScript ES Modules

Persistencia:

- PostgreSQL
- Prisma ORM

Frontend:

- React
- Vite
- Material UI
- Axios

Testing:

- Vitest
- Supertest

Contenedores:

- Docker

## Arquitectura general

Backend organizado principalmente como:

routes → controller → service → repository

Frontend organizado por funcionalidades:

pages/
services/
components/
routes/
utils/

## Principios generales

Antes de realizar cambios:

- Comprender la implementación existente.
- Revisar primero el código actual.
- Reutilizar componentes, servicios y utilidades existentes.
- Aplicar siempre el cambio mínimo necesario.
- No crear duplicidades.
- No realizar refactors no solicitados.
- No modificar archivos no relacionados con la tarea.

La implementación existente tiene prioridad sobre ejemplos genéricos.

## Control de alcance

- No modificar arquitectura sin una razón técnica clara.
- No cambiar contratos API existentes sin indicarlo.
- No eliminar funcionalidades para resolver otra tarea.
- No instalar nuevas dependencias sin autorización.
- No introducir cambios preventivos o especulativos.

## Documentación funcional

Consultar únicamente cuando sea necesario:

- BUSINESS_RULES.md
- DOMAIN_MODEL.md
- FUNCTIONAL_SPECIFICATION.md
- BR_TRACEABILITY_INDEX.md

No cargar documentación innecesaria.

Si existe una discrepancia entre documentación y código:

- Identificarla.
- Explicarla.
- No modificar comportamiento silenciosamente.

## Seguridad

- No incluir secretos ni credenciales.
- No exponer datos sensibles.
- Mantener autenticación y autorización existentes.
- No desactivar validaciones ni middleware de seguridad.

## Git

No realizar:

- commits
- push
- merge
- rebase

salvo petición explícita.

## Eficiencia de contexto

Para reducir consumo de contexto:

- Analizar únicamente los archivos relacionados con la tarea.
- No explorar todo el workspace innecesariamente.
- Ampliar contexto solo cuando sea necesario.
- Mantener las respuestas concisas cuando la tarea sea simple.

## Prioridad de decisiones

1. Solicitud explícita del usuario.
2. Reglas de este archivo.
3. Instrucciones específicas (\*.instructions.md).
4. Código existente.
5. Documentación funcional relevante.
6. Convenciones generales de desarrollo.

No inventar requisitos no solicitados.
