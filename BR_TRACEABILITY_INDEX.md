# Indice cruzado de reglas de negocio (BR)

## Estado de trazabilidad (2026-11-06)

Este indice relaciona reglas funcionales documentadas con evidencia tecnica real:

- backend (routes, service, repository)
- frontend (rutas, vistas, menus, servicios)
- modelo Prisma

Estados de trazabilidad:

- `IMPLEMENTADA`: existe evidencia de ejecucion en codigo
- `PARCIAL`: existe soporte pero no en todos los flujos esperados
- `PENDIENTE`: documentada sin implementacion completa activa

---

## Referencias base

- `BUSINESS_RULES.md`
- `DOMAIN_MODEL.md`
- `FUNCTIONAL_SPECIFICATION.md`
- `ESTADOS_EXPEDIENTE.md`

---

## 1) Autenticacion y usuarios (BR-AUTH)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-AUTH-001 Email unico | IMPLEMENTADA | Prisma `Usuario.email @unique` |
| BR-AUTH-002 Password obligatoria | IMPLEMENTADA | `auth.service` + modelo `passwordHash` |
| BR-AUTH-003 Primer acceso con cambio obligatorio | IMPLEMENTADA | `Usuario.requiereCambioPassword`, `auth.middleware` |
| BR-AUTH-004 JWT obligatorio en rutas protegidas | IMPLEMENTADA | `authenticate` en rutas de modulos |
| BR-AUTH-005 Control por rol | IMPLEMENTADA | `authorize(...roles)` y menu frontend por rol |
| BR-AUTH-006 Activacion de cuenta por token | IMPLEMENTADA | modulo `auth` + `ActivacionCuenta` |
| BR-AUTH-007 Reset de password por soporte auditado | IMPLEMENTADA | `PasswordResetAudit` + modulo `otros-usuarios` |

---

## 2) Alumnos (BR-ALU)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-ALU-001 Relacion usuario-alumno obligatoria | IMPLEMENTADA | Prisma `Alumno.id` relacionado con `Usuario.id` |
| BR-ALU-002 Licencia objetivo obligatoria | IMPLEMENTADA | `Alumno.tipoLicenciaObjetivo` + validaciones de servicio |
| BR-ALU-003 Estado activo/inactivo | IMPLEMENTADA | `Alumno.activo` + endpoints de activacion/desactivacion |
| BR-ALU-004 Profesor asignado opcional | IMPLEMENTADA | `profesorAsignadoId` nullable |
| BR-ALU-005 Estado de expediente persistido y calculado | IMPLEMENTADA | `estadoExpediente` + `resolveExpedientePhase` |

---

## 3) Profesores (BR-PRO)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-PRO-001 Relacion usuario-profesor obligatoria | IMPLEMENTADA | Prisma `Profesor.id` asociado a `Usuario.id` |
| BR-PRO-002 Datos de contacto y licencias | IMPLEMENTADA | `licenciaConducir`, `telefono`, `permisosLicencias` |
| BR-PRO-003 Estado activo/inactivo | IMPLEMENTADA | `Profesor.activo` + endpoints toggle |
| BR-PRO-004 Historial de reasignacion de alumnos | IMPLEMENTADA | `AlumnoProfesorHistorial` |
| BR-PRO-005 Horario por bloques | IMPLEMENTADA | `ProfesorHorarioBloque` |

---

## 4) Vehiculos y gastos (BR-VEH)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-VEH-001 Matricula unica | IMPLEMENTADA | Prisma `Vehiculo.matricula @unique` |
| BR-VEH-002 Tipo de permiso obligatorio | IMPLEMENTADA | `Vehiculo.tipoPermiso` |
| BR-VEH-003 Estado activo/inactivo | IMPLEMENTADA | `Vehiculo.activo` + endpoints toggle |
| BR-VEH-004 Imagen opcional | IMPLEMENTADA | `Vehiculo.imagenRuta` + carga multipart |
| BR-VEH-005 Gastos de combustible asociados | IMPLEMENTADA | `GastoCombustible` + rutas dedicadas |

---

## 5) Clases practicas y hoja de ruta (BR-CLA)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-CLA-001 Clase requiere alumno/profesor/vehiculo | IMPLEMENTADA | Prisma `ClasePractica` + validaciones servicio |
| BR-CLA-002 Fecha valida y control de disponibilidad | IMPLEMENTADA | `clases.service` |
| BR-CLA-003 Tipo de clase por fase/licencia | IMPLEMENTADA | `tipoClasePractica`, reglas de licencia |
| BR-CLA-004 Cancelacion con reglas de estado/pago | IMPLEMENTADA | `clases.service` + actualizacion de pago |
| BR-CLA-005 Hoja de ruta por clase | IMPLEMENTADA | `HojaRuta` (1:1 con clase) |

---

## 6) Examenes y solicitudes (BR-EXA / BR-SOL)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-EXA-001 Examen ligado a alumno | IMPLEMENTADA | Prisma `Examen.alumnoId` |
| BR-EXA-002 Tipos teorico/practico | IMPLEMENTADA | validaciones en servicios |
| BR-SOL-001 Solicitudes con estado controlado | IMPLEMENTADA | `solicitudes-examen.service` constantes de estado |
| BR-SOL-002 Fase practica en licencias duales | IMPLEMENTADA | `fasePractica` + reglas licencia |
| BR-SOL-003 Evaluacion practica por faltas | IMPLEMENTADA | campos de faltas y motivo no apto |
| BR-SOL-004 Consumo de convocatorias de pago | IMPLEMENTADA | `Pago.convocatorias*` + proceso evaluacion |

---

## 7) Formacion teorica y DGT (BR-TEO)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-TEO-001 Temarios por licencia | IMPLEMENTADA | `Temario.tipoLicenciaObjetivo` |
| BR-TEO-002 Progreso por alumno y tema | IMPLEMENTADA | `TemarioProgreso` |
| BR-TEO-003 Test por alumno/tema | IMPLEMENTADA | `TestPractica` |
| BR-TEO-004 Banco de preguntas DGT | IMPLEMENTADA | `PreguntaDGT` + `RespuestaPreguntaDGT` |
| BR-TEO-005 Examen DGT del alumno | IMPLEMENTADA | `ExamenDGTAlumno` |

---

## 8) Economico y facturacion (BR-ECO)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-ECO-001 Tarifa de matricula por licencia | IMPLEMENTADA | `TarifaMatricula` |
| BR-ECO-002 Tarifas por concepto | IMPLEMENTADA | `TarifaConcepto` + historial |
| BR-ECO-003 Matricula con estado de pago | IMPLEMENTADA | `Matricula.estado`, `matriculas.service.pagar` |
| BR-ECO-004 Pagos por concepto y origen | IMPLEMENTADA | `Pago` (matricula, bono, clase) |
| BR-ECO-005 Facturas con PDF y duplicado | IMPLEMENTADA | `facturas.service` |
| BR-ECO-006 Bonos y compras por alumno | IMPLEMENTADA | `Bono`, `CompraBono` |
| BR-ECO-007 Promociones aplicables por licencia | IMPLEMENTADA | `Promocion.licenciasAplicables` |
| BR-ECO-008 Nominas por profesor/mes | IMPLEMENTADA | `Nomina` |

---

## 9) Notificaciones y soporte (BR-NOT)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-NOT-001 Notificacion por eventos clave | IMPLEMENTADA | `notificaciones` + llamadas desde servicios |
| BR-NOT-002 Lectura/archivo por usuario | IMPLEMENTADA | campos `leida`, `archivada` + endpoints patch |
| BR-NOT-003 Soporte de stream en backend | IMPLEMENTADA | `notificaciones.routes` (`/stream`) |

---

## 10) Dashboard y reporting (BR-DASH)

| Regla | Estado | Evidencia principal |
|---|---|---|
| BR-DASH-001 Vistas por perfil | IMPLEMENTADA | endpoints dashboard por rol + frontend |
| BR-DASH-002 Metricas operativas | IMPLEMENTADA | `dashboard.service` |
| BR-DASH-003 Informes administrativos | IMPLEMENTADA | modulo `informes` |

---

## 11) Reglas pendientes / huecos detectados (BR-GAP)

| Regla/Hueco | Estado | Evidencia |
|---|---|---|
| Exposicion de `convocatorias-teorico` como API activa | IMPLEMENTADA | montada en `app.js` y expuesta en `/api/convocatorias-teorico` |
| Cobertura frontend de pruebas por modulos | PARCIAL | fase 7 completada con cobertura en `temarios`, `test-dgt`, `agendas`, `account-activation`, `pagos`, `login`, `dashboard`, `pago-matricula`, `solicitudes-examen`, `alumnos`, `profesores`, `clases`, `facturas`, `vehiculos`, `bonos`, `promociones`, `tarifas-matricula`, `tarifas-concepto`, `notificaciones`, `gastos`, `nominas`, `otros-usuarios`, `matriculas`, `profesor-alumnos`, `profesor-vehiculos`, `profesor-agenda`, `clases-practicas-profesor`, `examenes`, `convocatoria-examen`, `mis-facturas`, `informes`, `documentos-alumno`, `nueva-licencia`, `reservar-clase`, `mis-pagos`, `examen-teorico-alumno`, `examen-practico-alumno`, `documentos-alumno-admin`, `clases-directo`, `clases-directo-admin`, `clase-directo-detalle`, `first-login-password`, `facturas-admin` y `hojas-ruta`; validacion: suite frontend en verde (45 archivos / 66 tests); pendiente ampliar al resto |
| Matriz completa de autorizaciones documentada endpoint a endpoint | PARCIAL | permisos implementados, documentacion aun resumida |

---

## 12) Mantenimiento del indice

Al introducir nuevas reglas o cambios de comportamiento:

1. actualizar `BUSINESS_RULES.md`
2. reflejar entidad/flujo en `DOMAIN_MODEL.md` y `FUNCTIONAL_SPECIFICATION.md`
3. actualizar este indice con estado y evidencia tecnica concreta
