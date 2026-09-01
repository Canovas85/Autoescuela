# Database Instructions

Estas instrucciones se aplican únicamente a Prisma y PostgreSQL.

## Base de datos

Motor oficial:

PostgreSQL

## ORM

Utilizar Prisma.

No escribir acceso directo SQL salvo necesidad justificada.

## Cambios de modelo

Antes de modificar:

schema.prisma

explicar:

- Qué cambia.
- Por qué cambia.
- Qué entidades afecta.

## Migraciones

No modificar migraciones históricas.

Crear siempre nuevas migraciones.

## Relaciones

Revisar relaciones existentes antes de añadir:

- foreign keys
- includes
- nuevas entidades

## Convenciones

Mantener:

- UUID como identificador
- @@map()
- @relation()
- índices actuales

## Datos

No eliminar datos existentes para resolver tareas.

## Soft Delete

Priorizar:

activo boolean

sobre eliminación física.

## Dominio

Entidades principales:

- Usuario
- Alumno
- Profesor
- Vehiculo
- Promocion
- Bono
- Temario
- ClasePractica
- Examen
- SolicitudExamen
