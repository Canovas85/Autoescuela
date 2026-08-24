# Indice cruzado de reglas de negocio (BR)

Este documento conecta cada regla de `BUSINESS_RULES.md` con su seccion funcional en `FUNCTIONAL_SPECIFICATION.md` y su seccion de dominio en `DOMAIN_MODEL.md`.

Objetivo:

- facilitar trazabilidad BR -> funcional -> dominio
- acelerar revisiones funcionales y tecnicas
- detectar huecos de implementacion o reglas futuras

---

## Referencias base

- Reglas: `BUSINESS_RULES.md`
- Funcional: `FUNCTIONAL_SPECIFICATION.md`
- Dominio: `DOMAIN_MODEL.md`

---

## 1) Autenticacion y usuarios (BR-AUTH)

| Regla BR                                                               | Seccion funcional                                                                                             | Seccion dominio                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| BR-AUTH-001 - Email unico                                              | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Login                                          | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-002 - Contrasena obligatoria                                   | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Login                                          | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-003 - Longitud minima de contrasena                            | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Login                                          | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-004 - Login por credenciales                                   | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Login                                          | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-005 - Roles soportados por el sistema actual                   | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.3 Proteccion por roles                           | DOMAIN_MODEL.md · 3. Roles actuales del sistema                                     |
| BR-AUTH-006 - Proteccion de rutas por rol                              | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.3 Proteccion por roles                           | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario / 3. Roles actuales del sistema |
| BR-AUTH-007 - Cambio obligatorio en primer acceso                      | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Flujo de primer acceso                         | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-008 - Excepcion de acceso durante primer login                 | FUNCTIONAL_SPECIFICATION.md · 2.1 Autenticacion y acceso / 5.1 Restriccion de seguridad durante primer acceso | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-009 - Reglas de contrasena para primer cambio                  | FUNCTIONAL_SPECIFICATION.md · 5.1 Flujo de primer acceso                                                      | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-010 - Confirmacion de contrasena obligatoria                   | FUNCTIONAL_SPECIFICATION.md · 5.1 Flujo de primer acceso                                                      | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-011 - Persistencia del cambio y desactivacion de primer acceso | FUNCTIONAL_SPECIFICATION.md · 5.1 Flujo de primer acceso                                                      | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |
| BR-AUTH-012 - Cabecera Authorization obligatoria en rutas protegidas   | FUNCTIONAL_SPECIFICATION.md · 9.1 Autenticacion en frontend / 5.3 Proteccion por roles                        | DOMAIN_MODEL.md · 2.1 Identidad y acceso -> Usuario                                 |

---

## 2) Alumnos (BR-ALU)

| Regla BR                                                           | Seccion funcional                                                      | Seccion dominio                                                             |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| BR-ALU-001 - Relacion usuario-alumno obligatoria                   | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos                   | DOMAIN_MODEL.md · 2.2 Gestion academica y operativa -> Alumno               |
| BR-ALU-002 - Email unico en alumnos                                | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos                   | DOMAIN_MODEL.md · 2.2 Gestion academica y operativa -> Alumno / 2.1 Usuario |
| BR-ALU-003 - Licencia objetivo obligatoria                         | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos                   | DOMAIN_MODEL.md · 2.2 Gestion academica y operativa -> Alumno               |
| BR-ALU-004 - Estado activo/inactivo del alumno                     | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos / 4. Actor Alumno | DOMAIN_MODEL.md · 2.2 Alumno / 6. Modelo de estados                         |
| BR-ALU-005 - Profesor asignado opcional                            | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos                   | DOMAIN_MODEL.md · 2.2 Alumno (profesorAsignadoId)                           |
| BR-ALU-006 - Registro minimo requerido para creacion               | FUNCTIONAL_SPECIFICATION.md · 2.3 Gestion de alumnos                   | DOMAIN_MODEL.md · 2.1 Usuario / 2.2 Alumno                                  |
| BR-ALU-007 - Contrasena no modificable si se deja vacia en edicion | FUNCTIONAL_SPECIFICATION.md · 9.1 Flujo de alumno                      | DOMAIN_MODEL.md · 9.1 Cambios ya aplicados (conservacion de contrasena)     |

---

## 3) Profesores (BR-PRO)

| Regla BR                                                                     | Seccion funcional                                                                | Seccion dominio                                                         |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| BR-PRO-001 - Relacion usuario-profesor obligatoria                           | FUNCTIONAL_SPECIFICATION.md · 2.4 Gestion de profesores                          | DOMAIN_MODEL.md · 2.2 Profesor                                          |
| BR-PRO-002 - Datos minimos obligatorios                                      | FUNCTIONAL_SPECIFICATION.md · 2.4 Gestion de profesores                          | DOMAIN_MODEL.md · 2.2 Profesor                                          |
| BR-PRO-003 - Estado activo/inactivo del profesor                             | FUNCTIONAL_SPECIFICATION.md · 2.4 Gestion de profesores / 3. Actor Profesor      | DOMAIN_MODEL.md · 2.2 Profesor / 6. Modelo de estados                   |
| BR-PRO-004 - Asignacion de alumnos                                           | FUNCTIONAL_SPECIFICATION.md · 2.4 Gestion de profesores / 2.3 Gestion de alumnos | DOMAIN_MODEL.md · 2.2 Profesor y Alumno / 4. Relaciones principales     |
| BR-PRO-005 - DNI obligatorio en alta y edicion de profesor                   | FUNCTIONAL_SPECIFICATION.md · 9.1 Flujo de profesor                              | DOMAIN_MODEL.md · 2.1 Usuario / 9.1 Cambios ya aplicados                |
| BR-PRO-006 - Permisos de licencias multiples en profesor                     | FUNCTIONAL_SPECIFICATION.md · 9.1 Flujo de profesor                              | DOMAIN_MODEL.md · 2.2 Profesor (permisosLicencias) / 9.1                |
| BR-PRO-007 - Actualizacion transaccional de profesor                         | FUNCTIONAL_SPECIFICATION.md · 9.1 Flujo de profesor                              | DOMAIN_MODEL.md · 9.1 Cambios ya aplicados                              |
| BR-PRO-008 - Contrasena no modificable en edicion administrativa de profesor | FUNCTIONAL_SPECIFICATION.md · 9.1 Flujo de profesor                              | DOMAIN_MODEL.md · 9.1 Cambios ya aplicados (conservacion de contrasena) |

---

## 4) Vehiculos (BR-VEH)

| Regla BR                                                                  | Seccion funcional                                                                   | Seccion dominio                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| BR-VEH-001 - Matricula unica                                              | FUNCTIONAL_SPECIFICATION.md · 2.5 Gestion de vehiculos                              | DOMAIN_MODEL.md · 2.2 Vehiculo                                     |
| BR-VEH-002 - Tipo de permiso obligatorio                                  | FUNCTIONAL_SPECIFICATION.md · 2.5 Gestion de vehiculos                              | DOMAIN_MODEL.md · 2.2 Vehiculo                                     |
| BR-VEH-003 - Estado activo/inactivo del vehiculo                          | FUNCTIONAL_SPECIFICATION.md · 2.5 Gestion de vehiculos                              | DOMAIN_MODEL.md · 2.2 Vehiculo / 6. Modelo de estados              |
| BR-VEH-004 - Uso administrativo del vehiculo                              | FUNCTIONAL_SPECIFICATION.md · 2.5 Gestion de vehiculos                              | DOMAIN_MODEL.md · 2.2 Vehiculo                                     |
| BR-VEH-005 - Imagen opcional en vehiculos (seccion principal)             | FUNCTIONAL_SPECIFICATION.md · 2.5.1 Vehiculos con imagen opcional                   | DOMAIN_MODEL.md · 2.2 Vehiculo (semantica actual de imagen)        |
| BR-VEH-006 - Alta y edicion con imagen (seccion principal)                | FUNCTIONAL_SPECIFICATION.md · 2.5.1 y 2.5.3                                         | DOMAIN_MODEL.md · 2.2 Vehiculo (reglas implementadas sobre imagen) |
| BR-VEH-007 - Ruta real de almacenamiento (seccion principal)              | FUNCTIONAL_SPECIFICATION.md · 2.5.2 Reglas de validacion de imagen                  | DOMAIN_MODEL.md · 2.2 Vehiculo (semantica actual de imagen)        |
| BR-VEH-008 - Imagen de vehiculo (actualizacion agosto 2026)               | FUNCTIONAL_SPECIFICATION.md · 9.1 Vehiculos con imagen / 9.2 Imagen de vehiculo     | DOMAIN_MODEL.md · 9.1 y 9.2                                        |
| BR-VEH-009 - Validacion de imagen de vehiculo (actualizacion agosto 2026) | FUNCTIONAL_SPECIFICATION.md · 9.1 Vehiculos con imagen / 9.2 Validaciones de imagen | DOMAIN_MODEL.md · 9.2 Cambios aun pendientes                       |
| BR-VEH-010 - Vista detalle de vehiculo (proxima fase)                     | FUNCTIONAL_SPECIFICATION.md · 9.2 Detalle de vehiculo (fase posterior)              | DOMAIN_MODEL.md · 9.2 Cambios aun pendientes                       |

---

## 5) Clases practicas (BR-CLA)

| Regla BR                                        | Seccion funcional                                                                     | Seccion dominio                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| BR-CLA-001 - Existencia de recursos obligatoria | FUNCTIONAL_SPECIFICATION.md · 2.6 Gestion de clases practicas                         | DOMAIN_MODEL.md · 2.2 ClasePractica                                     |
| BR-CLA-002 - Fecha obligatoria                  | FUNCTIONAL_SPECIFICATION.md · 2.6 Gestion de clases practicas                         | DOMAIN_MODEL.md · 2.2 ClasePractica                                     |
| BR-CLA-003 - Estado de clase                    | FUNCTIONAL_SPECIFICATION.md · 2.6 Gestion de clases practicas                         | DOMAIN_MODEL.md · 2.2 ClasePractica / 6. Modelo de estados              |
| BR-CLA-004 - Validacion de disponibilidad       | FUNCTIONAL_SPECIFICATION.md · 2.6 Gestion de clases practicas (pendiente de refuerzo) | DOMAIN_MODEL.md · 2.2 ClasePractica / 7. No forma parte actual completa |
| BR-CLA-005 - Reprogramacion y cancelacion       | FUNCTIONAL_SPECIFICATION.md · 2.6 Gestion de clases practicas                         | DOMAIN_MODEL.md · 2.2 ClasePractica                                     |

---

## 6) Examenes (BR-EXA)

| Regla BR                                     | Seccion funcional                                     | Seccion dominio                                     |
| -------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| BR-EXA-001 - Relacion con alumno obligatoria | FUNCTIONAL_SPECIFICATION.md · 2.7 Gestion de examenes | DOMAIN_MODEL.md · 2.2 Examen                        |
| BR-EXA-002 - Fecha y tipo obligatorios       | FUNCTIONAL_SPECIFICATION.md · 2.7 Gestion de examenes | DOMAIN_MODEL.md · 2.2 Examen                        |
| BR-EXA-003 - Estado del examen               | FUNCTIONAL_SPECIFICATION.md · 2.7 Gestion de examenes | DOMAIN_MODEL.md · 2.2 Examen / 6. Modelo de estados |

---

## 7) Dashboard (BR-DASH)

| Regla BR                                          | Seccion funcional                                                   | Seccion dominio                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| BR-DASH-001 - Visibilidad administrativa          | FUNCTIONAL_SPECIFICATION.md · 2.8 Dashboard ejecutivo               | DOMAIN_MODEL.md · 1. Contexto del negocio actual / 9.3 Estado actual |
| BR-DASH-002 - Calculo de metricas                 | FUNCTIONAL_SPECIFICATION.md · 2.8 Dashboard ejecutivo               | DOMAIN_MODEL.md · 9.3 Estado actual del dominio (Dashboard)          |
| BR-DASH-003 - Visibilidad del dashboard de alumno | FUNCTIONAL_SPECIFICATION.md · 4. Actor Alumno / 9.1 Flujo de alumno | DOMAIN_MODEL.md · 2.2 Alumno / 9.3 Estado actual del dominio         |

---

## 8) Formacion teorica y temarios (BR-TEO)

| Regla BR                                                            | Seccion funcional                                                                   | Seccion dominio                                                               |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| BR-TEO-001 - Catalogo basico de temarios                            | FUNCTIONAL_SPECIFICATION.md · 2.9 Gestion de formacion teorica, bonos y solicitudes | DOMAIN_MODEL.md · 2.2 Temario                                                 |
| BR-TEO-002 - Seguimiento de progreso por temario                    | FUNCTIONAL_SPECIFICATION.md · 2.9 / 4. Actor Alumno (temarios)                      | DOMAIN_MODEL.md · 2.2 TemarioProgreso                                         |
| BR-TEO-003 - Tests practicos ligados al alumno                      | FUNCTIONAL_SPECIFICATION.md · 2.9 / 4. Actor Alumno                                 | DOMAIN_MODEL.md · 2.2 TestPractica                                            |
| BR-TEO-004 - Mini test por tema y persistencia de resultado         | FUNCTIONAL_SPECIFICATION.md · 2.9 / 9.1 Temario alumno por tema y mini test         | DOMAIN_MODEL.md · 2.2 TestPractica / 9.1 persistencia dual                    |
| BR-TEO-005 - Doble registro: resumen actual + historico de intentos | FUNCTIONAL_SPECIFICATION.md · 2.9 / 9.1 Temario alumno por tema y mini test         | DOMAIN_MODEL.md · 2.2 TemarioProgreso y TestPractica / 9.1                    |
| BR-TEO-006 - Reglas de resultado del intento                        | FUNCTIONAL_SPECIFICATION.md · 9.1 Temario alumno por tema y mini test               | DOMAIN_MODEL.md · 2.2 TestPractica (semantica actual para mini test por tema) |
| BR-TEO-007 - Historial por alumno y tema                            | FUNCTIONAL_SPECIFICATION.md · 2.9 / 9.1 Temario alumno por tema y mini test         | DOMAIN_MODEL.md · 2.2 TestPractica (historial por alumnoId + temarioId)       |
| BR-TEO-008 - Reintento de mini test en frontend                     | FUNCTIONAL_SPECIFICATION.md · 2.9 / 9.1 Temario alumno por tema y mini test         | DOMAIN_MODEL.md · 9.1 Cambios ya aplicados (persistencia y flujo temario)     |

---

## 9) Bonos (BR-BON)

| Regla BR                                      | Seccion funcional                                                                   | Seccion dominio                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------- |
| BR-BON-001 - Catalogo administrativo de bonos | FUNCTIONAL_SPECIFICATION.md · 2.9 Gestion de formacion teorica, bonos y solicitudes | DOMAIN_MODEL.md · 2.2 Bono       |
| BR-BON-002 - Compras de bono por alumno       | FUNCTIONAL_SPECIFICATION.md · 2.9 Gestion de formacion teorica, bonos y solicitudes | DOMAIN_MODEL.md · 2.2 CompraBono |

---

## 10) Solicitudes de examen (BR-SOL)

| Regla BR                                      | Seccion funcional                                                                   | Seccion dominio                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- |
| BR-SOL-001 - Solicitudes de examen por alumno | FUNCTIONAL_SPECIFICATION.md · 2.9 Gestion de formacion teorica, bonos y solicitudes | DOMAIN_MODEL.md · 2.2 SolicitudExamen |
| BR-SOL-002 - Estado controlado de solicitudes | FUNCTIONAL_SPECIFICATION.md · 2.9 Gestion de formacion teorica, bonos y solicitudes | DOMAIN_MODEL.md · 2.2 SolicitudExamen |

---

## 11) Reglas futuras (BR-FUT)

| Regla BR                                       | Seccion funcional                                                                       | Seccion dominio                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| BR-FUT-001 - Pagos y facturacion               | FUNCTIONAL_SPECIFICATION.md · 6.1 Pagos y facturacion                                   | DOMAIN_MODEL.md · 5.1 Pago / 5.2 Factura / 7. No forma parte actual |
| BR-FUT-002 - Formacion teorica completa        | FUNCTIONAL_SPECIFICATION.md · 6.2 Formacion teorica                                     | DOMAIN_MODEL.md · 7. Que NO forma parte del dominio actual          |
| BR-FUT-003 - Roles de soporte y administrativo | FUNCTIONAL_SPECIFICATION.md · 6.3 Roles administrativos y de soporte                    | DOMAIN_MODEL.md · 5.3 Rol administrativo / soporte                  |
| BR-FUT-004 - Permisos granulares               | FUNCTIONAL_SPECIFICATION.md · 2.1 Capacidades futuras / 6.5 Reglas avanzadas de negocio | DOMAIN_MODEL.md · 7. Que NO forma parte del dominio actual          |
| BR-FUT-005 - Auditoria avanzada                | FUNCTIONAL_SPECIFICATION.md · 2.1 Capacidades futuras / 6.4 Auditoria y trazabilidad    | DOMAIN_MODEL.md · 7. Que NO forma parte del dominio actual          |
| BR-FUT-006 - Reglas avanzadas de negocio       | FUNCTIONAL_SPECIFICATION.md · 6.5 Reglas avanzadas de negocio                           | DOMAIN_MODEL.md · 7. Que NO forma parte del dominio actual          |

---

## 12) Mantenimiento del indice

Cuando se anadan nuevas reglas BR:

1. registrar la regla en `BUSINESS_RULES.md`
2. anadir fila en este indice
3. apuntar a seccion funcional real
4. apuntar a seccion de dominio real
5. marcar si es `Implementado`, `Parcial` o `Futuro` en la redaccion de origen
