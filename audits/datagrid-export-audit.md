# Auditoría DataGrid vs Exportaciones

Criterio: columnas visibles en DataGrid vs claves/cabeceras detectadas en utilidades de export Excel/PDF (heurístico automático).

| Página | Estado | Campos visibles | Utilidades export | Campos faltantes en export |
|---|---|---|---|---|
| frontend/src/pages/Alumnos/Alumnos.jsx | REVISAR | nombre, email, tipoLicenciaObjetivo, faseActual, horasPracticasCompletadas, profesorAsignado, telefono, activo, acciones | frontend/src/utils/exportAlumnosExcel.js<br>frontend/src/utils/exportAlumnosPdf.js | tipoLicenciaObjetivo, faseActual, horasPracticasCompletadas, profesorAsignado, telefono |
| frontend/src/pages/Bonos/Bonos.jsx | REVISAR | licencia, nombre, clasesIncluidas, precio, validezDias, descripcion, activo, acciones | frontend/src/utils/exportBonosTemplateExcel.js | descripcion, activo |
| frontend/src/pages/Clases/Clases.jsx | SIN_EXPORT_UTIL | alumno, profesor, vehiculo, licencia, tipoClasePractica, fecha, duracion, estado, acciones | - | - |
| frontend/src/pages/ConvocatoriaExamen/ConvocatoriaExamen.jsx | REVISAR | fecha, licencia, tipoExamen, activo, acciones, nombre, email, estado | frontend/src/utils/exportConvocatoriasTemplateExcel.js | nombre, email, estado |
| frontend/src/pages/DocumentosAlumno/DocumentosAlumno.jsx | SIN_EXPORT_UTIL | tipo, estado, createdAt, acciones | - | - |
| frontend/src/pages/DocumentosAlumno/DocumentosAlumnoAdmin.jsx | SIN_EXPORT_UTIL | alumno, tipo, estado, observaciones, archivos, createdAt, acciones | - | - |
| frontend/src/pages/Examenes/EvaluacionExamenPractico.jsx | SIN_EXPORT_UTIL | fechaConvocatoria, alumnoNombre, permisoLicencia, tipoPracticoLabel, estado, acciones | - | - |
| frontend/src/pages/Examenes/EvaluacionExamenTeorico.jsx | SIN_EXPORT_UTIL | fechaSolicitud, fechaConvocatoria, alumnoNombre, permisoLicencia, estado, acciones | - | - |
| frontend/src/pages/Examenes/Examenes.jsx | REVISAR | alumnoNombre, fechaSolicitud, fechaConvocatoria, permisoLicencia, tipo, estado, acciones | frontend/src/utils/exportExamenesExcel.js<br>frontend/src/utils/exportExamenesPdf.js | alumnoNombre, fechaSolicitud, fechaConvocatoria, permisoLicencia |
| frontend/src/pages/ExamenPracticoAlumno/ExamenPracticoAlumno.jsx | SIN_EXPORT_UTIL | fechaProgramada, tipoPractico, estado, faltas, acciones | - | - |
| frontend/src/pages/ExamenTeoricoAlumno/ExamenTeoricoAlumno.jsx | SIN_EXPORT_UTIL | fechaProgramada, estado, erroresExamen, fechaSolicitud | - | - |
| frontend/src/pages/Facturas/Facturas.jsx | SIN_EXPORT_UTIL | numero, alumno, concepto, baseImponible, descuento, total, estado, fechaEmision, acciones | - | - |
| frontend/src/pages/Facturas/IngresosFacturas.jsx | REVISAR | numero, alumno, licencia, tipoClasePractica, origen, concepto, baseImponible, descuento, total, estado, fechaEmision, fechaPago, acciones | frontend/src/utils/exportIngresosExcel.js<br>frontend/src/utils/exportIngresosPdf.js | numero, tipoClasePractica, baseImponible, total, fechaEmision |
| frontend/src/pages/Facturas/MisFacturas.jsx | REVISAR | numero, licencia, origen, concepto, baseImponible, descuento, total, estado, fechaEmision, fechaPago, acciones | frontend/src/utils/exportIngresosExcel.js<br>frontend/src/utils/exportIngresosPdf.js | numero, baseImponible, total, fechaEmision |
| frontend/src/pages/Gastos/Gastos.jsx | REVISAR | numeroFactura, tipo, vehiculo, combustibleAntesPct, combustibleDespuesPct, litrosRepostados, precioLitro, total, createdAt, rutaRecibo, profesorNombre | frontend/src/utils/exportGastosExcel.js<br>frontend/src/utils/exportGastosPdf.js | tipo, vehiculo, combustibleAntesPct, combustibleDespuesPct, litrosRepostados, precioLitro, createdAt, rutaRecibo, profesorNombre |
| frontend/src/pages/HojasRuta/HojasRuta.jsx | REVISAR | fecha, duracion, tipoClasePractica, vehiculo, faltasResumen, estado, acciones, alumnoNombre, total, pendientes, enCurso, registradas, canceladas, profesorNombre | frontend/src/utils/exportHojasRutaProfesoresExcel.js<br>frontend/src/utils/exportHojasRutaProfesoresPdf.js<br>frontend/src/utils/exportHojasRutaAlumnosProfesorExcel.js<br>frontend/src/utils/exportHojasRutaAlumnosProfesorPdf.js<br>frontend/src/utils/exportHojasRutaAlumnoDetalleExcel.js<br>frontend/src/utils/exportHojasRutaAlumnoDetallePdf.js | duracion, tipoClasePractica, faltasResumen, alumnoNombre, profesorNombre |
| frontend/src/pages/Informes/Informes.jsx | OK | tipo, concepto, categoria, fecha, estado, importe, acciones | frontend/src/utils/exportInformesExcel.js<br>frontend/src/utils/exportInformesPdf.js | - |
| frontend/src/pages/Matriculas/Matriculas.jsx | SIN_EXPORT_UTIL | alumno, licencia, precioBase, precioFinal, promocion, descuento, estado, fechaPago, acciones, createdAt | - | - |
| frontend/src/pages/Nominas/Nominas.jsx | REVISAR | numero, profesor, periodo, importe, acciones, anio | frontend/src/utils/exportNominasExcel.js<br>frontend/src/utils/exportNominasPdf.js | numero, periodo, anio |
| frontend/src/pages/OtrosUsuarios/OtrosUsuarios.jsx | REVISAR | nombre, email, rol, dni, telefono, activo, acciones | frontend/src/utils/exportOtrosUsuariosExcel.js<br>frontend/src/utils/exportOtrosUsuariosPdf.js | rol |
| frontend/src/pages/Pagos/MisPagos.jsx | SIN_EXPORT_UTIL | numeroFacturaPago, concepto, permiso, importe, estado, fechaPago, acciones | - | - |
| frontend/src/pages/Pagos/Pagos.jsx | SIN_EXPORT_UTIL | alumno, concepto, permiso, importe, estado, convocatorias, fechaPago | - | - |
| frontend/src/pages/ProfesorAlumnos/ProfesorAlumnos.jsx | REVISAR | nombre, email, tipoLicenciaObjetivo, estadoAlumno, clasesRealizadas, horasPracticasTexto, fecha, accion, categoria, resumen, detalle | frontend/src/utils/exportProfesorAlumnosExcel.js<br>frontend/src/utils/exportProfesorAlumnosPdf.js | nombre, tipoLicenciaObjetivo, estadoAlumno, clasesRealizadas, horasPracticasTexto, fecha, accion, categoria, resumen, detalle |
| frontend/src/pages/Profesores/Profesores copy.jsx | REVISAR | nombre, email, permisosLicencias, telefono, activo, acciones | frontend/src/utils/exportProfesoresExcel.js<br>frontend/src/utils/exportProfesoresPdf.js | permisosLicencias |
| frontend/src/pages/Profesores/Profesores.jsx | REVISAR | nombre, email, permisosLicencias, telefono, activo, acciones, licencia, estadoExpedienteLabel | frontend/src/utils/exportProfesoresExcel.js<br>frontend/src/utils/exportProfesoresPdf.js | permisosLicencias, licencia, estadoExpedienteLabel |
| frontend/src/pages/ProfesorVehiculos/ProfesorVehiculos.jsx | SIN_EXPORT_UTIL | matricula, marca, modelo, tipoPermiso, numeroClasesRealizadas, kmActuales, fechaUltimaItv, itvPendiente, combustibleActualPct, activo, acciones | - | - |
| frontend/src/pages/Promociones/Promociones.jsx | REVISAR | licenciasAplicables, nombre, reglas, precioOriginal, precioPromocional, descuento, vigencia, activa, acciones | frontend/src/utils/exportPromocionesTemplateExcel.js | licenciasAplicables, reglas, descuento, vigencia, activa |
| frontend/src/pages/SolicitudesExamen/SolicitudesExamen.jsx | SIN_EXPORT_UTIL | alumno, tipo, estado, fechaSolicitud, fechaProgramada, observaciones, acciones | - | - |
| frontend/src/pages/TarifasConcepto/TarifasConcepto.jsx | REVISAR | permiso, concepto, precio, tipo, descripcion, activa, acciones | frontend/src/utils/exportTarifasConceptoExcel.js<br>frontend/src/utils/exportTarifasConceptoPdf.js<br>frontend/src/utils/exportTarifasConceptoTemplateExcel.js | descripcion, activa |
| frontend/src/pages/TarifasMatricula/TarifasMatricula.jsx | OK | licencia, precio, activa, acciones | frontend/src/utils/exportTarifasMatriculaTemplateExcel.js | - |
| frontend/src/pages/Temarios/Temarios.jsx | SIN_EXPORT_UTIL | titulo, tipoLicenciaObjetivo, orden, descripcion, acciones | - | - |
| frontend/src/pages/TestDGT/TestDGTAdmin.jsx | REVISAR | id, enunciado, licencia, activa, acciones | frontend/src/utils/exportPreguntasDGTTemplateExcel.js | licencia, activa |
| frontend/src/pages/Vehiculos/Vehiculos.jsx | REVISAR | matricula, marca, modelo, tipoPermiso, numeroClasesRealizadas, kmActuales, fechaUltimaItv, itvPendiente, combustibleActualPct, activo, acciones | frontend/src/utils/exportVehiculosExcel.js<br>frontend/src/utils/exportVehiculosPdf.js<br>frontend/src/utils/exportVehiculosTemplateExcel.js | numeroClasesRealizadas, kmActuales, itvPendiente, combustibleActualPct |

## Notas

- La columna `acciones` se excluye de la comparación por ser operativa (no exportable).
- Si una página tiene estado `REVISAR`, conviene alinear cabeceras y orden con su DataGrid.
