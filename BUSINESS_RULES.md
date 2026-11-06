# BUSINESS_RULES.md

## Estado del documento

- ultima revision: 2026-11-03
- fuente principal: implementacion real (backend/frontend/prisma)
- alcance: reglas aplicadas actualmente + gaps identificados

---

# 1. Alcance actual del negocio

La plataforma cubre actualmente:

- ciclo de vida de alumno (matricula -> teoria -> practicas -> examen -> licencia)
- operativa academica (clases, hoja de ruta, convocatorias, evaluaciones)
- operativa economica (tarifas, pagos, facturas, bonos, promociones, nominas)
- soporte transversal (usuarios, roles, notificaciones, dashboard, informes)

---

# 2. Reglas de autenticacion y usuarios

## BR-AUTH-001 - Email unico

No pueden existir dos usuarios con el mismo email (`Usuario.email @unique`).

## BR-AUTH-002 - Password obligatoria

Todo usuario operativo requiere credenciales de acceso (`passwordHash`).

## BR-AUTH-003 - Login por credenciales

El acceso se realiza por email + password y emision de JWT.

## BR-AUTH-004 - JWT obligatorio en rutas protegidas

Cualquier endpoint protegido exige cabecera `Authorization: Bearer <token>`.

## BR-AUTH-005 - Control de permisos por rol

La autorizacion se aplica en backend con `authorize(...roles)` por endpoint.

## BR-AUTH-006 - Primer acceso con cambio obligatorio

Si `requiereCambioPassword = true`, el usuario solo puede acceder al flujo de cambio de password.

## BR-AUTH-007 - Activacion de cuenta

La activacion inicial usa token con expiracion y trazabilidad en `ActivacionCuenta`.

## BR-AUTH-008 - Reseteo administrativo auditado

Los reseteos ejecutados por soporte/admin quedan auditados en `PasswordResetAudit`.

## BR-AUTH-009 - Rol legado GESTOR

Cuando aparece `GESTOR`, se normaliza a `SOPORTE` para mantener compatibilidad.

---

# 3. Reglas de alumnos

## BR-ALU-001 - Relacion usuario-alumno obligatoria

Un alumno es una extension de `Usuario` (id compartido).

## BR-ALU-002 - Licencia objetivo obligatoria

El alumno opera siempre contra una licencia objetivo (`tipoLicenciaObjetivo`).

## BR-ALU-003 - Estado activo/inactivo

El alta logica se gestiona con `activo` (sin borrado fisico en flujo operativo).

## BR-ALU-004 - Profesor asignado opcional

La asignacion de profesor no es obligatoria en el alta de alumno.

## BR-ALU-005 - Expediente con fase persistida y fase calculada

El alumno mantiene `estadoExpediente` persistido y, adicionalmente, se calcula fase efectiva por reglas unificadas.

## BR-ALU-006 - Licencia obtenida

La obtencion de licencia puede quedar marcada por `licenciaObtenidaAt` y por resultados de evaluacion.

---

# 4. Reglas de profesores

## BR-PRO-001 - Relacion usuario-profesor obligatoria

Un profesor es una extension de `Usuario` (id compartido).

## BR-PRO-002 - Estado activo/inactivo

La disponibilidad operativa del profesor depende de `activo`.

## BR-PRO-003 - Licencias habilitadas por profesor

`permisosLicencias` define para que permisos puede impartir formacion/evaluacion.

## BR-PRO-004 - Historial de cambio de profesor en alumno

Los cambios de asignacion se registran en `AlumnoProfesorHistorial`.

## BR-PRO-005 - Horario de disponibilidad

La agenda base del profesor se modela por bloques en `ProfesorHorarioBloque`.

---

# 5. Reglas de vehiculos y combustible

## BR-VEH-001 - Matricula unica

No se admiten duplicados de matricula (`Vehiculo.matricula @unique`).

## BR-VEH-002 - Tipo de permiso obligatorio

Todo vehiculo debe indicar `tipoPermiso`.

## BR-VEH-003 - Estado activo/inactivo

Solo vehiculos activos deben ser seleccionables para clase/operativa.

## BR-VEH-004 - Imagen opcional

La imagen de vehiculo es opcional (`imagenRuta`) y se gestiona por upload.

## BR-VEH-005 - Registro de gasto de combustible

Cada gasto debe referenciar vehiculo y conservar datos de trazabilidad (factura, litros, precio, km, etc.).

---

# 6. Reglas de clases practicas y hoja de ruta

## BR-CLA-001 - Recursos obligatorios

Una clase practica requiere alumno, profesor y vehiculo validos.

## BR-CLA-002 - Fecha valida y coherente

La fecha de clase debe ser valida y compatible con reglas de disponibilidad.

## BR-CLA-003 - Tipo de clase practica

Se distingue `CIRCULACION` y `PISTA`; la validez depende de la licencia y fase del alumno.

## BR-CLA-004 - Gestion de cancelaciones

La cancelacion modifica estado de clase y puede impactar pagos relacionados (por ejemplo, pago pendiente cancelado).

## BR-CLA-005 - Hoja de ruta por clase

Cada clase puede tener una hoja de ruta unica con estado, ejercicios, km, combustible y faltas.

## BR-CLA-006 - Faltas catalogadas

Las faltas de hoja de ruta pueden vincularse a catalogo tipificado (`HojaRutaFaltaCatalogo`).

---

# 7. Reglas de examenes y solicitudes

## BR-EXA-001 - Examen ligado a alumno

Toda evaluacion formal (`Examen`) se registra contra un alumno.

## BR-SOL-001 - Tipos validos de solicitud

Solo se permiten solicitudes `TEORICO` o `PRACTICO`.

## BR-SOL-002 - Estados validos de solicitud

El servicio de solicitudes controla estados permitidos y transiciones validas.

## BR-SOL-003 - Evaluacion teorica y practica

La resolucion puede registrar:

- teoria: aciertos/errores
- practica: faltas leves/deficientes/eliminatorias y motivo de no apto

## BR-SOL-004 - Fase practica para licencias duales

En permisos duales se usa `fasePractica` para separar circulacion y pista.

## BR-SOL-005 - Consumo de convocatorias

Determinados estados finales consumen convocatorias asociadas al pago de examen.

## BR-SOL-006 - Reglas post no apto practico

Tras no apto practico pueden aplicarse clases adicionales requeridas por tipo de fase.

---

# 8. Reglas de expediente del alumno

## BR-EXP-001 - Catalogo unificado

El estado del expediente se resuelve con el catalogo definido en `ESTADOS_EXPEDIENTE.md`.

## BR-EXP-002 - Matricula como puerta de entrada

Si matricula no esta pagada, la fase efectiva es `PENDIENTE_MATRICULA`.

## BR-EXP-003 - Prioridad de resultados finales

Resultados finales (apto/no apto) prevalecen sobre estados intermedios para calcular fase.

## BR-EXP-004 - Compatibilidad legacy

Codigos legacy de expediente se normalizan para evitar incoherencias historicas.

---

# 9. Reglas de formacion teorica y DGT

## BR-TEO-001 - Temario por licencia

Cada tema declara las licencias objetivo aplicables.

## BR-TEO-002 - Progreso por alumno

El progreso se guarda por alumno/temario (`revisado`, `dominio`, `ultimaRevision`).

## BR-TEO-003 - Test de practica por tema

Cada intento de test se registra con resultado y metricas de acierto.

## BR-TEO-004 - Banco de preguntas DGT

Preguntas con respuestas asociadas, licencia aplicable y estado activo/inactivo.

## BR-TEO-005 - Examen DGT del alumno

Se almacena intento con total preguntas, aciertos, fallos y aprobado.

---

# 10. Reglas economicas (matriculas, pagos, facturas, bonos, promociones)

## BR-ECO-001 - Tarifa de matricula por licencia

Existe una tarifa base por licencia (`TarifaMatricula`).

## BR-ECO-002 - Tarifas por concepto

Se gestionan conceptos de cobro parametrizados por permiso y tipo de precio.

## BR-ECO-003 - Matricula pagable por admin o alumno propietario

El pago de matricula valida ownership/rol antes de confirmar estado.

## BR-ECO-004 - Pagos con ownership estricto del alumno

Un alumno solo puede consultar/pagar sus propios pagos.

## BR-ECO-005 - Factura asociada al pago

El pago genera/actualiza referencias de factura para consulta y descarga.

## BR-ECO-006 - Duplicados tecnicos y limpieza

Servicios economicos incluyen logica para mitigar duplicados tecnicos en pagos/facturas.

## BR-ECO-007 - Bonos y compras

La compra de bonos registra clases incluidas, consumo y vigencia.

## BR-ECO-008 - Promociones

Las promociones permiten precio promocional y reglas de aplicabilidad por licencia.

## BR-ECO-009 - Nominas por profesor

Nomina unica por profesor/mes con detalle de devengos y deducciones.

---

# 11. Reglas de notificaciones

## BR-NOT-001 - Notificacion por evento de negocio

Operaciones clave (pago, matricula, bono, etc.) pueden disparar notificaciones.

## BR-NOT-002 - Ciclo de vida de notificacion

Una notificacion puede marcarse como leida y/o archivada.

## BR-NOT-003 - Segmentacion por rol

Existe capacidad de emision para un rol objetivo (por ejemplo ADMIN o ADMINISTRATIVO).

---

# 12. Reglas de dashboard e informes

## BR-DASH-001 - Dashboards por rol

Cada rol consume endpoints y vistas de dashboard acordes a su operativa.

## BR-DASH-002 - Informes administrativos

Modulo de informes para agregados funcionales y soporte de gestion.

---

# 13. Reglas pendientes / futuras

## BR-GAP-001 - Convocatorias teoricas no expuestas en API principal

RESUELTA (2026-11-06): el modulo `convocatorias-teorico` ya esta montado en `app.js`
y expuesto en `/api/convocatorias-teorico`.

## BR-GAP-002 - Cobertura de test frontend parcial

EN PROGRESO (2026-11-06, FASE 7): cobertura funcional frontend ampliada en
`Temarios`, `TestDGT`, `Agendas`, `AccountActivation`, `Pagos`,
`Login`, `Dashboard`, `PagoMatricula`, `SolicitudesExamen`,
`Alumnos`, `Profesores`, `Clases`, `Facturas`, `Vehiculos`,
`Bonos`, `Promociones`, `TarifasMatricula`, `TarifasConcepto`,
`Notificaciones`, `Gastos`, `Nominas`, `OtrosUsuarios`, `Matriculas`,
`ProfesorAlumnos`, `ProfesorVehiculos`, `ProfesorAgenda`,
`ClasesPracticasProfesor`, `Examenes`, `ConvocatoriaExamen`,
`MisFacturas`, `Informes`, `DocumentosAlumno`, `NuevaLicencia`,
`ReservarClase`, `MisPagos`, `ExamenTeoricoAlumno`,
`ExamenPracticoAlumno`, `DocumentosAlumnoAdmin`, `ClasesDirecto`,
`ClasesDirectoAdmin`, `ClaseDirectoDetalle`, `FirstLoginPassword`
y `Facturas` (vista administrativa). En esta fase se incorpora además
`HojasRuta` con 10 escenarios prioritarios por rol y navegación.
Validacion tecnica de la fase: suite frontend en verde
(`45` archivos / `66` tests).
Permanece pendiente seguir extendiendo cobertura transversal al resto de modulos.

## BR-GAP-003 - Matriz documental de permisos fina

Permisos endpoint a endpoint existen en codigo, pero la matriz documental todavia debe profundizarse.

---

# 14. Conclusion

El nucleo de reglas de negocio esta implementado en modulos productivos,
con consistencia razonable entre modelo de datos, servicios y rutas.
Los gaps actuales son de cobertura documental/testing frontend,
no de ausencia total del dominio principal.
