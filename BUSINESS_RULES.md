# BUSINESS_RULES.md

## Objetivo

Este documento contiene las reglas de negocio oficiales del sistema de gestión de autoescuela.

Las reglas aquí descritas representan restricciones, validaciones y comportamientos obligatorios del negocio. Cualquier implementación técnica deberá respetar estas reglas.

---

# 1. Gestión de Alumnos

## BR-ALU-001 - Edad mínima para acceso teórico

Un alumno puede registrarse y acceder a la formación teórica a partir de los 17 años y 9 meses.

---

## BR-ALU-002 - Restricción para clases prácticas

Un alumno no podrá reservar clases prácticas mientras no cumpla la edad legal requerida para el permiso correspondiente.

Inicialmente se establece:

- Permiso B: mínimo 18 años.

---

## BR-ALU-003 - Bloqueo por teórico pendiente

Un alumno no puede reservar clases prácticas si su estado teórico no es "Aprobado".

Estados permitidos:

- Pendiente
- Aprobado
- Caducado

---

## BR-ALU-004 - Validación manual del estado teórico

El estado teórico del alumno únicamente puede ser modificado por un Administrador autorizado.

---

## BR-ALU-005 - Caducidad del teórico

Una vez aprobado el examen teórico oficial, el alumno dispone de un máximo de 2 años para aprobar el examen práctico.

Si supera dicho periodo:

- El estado teórico pasará automáticamente a "Caducado".
- El alumno perderá la habilitación para solicitar examen práctico.
- El alumno no podrá reservar nuevas clases prácticas.

---

# 2. Reserva de Clases Prácticas

## BR-CLA-001 - Existencia de recursos

Para crear una clase práctica debe existir:

- Un alumno válido.
- Un profesor válido.
- Un vehículo válido.

---

## BR-CLA-002 - Disponibilidad obligatoria

No podrá crearse una reserva si:

- El profesor ya tiene una clase en la misma franja horaria.
- El vehículo ya está asignado en la misma franja horaria.
- El alumno ya tiene una clase en la misma franja horaria.

---

## BR-CLA-003 - Reserva mínima anticipada

Las clases prácticas deberán reservarse con al menos 24 horas de antelación.

---

## BR-CLA-004 - Límite de reservas futuras

Un alumno no podrá tener más de 3 clases prácticas futuras reservadas simultáneamente.

---

## BR-CLA-005 - Validación de saldo

Un alumno no podrá reservar una clase práctica si:

- No dispone de créditos.
- No dispone de un bono activo.
- No dispone de una modalidad de pago autorizada.

---

## BR-CLA-006 - Cancelación sin coste

Una reserva podrá cancelarse sin penalización si se realiza con más de 24 horas de antelación.

---

## BR-CLA-007 - Penalización por cancelación tardía

Las cancelaciones realizadas con menos de 24 horas de antelación consumirán igualmente el crédito correspondiente.

---

# 3. Gestión de Profesores

## BR-PRO-001 - Descanso obligatorio

Un profesor no podrá impartir más de 4 horas consecutivas sin descanso.

---

## BR-PRO-002 - Descanso mínimo

Tras 4 horas consecutivas de clases deberá existir un descanso mínimo configurable:

- Valor inicial: 30 minutos.

---

## BR-PRO-003 - Máximo diario

Un profesor no podrá impartir más de 8 horas prácticas al día.

---

# 4. Gestión de Vehículos

## BR-VEH-001 - Vehículo fuera de servicio

Un vehículo en estado:

- Mantenimiento
- Taller
- Inactivo

no podrá asignarse a nuevas clases.

---

## BR-VEH-002 - Cancelación automática

Cuando un vehículo pase a estado "Mantenimiento" o "Taller":

- Las clases futuras deberán ser revisadas.
- El sistema intentará reasignar vehículo compatible.
- Si no existe vehículo alternativo, la clase quedará pendiente de reprogramación.

---

# 5. Pagos y Facturación

## BR-PAG-001 - Bonos con fecha de expiración

Todo bono o paquete tendrá una fecha de caducidad.

Duración inicial configurable:

- 6 meses
- 12 meses

---

## BR-PAG-002 - Créditos caducados

Los créditos asociados a un bono caducado no podrán utilizarse.

---

## BR-PAG-003 - Tasas no reembolsables

Las tasas oficiales gestionadas ante organismos públicos no admitirán devolución una vez iniciado el trámite.

---

## BR-PAG-004 - Modificación de importe

Solamente un Administrador podrá modificar el importe de un pago registrado.

---

# 6. Exámenes

## BR-EXA-001 - Solicitud de examen

Un alumno únicamente podrá solicitar examen si:

- Tiene la documentación obligatoria validada.
- Cumple los requisitos administrativos.
- No tiene pagos pendientes bloqueantes.

---

## BR-EXA-002 - Doble suspenso práctico

Si un alumno acumula dos suspensos prácticos consecutivos:

- Deberá realizar un mínimo de 5 clases de refuerzo.
- No podrá solicitar nueva convocatoria hasta completar dicho requisito.

---

## BR-EXA-003 - Psicotécnico obligatorio

Un alumno no podrá presentarse a examen si:

- No dispone de psicotécnico.
- El psicotécnico está caducado.

---

# 7. Seguridad y Permisos

## BR-SEC-001 - Control por roles

Todo acceso a funcionalidades deberá estar protegido mediante permisos asociados a roles.

---

## BR-SEC-002 - Principio de mínimo privilegio

Un usuario únicamente podrá acceder a la información necesaria para desempeñar sus funciones.

---

## BR-SEC-003 - Auditoría

Toda modificación de información crítica deberá registrarse en un sistema de auditoría.

Ejemplos:

- Pagos
- Estados de alumnos
- Reservas
- Exámenes
- Usuarios

---

# 8. Reglas Pendientes de Definición

Este apartado almacenará reglas identificadas durante reuniones futuras.

Estado inicial: Sin definir.
