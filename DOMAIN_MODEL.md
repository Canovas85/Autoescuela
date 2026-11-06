# DOMAIN_MODEL.md

## Estado del documento

- ultima revision: 2026-11-03
- fuente principal: `backend/prisma/schema.prisma` + servicios/rutas activas

---

# 1. Contexto del negocio actual

El dominio modela la gestion integral de una autoescuela en una sola organizacion:

- identidad y roles
- operacion academica (teoria, practicas, examenes)
- operacion economica (matriculas, pagos, facturas, bonos, promociones)
- soporte operativo (notificaciones, dashboards, informes, nominas)

---

# 2. Dominio actual

## 2.1 Identidad y acceso

### Usuario

Entidad raiz de identidad.

**Atributos principales**

- `id`, `nombre`, `email`, `passwordHash`
- `rol` (`ADMIN`, `ADMINISTRATIVO`, `SOPORTE`, `PROFESOR`, `ALUMNO`)
- `activo`, `requiereCambioPassword`
- `telefono`, `dni`

**Relaciones**

- 1:1 opcional con `Alumno`
- 1:1 opcional con `Profesor`
- 1:N con `ActivacionCuenta`
- 1:N con `Notificacion`
- 1:N con `PasswordResetAudit` (actor y objetivo)

### ActivacionCuenta

Tokenizacion de activacion inicial y trazabilidad de reenvios/expiracion.

### PasswordResetAudit

Auditoria del reseteo de password ejecutado por soporte/admin.

---

## 2.2 Gestion academica

### Alumno

Representa al usuario en formacion.

**Atributos principales**

- `tipoLicenciaObjetivo`
- `estadoExpediente`
- `horasPracticasCompletadas`
- `profesorAsignadoId` (opcional)
- `licenciaObtenidaAt` (opcional)
- `activo`

**Relaciones**

- `Profesor` asignado (opcional)
- `ClasePractica[]`
- `SolicitudExamen[]`
- `Examen[]`
- `TemarioProgreso[]`
- `TestPractica[]`
- `ExamenDGTAlumno[]`
- `DocumentoAlumno[]`
- `HojaRuta[]`
- `Matricula[]`, `Pago[]`, `Factura[]`
- `CompraBono[]`
- `AlumnoProfesorHistorial[]`

### Profesor

Actor docente y operativo.

**Atributos principales**

- `licenciaConducir`
- `permisosLicencias[]`
- `salarioBaseMensual`
- `activo`, `fechaAlta`, `fechaBaja`

**Relaciones**

- `alumnosAsignados[]`
- `clases[]`, `clasesDirecto[]`
- `hojasRuta[]`
- `gastosCombustible[]`
- `nominas[]`
- `horarioBloques[]`
- `solicitudesResueltas[]`

### Vehiculo

Recurso operativo para clases y gastos.

**Atributos principales**

- `matricula` (unica)
- `tipoPermiso`
- `kmActuales`, `combustibleActualPct`
- `imagenRuta` (opcional)
- `activo`

**Relaciones**

- `ClasePractica[]`
- `GastoCombustible[]`

### ClasePractica

Unidad operativa de practicas.

**Atributos principales**

- `tipoClasePractica` (`CIRCULACION` / `PISTA`)
- `fecha`, `duracion`
- `estado`
- `metodoPago`
- `canceladaPor`, `canceladaConPenalizacion`

**Relaciones**

- N:1 con `Alumno`, `Profesor`, `Vehiculo`
- N:1 opcional con `CompraBono`
- 1:N con `Pago[]`, `Factura[]`
- 1:1 opcional con `HojaRuta`

### HojaRuta

Seguimiento detallado de sesion practica.

**Atributos principales**

- `estado`
- `ejerciciosRealizados[]`
- `observacionesProfesor`
- `kilometrosInicio/Fin`
- `combustibleInicioPct/FinPct`
- `finalizedAt`

**Relaciones**

- 1:1 con `ClasePractica`
- N:1 con `Profesor`, `Alumno`
- 1:N con `HojaRutaFalta`

### HojaRutaFalta / HojaRutaFaltaCatalogo

Modelo de faltas observadas y catalogo tipificado.

---

## 2.3 Evaluacion y examen

### SolicitudExamen

Solicitud operativa de presentacion a examen.

**Atributos principales**

- `tipo` (`TEORICO` / `PRACTICO`)
- `fasePractica` (cuando aplica)
- `estado`
- `fechaSolicitud`, `fechaProgramada`, `fechaResolucion`
- metricas de evaluacion (aciertos/errores/faltas y detalles)
- `motivoNoApto`, `observaciones`

**Relaciones**

- N:1 con `Alumno`
- N:1 opcional con `Profesor` resolutor
- N:1 opcional con `Pago` de gasto practico

### Examen

Registro formal de resultado por alumno (teorico/practico).

### ConvocatoriaExamen

Calendario de convocatorias por fecha/licencia/tipo.

### ExamenDGTAlumno

Intentos de examen DGT (preguntas, aciertos, fallos, aprobado).

---

## 2.4 Formacion teorica

### Temario

Tema formativo por licencia objetivo.

### TemarioProgreso

Estado de avance de un alumno en un tema.

### TestPractica

Resultado de intento de test por alumno (y opcionalmente por tema).

### PreguntaDGT / RespuestaPreguntaDGT

Banco de preguntas y respuestas para modulo DGT.

### ClaseDirecto

Contenido formativo en directo o video asociado a profesor/licencia.

---

## 2.5 Economico y administrativo

### Matricula

Proceso economico de alta academica.

**Atributos principales**

- `licencia`
- `precioBase`, `precioFinal`
- `estado` (ej. `PENDIENTE`, `PAGADA`, `ANULADA`)
- `fechaPago`

**Relaciones**

- N:1 con `Alumno`
- N:1 opcional con `Promocion`
- 1:N con `Pago`, `Factura`, `MatriculaConcepto`

### Pago

Movimiento economico granular.

**Atributos principales**

- `tipo`, `concepto`, `permiso`, `importe`, `estado`
- `convocatoriasIncluidas`, `convocatoriasConsumidas`
- `numeroFacturaPago`

**Relaciones**

- N:1 con `Alumno`
- N:1 opcional con `Matricula`, `CompraBono`, `ClasePractica`

### Factura

Documento de facturacion por concepto.

**Atributos principales**

- `numero` (unico)
- `concepto`, `baseImponible`, `descuento`, `total`
- `estado`, `fechaEmision`, `fechaPago`

**Relaciones**

- referencias opcionales a `Alumno`, `Matricula`, `CompraBono`, `ClasePractica`

### Bono / CompraBono

Catalogo de bonos y compra efectiva por alumno con consumo de clases y vigencia.

### Promocion

Regla de precio promocional y condiciones de aplicabilidad por licencia.

### TarifaMatricula

Precio de matricula por licencia.

### TarifaConcepto / TarifaConceptoHistorial

Catalogo de conceptos tarifarios y trazabilidad de cambios.

### MatriculaConcepto

Linea de detalle de conceptos aplicados a una matricula.

### GastoCombustible

Registro de repostajes y consumo para control operativo.

### Nomina

Liquidacion mensual por profesor con devengos y deducciones.

---

## 2.6 Comunicacion y soporte

### Notificacion

Entidad de comunicacion interna por usuario/evento:

- `tipo`, `titulo`, `mensaje`, `metadata`
- `leida`, `archivada`, `readAt`, `archivedAt`

---

# 3. Relaciones principales del dominio

1. `Usuario` es entidad madre de identidad.
2. `Alumno` y `Profesor` especializan al usuario por rol operativo.
3. El eje academico del alumno conecta con:
   - `TemarioProgreso`, `TestPractica`, `ExamenDGTAlumno`
   - `ClasePractica`, `HojaRuta`, `SolicitudExamen`, `Examen`
4. El eje economico conecta con:
   - `Matricula`, `Pago`, `Factura`, `CompraBono`
5. `Promocion` y `Tarifa*` parametrizan precio/condiciones.
6. `Notificacion` atraviesa el dominio como soporte de eventos.

---

# 4. Modelo de estados real del sistema

Estados representativos observados:

- usuario/profesor/alumno/vehiculo: `activo` boolean
- matricula: `PENDIENTE`, `PAGADA`, `ANULADA` (segun flujo)
- pago: `PENDIENTE`, `PAGADO`, `CANCELADO`
- factura: `EMITIDA`, `PAGADA`, `ANULADA`
- solicitud examen: estados controlados en servicio (solicitado/programado/finales)
- expediente alumno: catalogo unificado en `ESTADOS_EXPEDIENTE.md`

---

# 5. Entidades/procesos tecnicos de soporte

Existen tablas para procesos batch de evaluacion:

- `PracticalExamProcessBatch` y relacionadas
- `TheoreticalExamProcessBatch` y relacionadas

Estas entidades dan soporte a ejecuciones masivas, reversibilidad y auditoria tecnica.

---

# 6. Huecos y consideraciones actuales

1. RESUELTO (2026-11-06): `convocatorias-teorico` ya esta montado en `app.js` y expuesto en `/api/convocatorias-teorico`.
2. El modelo contempla granularidad alta en pagos/facturas; la documentacion funcional debe mantenerse alineada para evitar divergencias.
3. La base de datos ya contempla suficiente estructura para evolucionar a reglas mas complejas sin romper el nucleo actual.
4. ACTUALIZADO (2026-11-06): la cobertura de tests frontend se amplio a `temarios`, `test-dgt`, `agendas`, `account-activation`, `pagos`, `login`, `dashboard`, `pago-matricula` y `solicitudes-examen`, aunque sigue siendo parcial respecto al total funcional.

---

# 7. Conclusion

El modelo de dominio actual es amplio y coherente con la operativa principal de autoescuela.
Integra identidad, formacion, examen, economia y soporte con relaciones explicitas
y una base consistente para escalar funcionalmente en siguientes iteraciones.
