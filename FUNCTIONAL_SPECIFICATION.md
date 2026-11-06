# FUNCTIONAL_SPECIFICATION.md

## Estado del documento

- ultima revision: 2026-11-06
- base: comportamiento real implementado y rutas activas
- validacion asociada: backend tests en verde (689/689) y frontend build correcto
- control de versiones: BR-GAP-003 completado con matriz documental de permisos endpoint a endpoint

---

# 1. Alcance actual del sistema

El sistema cubre:

- autenticacion, activacion y primer acceso
- gestion de usuarios operativos y roles
- ciclo completo de alumno (matricula, teoria, practicas, examenes)
- gestion de activos (profesores, vehiculos)
- gestion economica (tarifas, pagos, facturas, bonos, promociones, nominas)
- trazabilidad operativa (hojas de ruta, notificaciones, dashboards, informes)

---

# 2. Actor principal: Administrador

## 2.1 Autenticacion y acceso

- login por credenciales
- sesion con JWT
- acceso a panel de administracion por rol

## 2.2 Gestion de usuarios

- alta/edicion/baja logica de usuarios operativos
- reseteo de password con auditoria
- gestion de roles con permisos de backend

## 2.3 Gestion de alumnos

- alta y mantenimiento de expediente
- asignacion/reasignacion de profesor
- seguimiento de estado de expediente
- acceso a documentos y trazabilidad asociada

## 2.4 Gestion de profesores

- mantenimiento de datos y disponibilidad
- gestion de permisos/licencias
- consulta de alumnos asignados

## 2.5 Gestion de vehiculos

- alta y mantenimiento de flota
- activacion/desactivacion
- carga de imagen (opcional)

## 2.6 Gestion de clases practicas

- planificacion/edicion/cancelacion
- control de disponibilidad y estado
- integracion con pagos y hoja de ruta

## 2.7 Gestion de examenes

- gestion de examenes y convocatorias
- evaluacion de solicitudes teoricas/practicas
- control de fases practicas (circulacion/pista)

## 2.8 Dashboard ejecutivo

- metricas de estado general
- visibilidad segmentada por rol

## 2.9 Gestion economica y administrativa

- matriculas, tarifas, promociones y bonos
- pagos, facturas y descarga de PDF
- gastos de combustible y nominas
- informes operativos

---

# 3. Actor: Administrativo

## Funciones implementadas

- acceso a dashboard administrativo
- gestion de alumnos, profesores y vehiculos
- gestion de tarifas/promociones/bonos
- gestion de convocatorias, examenes y facturacion
- consulta de nominas e informes
- acceso a notificaciones

## Restricciones

- no dispone de todas las acciones exclusivas de `ADMIN` en usuarios de soporte

---

# 4. Actor: Soporte

## Funciones implementadas

- acceso a dashboard de soporte
- gestion de usuarios operativos permitidos
- seguimiento de notificaciones

## Restricciones

- acceso funcional reducido respecto a admin/administrativo

---

# 5. Actor: Profesor

## Funciones implementadas

- dashboard de profesor
- agenda y clases practicas asignadas
- consulta de alumnos asignados
- hoja de ruta de clases
- consulta de vehiculos relevantes
- gestion/consulta de gastos y nominas
- notificaciones

---

# 6. Actor: Alumno

## Funciones implementadas

- dashboard de alumno
- acceso a documentos propios
- pago de matricula y pagos propios
- consulta de facturas propias
- temario y test DGT
- reserva/seguimiento de clases y hojas de ruta
- solicitudes de examen teorico/practico
- acceso a notificaciones

## Comportamiento dinamico

El menu de alumno cambia segun:

- matricula pagada/no pagada
- teorico apto historico
- licencia obtenida

---

# 7. Funcionalidad general del sistema actual

## 7.1 Login

Flujo actual:

1. credenciales validas
2. generacion de token JWT
3. carga de interfaz segun rol

## 7.2 Primer acceso

Si `requiereCambioPassword = true`:

- se fuerza cambio de password
- se bloquea navegacion funcional hasta completar el cambio

## 7.3 Mantenimiento de entidades

Patron CRUD con validaciones en backend para:

- alumnos
- profesores
- vehiculos
- temarios
- examenes/solicitudes
- bonos/promociones/tarifas

## 7.4 Proteccion por roles

Toda ruta protegida valida:

1. autenticacion (token)
2. autorizacion (rol permitido)
3. ownership cuando aplica (ej. pagos/facturas de alumno)

---

# 8. Funcionalidades con implementacion parcial o no expuesta

## 8.1 Convocatorias teoricas

RESUELTO (2026-11-06): el feature backend ya esta montado en `app.js`
y expuesto en `/api/convocatorias-teorico`.

## 8.2 Cobertura de tests frontend

Cobertura ampliada (2026-11-06, fase 7) con pruebas funcionales en
`temarios`, `test-dgt`, `agendas`, `account-activation`, `pagos`, `login`,
`dashboard`, `pago-matricula`, `solicitudes-examen`, `alumnos`,
`profesores`, `clases`, `facturas`, `vehiculos`, `bonos`,
`promociones`, `tarifas-matricula`, `tarifas-concepto`,
`notificaciones`, `gastos`, `nominas`, `otros-usuarios`, `matriculas`,
`profesor-alumnos`, `profesor-vehiculos`, `profesor-agenda`,
`clases-practicas-profesor`, `examenes`, `convocatoria-examen`,
`mis-facturas`, `informes`, `documentos-alumno`, `nueva-licencia`,
`reservar-clase`, `mis-pagos`, `examen-teorico-alumno`,
`examen-practico-alumno`, `documentos-alumno-admin`, `clases-directo`,
`clases-directo-admin`, `clase-directo-detalle`, `first-login-password`
y `facturas-admin`; en la fase 7 se añade `hojas-ruta` con escenarios
de profesor, admin/administrativo y alumno.
Validacion tecnica: suite frontend en verde (`45` archivos / `66` tests).
Sigue pendiente ampliacion transversal al resto de modulos.

## 8.3 Matriz documental de permisos fina

    RESUELTO (2026-11-06): se documenta matriz de permisos endpoint a endpoint en la seccion 9, con alcance de endpoints de `app.js` y de todos los modulos en `features/*`.

---

# 9. Matriz documental de permisos fina (BR-GAP-003)

### 9.1 Criterio de lectura

- `Auth`: `Si` implica `authenticate`; `No` implica endpoint publico.
- `Roles permitidos`: lista explicita de `authorize(...)`; si no hay `authorize` y hay auth, se documenta como `CUALQUIER_USUARIO_AUTENTICADO`.
- `Ownership/alcance`: solo se marca cuando hay regla documental explicita en negocio o en flujo economico ya descrito.

### 9.2 Endpoints de app (no feature)

| Metodo | Endpoint              | Auth | Roles permitidos | Ownership/alcance adicional |
| ------ | --------------------- | ---- | ---------------- | --------------------------- |
| GET    | /api/health           | No   | PUBLICO          | -                           |
| GET    | /api/promociones-test | No   | PUBLICO          | -                           |
| STATIC | /api/uploads/\*       | No   | PUBLICO          | -                           |

### 9.3 Endpoints por modulo (features)

#### /api/alumnos

| Metodo | Endpoint                              | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/alumnos/:id/activar              | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/alumnos/:id/profesores-elegibles | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/alumnos/:id/resumen-extendido    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/alumnos/:id                      | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/alumnos/:id                      | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/alumnos/:id                      | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/alumnos/promociones-elegibles    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/alumnos/public/register          | No   | PUBLICO               | -                           |
| GET    | /api/alumnos                          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/alumnos                          | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/auth

| Metodo | Endpoint                                 | Auth | Roles permitidos              | Ownership/alcance adicional |
| ------ | ---------------------------------------- | ---- | ----------------------------- | --------------------------- |
| POST   | /api/auth/activacion/completar           | No   | PUBLICO                       | -                           |
| POST   | /api/auth/activacion/reenviar/:userId    | Si   | ADMIN, ADMINISTRATIVO         | -                           |
| POST   | /api/auth/activacion/validar             | No   | PUBLICO                       | -                           |
| POST   | /api/auth/login                          | No   | PUBLICO                       | -                           |
| GET    | /api/auth/me                             | Si   | CUALQUIER_USUARIO_AUTENTICADO | -                           |
| POST   | /api/auth/password-reset/reset-default   | No   | PUBLICO                       | -                           |
| POST   | /api/auth/password-reset/validate-email  | No   | PUBLICO                       | -                           |
| POST   | /api/auth/primer-acceso/cambiar-password | Si   | CUALQUIER_USUARIO_AUTENTICADO | -                           |

#### /api/bonos

| Metodo | Endpoint                  | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/bonos/:id/activar    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/bonos/:id/comprar    | Si   | ALUMNO                | -                           |
| PATCH  | /api/bonos/:id/desactivar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/bonos/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/bonos/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/bonos/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/bonos/disponibles    | Si   | ALUMNO                | -                           |
| GET    | /api/bonos                | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/bonos                | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/clases

| Metodo | Endpoint                                 | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ---------------------------------------- | ---- | --------------------- | --------------------------- |
| DELETE | /api/clases/:id                          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/clases/:id                          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/clases/:id                          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PATCH  | /api/clases/mine/professor/:id/cancel    | Si   | PROFESOR              | -                           |
| PATCH  | /api/clases/mine/professor/:id/confirm   | Si   | PROFESOR              | -                           |
| GET    | /api/clases/mine/professor/requests      | Si   | PROFESOR              | -                           |
| PATCH  | /api/clases/mine/student/:id/cancel      | Si   | ALUMNO                | -                           |
| GET    | /api/clases/mine/student/booking-context | Si   | ALUMNO                | -                           |
| GET    | /api/clases/mine/student/eligibility     | Si   | ALUMNO                | -                           |
| POST   | /api/clases/mine/student/request         | Si   | ALUMNO                | -                           |
| GET    | /api/clases                              | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/clases                              | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/clases-directo

| Metodo | Endpoint                        | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/clases-directo/:id/activar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/clases-directo/:id         | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/clases-directo/:id         | Si   | ALUMNO, ADMIN         | -                           |
| PUT    | /api/clases-directo/:id         | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/clases-directo/alumno      | Si   | ALUMNO                | -                           |
| GET    | /api/clases-directo             | Si   | ALUMNO, ADMIN         | -                           |
| POST   | /api/clases-directo             | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/convocatorias-examen

| Metodo | Endpoint                                    | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------------- | ---- | --------------------- | --------------------------- |
| GET    | /api/convocatorias-examen/:id/delete-impact | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/convocatorias-examen/:id               | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/convocatorias-examen/:id               | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/convocatorias-examen/agenda            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/convocatorias-examen                   | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/convocatorias-examen                   | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/convocatorias-teorico

| Metodo | Endpoint                       | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------ | ---- | --------------------- | --------------------------- |
| DELETE | /api/convocatorias-teorico/:id | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/convocatorias-teorico/:id | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/convocatorias-teorico     | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/convocatorias-teorico     | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/dashboard

| Metodo | Endpoint                                               | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------------------------ | ---- | --------------------- | --------------------------- |
| GET    | /api/dashboard/administrativo                          | Si   | ADMINISTRATIVO        | -                           |
| GET    | /api/dashboard/advanced                                | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/dashboard/executive                               | Si   | ADMIN                 | -                           |
| GET    | /api/dashboard/professor/agenda                        | Si   | PROFESOR              | -                           |
| PATCH  | /api/dashboard/professor/classes/:classId/status       | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/professor/students/:alumnoId            | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/professor/students                      | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/professor/vehicles/:vehiculoId/schedule | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/professor/vehicles                      | Si   | PROFESOR              | -                           |
| PUT    | /api/dashboard/professor/work-schedule                 | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/professor                               | Si   | PROFESOR              | -                           |
| GET    | /api/dashboard/soporte                                 | Si   | SOPORTE               | -                           |
| GET    | /api/dashboard/student/new-license/context             | Si   | ALUMNO                | -                           |
| GET    | /api/dashboard/student/new-license/promotions          | Si   | ALUMNO                | -                           |
| POST   | /api/dashboard/student/new-license                     | Si   | ALUMNO                | -                           |
| GET    | /api/dashboard/student                                 | Si   | ALUMNO                | -                           |
| GET    | /api/dashboard                                         | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/documentos-alumno

| Metodo | Endpoint                           | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ---------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/documentos-alumno/:id/validar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/documentos-alumno/:id         | Si   | ALUMNO                | -                           |
| PUT    | /api/documentos-alumno/:id         | Si   | ALUMNO                | -                           |
| GET    | /api/documentos-alumno/admin       | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/documentos-alumno             | Si   | ALUMNO                | -                           |
| POST   | /api/documentos-alumno             | Si   | ALUMNO                | -                           |

#### /api/examenes

| Metodo | Endpoint                    | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | --------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/examenes/:id/resultado | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/examenes/:id           | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/examenes/:id           | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/examenes/:id           | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/examenes               | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/examenes               | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/facturas

| Metodo | Endpoint                         | Auth | Roles permitidos              | Ownership/alcance adicional                                        |
| ------ | -------------------------------- | ---- | ----------------------------- | ------------------------------------------------------------------ |
| GET    | /api/facturas/:id/pdf            | Si   | ADMIN, ADMINISTRATIVO, ALUMNO | Ownership alumno en consulta de facturas propias (flujo economico) |
| GET    | /api/facturas/:id/preview        | Si   | ADMIN, ADMINISTRATIVO, ALUMNO | Ownership alumno en consulta de facturas propias (flujo economico) |
| POST   | /api/facturas/:id/send-duplicate | Si   | ADMIN, ADMINISTRATIVO         | -                                                                  |
| GET    | /api/facturas/mine               | Si   | ALUMNO                        | Ownership alumno en consulta de facturas propias (flujo economico) |
| GET    | /api/facturas                    | Si   | ADMIN, ADMINISTRATIVO         | -                                                                  |

#### /api/gastos-combustible

| Metodo | Endpoint                                         | Auth | Roles permitidos                | Ownership/alcance adicional |
| ------ | ------------------------------------------------ | ---- | ------------------------------- | --------------------------- |
| GET    | /api/gastos-combustible/mine                     | Si   | PROFESOR                        | -                           |
| POST   | /api/gastos-combustible/repostar/:vehiculoId     | Si   | PROFESOR                        | -                           |
| POST   | /api/gastos-combustible/revision-itv/:vehiculoId | Si   | ADMIN, ADMINISTRATIVO, PROFESOR | -                           |
| GET    | /api/gastos-combustible                          | Si   | ADMIN, ADMINISTRATIVO           | -                           |

#### /api/hojas-ruta

| Metodo | Endpoint                                                             | Auth | Roles permitidos                        | Ownership/alcance adicional |
| ------ | -------------------------------------------------------------------- | ---- | --------------------------------------- | --------------------------- |
| GET    | /api/hojas-ruta/admin/hojas/:roadmapId                               | Si   | ADMIN, ADMINISTRATIVO                   | -                           |
| GET    | /api/hojas-ruta/admin/profesores/:profesorId/alumnos/:alumnoId/hojas | Si   | ADMIN, ADMINISTRATIVO                   | -                           |
| GET    | /api/hojas-ruta/admin/profesores/:profesorId/alumnos                 | Si   | ADMIN, ADMINISTRATIVO                   | -                           |
| GET    | /api/hojas-ruta/admin/profesores                                     | Si   | ADMIN, ADMINISTRATIVO                   | -                           |
| GET    | /api/hojas-ruta/catalogo-faltas                                      | Si   | ADMIN, PROFESOR, ALUMNO                 | -                           |
| GET    | /api/hojas-ruta/mine/alumno/:roadmapId                               | Si   | ALUMNO                                  | -                           |
| GET    | /api/hojas-ruta/mine/alumno                                          | Si   | ALUMNO                                  | -                           |
| PUT    | /api/hojas-ruta/mine/profesor/:claseId/borrador                      | Si   | ADMIN, ADMINISTRATIVO, PROFESOR, ALUMNO | -                           |
| PUT    | /api/hojas-ruta/mine/profesor/:claseId/finalizar                     | Si   | PROFESOR                                | -                           |
| GET    | /api/hojas-ruta/mine/profesor/:claseId                               | Si   | PROFESOR                                | -                           |
| GET    | /api/hojas-ruta/mine/profesor                                        | Si   | PROFESOR                                | -                           |

#### /api/informes

| Metodo | Endpoint                 | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------ | ---- | --------------------- | --------------------------- |
| GET    | /api/informes/accounting | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/matriculas

| Metodo | Endpoint                   | Auth | Roles permitidos              | Ownership/alcance adicional                                |
| ------ | -------------------------- | ---- | ----------------------------- | ---------------------------------------------------------- |
| PATCH  | /api/matriculas/:id/anular | Si   | ADMIN, ADMINISTRATIVO         | -                                                          |
| PATCH  | /api/matriculas/:id/pagar  | Si   | CUALQUIER_USUARIO_AUTENTICADO | BR-ECO-003: pago matricula con validacion de ownership/rol |
| GET    | /api/matriculas/:id        | Si   | ADMIN, ADMINISTRATIVO         | -                                                          |
| PUT    | /api/matriculas/:id        | Si   | ADMIN, ADMINISTRATIVO         | -                                                          |
| GET    | /api/matriculas/mine       | Si   | ALUMNO                        | -                                                          |
| GET    | /api/matriculas            | Si   | ADMIN, ADMINISTRATIVO         | -                                                          |
| POST   | /api/matriculas            | Si   | ADMIN, ADMINISTRATIVO         | -                                                          |

#### /api/nominas

| Metodo | Endpoint                 | Auth | Roles permitidos                | Ownership/alcance adicional |
| ------ | ------------------------ | ---- | ------------------------------- | --------------------------- |
| GET    | /api/nominas/:id/pdf     | Si   | ADMIN, ADMINISTRATIVO, PROFESOR | -                           |
| GET    | /api/nominas/:id/preview | Si   | ADMIN, ADMINISTRATIVO, PROFESOR | -                           |
| POST   | /api/nominas/generar     | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| GET    | /api/nominas/mine        | Si   | PROFESOR                        | -                           |
| GET    | /api/nominas             | Si   | ADMIN, ADMINISTRATIVO           | -                           |

#### /api/notificaciones

| Metodo | Endpoint                          | Auth | Roles permitidos                                 | Ownership/alcance adicional |
| ------ | --------------------------------- | ---- | ------------------------------------------------ | --------------------------- |
| PATCH  | /api/notificaciones/:id/archive   | Si   | ADMIN, ADMINISTRATIVO, SOPORTE, PROFESOR, ALUMNO | -                           |
| PATCH  | /api/notificaciones/:id/read      | Si   | ADMIN, ADMINISTRATIVO, SOPORTE, PROFESOR, ALUMNO | -                           |
| PATCH  | /api/notificaciones/:id/unarchive | Si   | ADMIN, ADMINISTRATIVO, SOPORTE, PROFESOR, ALUMNO | -                           |
| PATCH  | /api/notificaciones/mine/read-all | Si   | ADMIN, ADMINISTRATIVO, SOPORTE, PROFESOR, ALUMNO | -                           |
| GET    | /api/notificaciones/mine          | Si   | ADMIN, ADMINISTRATIVO, SOPORTE, PROFESOR, ALUMNO | -                           |
| GET    | /api/notificaciones/stream        | No   | PUBLICO                                          | -                           |

#### /api/otros-usuarios

| Metodo | Endpoint                               | Auth | Roles permitidos | Ownership/alcance adicional |
| ------ | -------------------------------------- | ---- | ---------------- | --------------------------- |
| PATCH  | /api/otros-usuarios/:id/activar        | Si   | ADMIN, SOPORTE   | -                           |
| DELETE | /api/otros-usuarios/:id/hard-delete    | Si   | ADMIN            | -                           |
| PATCH  | /api/otros-usuarios/:id/reset-password | Si   | ADMIN, SOPORTE   | -                           |
| DELETE | /api/otros-usuarios/:id                | Si   | ADMIN, SOPORTE   | -                           |
| GET    | /api/otros-usuarios/:id                | Si   | ADMIN, SOPORTE   | -                           |
| PUT    | /api/otros-usuarios/:id                | Si   | ADMIN, SOPORTE   | -                           |
| GET    | /api/otros-usuarios                    | Si   | ADMIN, SOPORTE   | -                           |
| POST   | /api/otros-usuarios                    | Si   | ADMIN, SOPORTE   | -                           |

#### /api/pagos

| Metodo | Endpoint             | Auth | Roles permitidos | Ownership/alcance adicional                          |
| ------ | -------------------- | ---- | ---------------- | ---------------------------------------------------- |
| PATCH  | /api/pagos/:id/pagar | Si   | ALUMNO           | BR-ECO-004: alumno solo opera/consulta pagos propios |
| GET    | /api/pagos/:id       | Si   | ALUMNO           | BR-ECO-004: alumno solo opera/consulta pagos propios |
| GET    | /api/pagos/mine      | Si   | ALUMNO           | BR-ECO-004: alumno solo opera/consulta pagos propios |
| GET    | /api/pagos           | Si   | ADMIN            | -                                                    |

#### /api/preguntas-dgt

| Metodo | Endpoint                           | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ---------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/preguntas-dgt/:id/activar     | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PATCH  | /api/preguntas-dgt/:id/desactivar  | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/preguntas-dgt/:id             | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/preguntas-dgt/:id             | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/preguntas-dgt/:id             | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/preguntas-dgt/corregir-examen | Si   | ALUMNO                | -                           |
| POST   | /api/preguntas-dgt/generar-examen  | Si   | ALUMNO                | -                           |
| GET    | /api/preguntas-dgt/next-id         | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/preguntas-dgt                 | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/preguntas-dgt                 | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/profesores

| Metodo | Endpoint                                         | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------------------ | ---- | --------------------- | --------------------------- |
| PATCH  | /api/profesores/:id/activar                      | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/profesores/:id/admin-agenda                 | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/profesores/:id/deactivate-with-reassignment | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/profesores/:id/deactivation-impact          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/profesores/:id/overview                     | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/profesores/:id                              | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/profesores/:id                              | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/profesores/:id                              | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/profesores                                  | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/profesores                                  | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/promociones

| Metodo | Endpoint                        | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/promociones/:id/activar    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PATCH  | /api/promociones/:id/desactivar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/promociones/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/promociones/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/promociones/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/promociones/public         | No   | PUBLICO               | -                           |
| GET    | /api/promociones                | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/promociones                | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/solicitudes-examen

| Metodo | Endpoint                                                       | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | -------------------------------------------------------------- | ---- | --------------------- | --------------------------- |
| DELETE | /api/solicitudes-examen/:id                                    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/solicitudes-examen/:id                                    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/solicitudes-examen/:id                                    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/solicitudes-examen/evaluacion                             | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/solicitudes-examen/mine/practico/calendario               | Si   | ALUMNO                | -                           |
| GET    | /api/solicitudes-examen/mine/practico/eligibilidad             | Si   | ALUMNO                | -                           |
| POST   | /api/solicitudes-examen/mine/practico/solicitar                | Si   | ALUMNO                | -                           |
| PATCH  | /api/solicitudes-examen/mine/practico/solicitudes/:id/cancelar | Si   | ALUMNO                | -                           |
| GET    | /api/solicitudes-examen/mine/teorico/calendario                | Si   | ALUMNO                | -                           |
| GET    | /api/solicitudes-examen/mine/teorico/eligibilidad              | Si   | ALUMNO                | -                           |
| POST   | /api/solicitudes-examen/mine/teorico/solicitar                 | Si   | ALUMNO                | -                           |
| PATCH  | /api/solicitudes-examen/mine/teorico/solicitudes/:id/cancelar  | Si   | ALUMNO                | -                           |
| GET    | /api/solicitudes-examen/mine                                   | Si   | ALUMNO                | -                           |
| GET    | /api/solicitudes-examen                                        | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/solicitudes-examen                                        | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/tarifas-concepto

| Metodo | Endpoint                             | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------ | ---- | --------------------- | --------------------------- |
| PATCH  | /api/tarifas-concepto/:id/activar    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PATCH  | /api/tarifas-concepto/:id/desactivar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/tarifas-concepto/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/tarifas-concepto/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/tarifas-concepto/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/tarifas-concepto                | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/tarifas-concepto                | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/tarifas-matricula

| Metodo | Endpoint                              | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ------------------------------------- | ---- | --------------------- | --------------------------- |
| PATCH  | /api/tarifas-matricula/:id/activar    | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PATCH  | /api/tarifas-matricula/:id/desactivar | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/tarifas-matricula/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/tarifas-matricula/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/tarifas-matricula/:id            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/tarifas-matricula                | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/tarifas-matricula                | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/temarios

| Metodo | Endpoint                                 | Auth | Roles permitidos      | Ownership/alcance adicional |
| ------ | ---------------------------------------- | ---- | --------------------- | --------------------------- |
| POST   | /api/temarios/:id/documentacion          | Si   | ADMIN, ADMINISTRATIVO | -                           |
| DELETE | /api/temarios/:id                        | Si   | ADMIN, ADMINISTRATIVO | -                           |
| GET    | /api/temarios/:id                        | Si   | ADMIN, ADMINISTRATIVO | -                           |
| PUT    | /api/temarios/:id                        | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/temarios/mis-temarios/:id/mini-test | Si   | ALUMNO                | -                           |
| GET    | /api/temarios/mis-temarios/:id           | Si   | ALUMNO                | -                           |
| GET    | /api/temarios/mis-temarios               | Si   | ALUMNO                | -                           |
| GET    | /api/temarios                            | Si   | ADMIN, ADMINISTRATIVO | -                           |
| POST   | /api/temarios                            | Si   | ADMIN, ADMINISTRATIVO | -                           |

#### /api/vehiculos

| Metodo | Endpoint                                        | Auth | Roles permitidos                | Ownership/alcance adicional |
| ------ | ----------------------------------------------- | ---- | ------------------------------- | --------------------------- |
| PATCH  | /api/vehiculos/:id/activar                      | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| POST   | /api/vehiculos/:id/deactivate-with-reassignment | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| GET    | /api/vehiculos/:id/deactivation-impact          | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| POST   | /api/vehiculos/:id/pagar-itv                    | Si   | ADMIN, ADMINISTRATIVO, PROFESOR | -                           |
| DELETE | /api/vehiculos/:id                              | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| GET    | /api/vehiculos/:id                              | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| PUT    | /api/vehiculos/:id                              | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| GET    | /api/vehiculos                                  | Si   | ADMIN, ADMINISTRATIVO           | -                           |
| POST   | /api/vehiculos                                  | Si   | ADMIN, ADMINISTRATIVO           | -                           |

### 9.4 Resumen cuantitativo

- endpoints de app documentados: 3
- endpoints de features documentados: 211
- total endpoints en matriz: 214

---

# 10. Matriz funcional resumida (estado)

| Area                                              | Estado       |
| ------------------------------------------------- | ------------ |
| Autenticacion y roles                             | Implementada |
| Gestion academica nucleo                          | Implementada |
| Solicitudes/evaluaciones de examen                | Implementada |
| Expediente unificado                              | Implementada |
| Gestion economica principal                       | Implementada |
| Notificaciones y dashboards                       | Implementada |
| Convocatorias teoricas (exposicion API principal) | Implementada |
| Testing frontend global                           | Parcial      |

---

# 11. Conclusion

La especificacion funcional real muestra un sistema amplio y operativo para una autoescuela,
con especial madurez en backend y en procesos academico-economicos.
Los principales pendientes actuales se concentran en exposicion parcial de algun modulo
y en aumentar la cobertura automatizada del frontend.

---

# 12. Historial de cambios

- 2026-11-06: BR-GAP-003 completado con matriz documental de permisos endpoint a endpoint (incluye endpoints de app y de features).
- 2026-11-06: actualizada fecha de revision y control de versiones del documento.
