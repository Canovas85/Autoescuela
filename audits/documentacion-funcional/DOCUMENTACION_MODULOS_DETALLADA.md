# DOCUMENTACION FUNCIONAL POR MODULOS

## 1. Alcance de esta fase

Documento de contraste funcional modulo a modulo con base en:

- rutas backend activas
- servicios de negocio implementados
- pantallas frontend disponibles
- modelo Prisma

Fecha de actualizacion: 2026-11-03.

---

## 2. Base operativa del sistema

### 2.1 Rutas y modulos principales (backend montado en app.js)

`auth`, `alumnos`, `profesores`, `vehiculos`, `clases`, `examenes`,
`dashboard`, `temarios`, `bonos`, `matriculas`, `tarifas-matricula`,
`tarifas-concepto`, `promociones`, `solicitudes-examen`, `clases-directo`,
`facturas`, `pagos`, `preguntas-dgt`, `documentos-alumno`,
`convocatorias-examen`, `notificaciones`, `hojas-ruta`,
`gastos-combustible`, `informes`, `otros-usuarios`, `nominas`.

### 2.2 Roles reales verificados

- ADMIN
- ADMINISTRATIVO
- SOPORTE (incluye normalizacion desde GESTOR)
- PROFESOR
- ALUMNO

---

## 3. Modulo 1: Autenticacion y acceso

### 3.1 Alcance funcional

- login y validacion de credenciales
- activacion de cuenta por token
- primer acceso con cambio obligatorio de password
- endpoint `me` y control de sesion JWT

### 3.2 Evidencia tecnica

- backend: `features/auth/*`
- middleware: `shared/middleware/auth.middleware.js`, `role.middleware.js`
- frontend: `pages/Login/*`, `routes/AppRouter.jsx`

### 3.3 Estado funcional

**Implementado y operativo.**

---

## 4. Modulo 2: Dashboard y paneles por perfil

### 4.1 Alcance funcional

- dashboard segmentado por rol
- resumenes para admin/administrativo/profesor/alumno/soporte

### 4.2 Evidencia tecnica

- backend: `features/dashboard/*`
- frontend: `pages/Dashboard/*`, menu de `Sidebar.jsx`

### 4.3 Estado funcional

**Implementado y operativo.**

---

## 5. Modulo 3: Alumnos

### 5.1 Alcance funcional

- alta, consulta, edicion, baja logica y cambios de estado
- asignacion de profesor
- seguimiento de expediente

### 5.2 Evidencia tecnica

- backend: `features/alumnos/*`
- frontend: `pages/Alumnos/Alumnos.jsx`, servicios asociados
- modelo: `Alumno`, `AlumnoProfesorHistorial`

### 5.3 Estado funcional

**Implementado y operativo.**

---

## 6. Modulo 4: Profesores

### 6.1 Alcance funcional

- gestion de datos, estado y licencias habilitadas
- vinculacion con alumnos, clases y nominas

### 6.2 Evidencia tecnica

- backend: `features/profesores/*`
- frontend: `pages/Profesores/Profesores.jsx`, `pages/ProfesorAlumnos/*`
- modelo: `Profesor`, `ProfesorHorarioBloque`

### 6.3 Estado funcional

**Implementado y operativo.**

---

## 7. Modulo 5: Vehiculos y gastos

### 7.1 Alcance funcional

- gestion de vehiculos con imagen opcional
- control de estado de flota
- registro de gastos de combustible

### 7.2 Evidencia tecnica

- backend: `features/vehiculos/*`, `features/gastos-combustible/*`
- frontend: `pages/Vehiculos/*`, `pages/Gastos/*`, `pages/ProfesorVehiculos/*`
- modelo: `Vehiculo`, `GastoCombustible`

### 7.3 Estado funcional

**Implementado y operativo.**

---

## 8. Modulo 6: Clases practicas, reservas y agenda

### 8.1 Alcance funcional

- planificacion/edicion/cancelacion de clases
- reserva por alumno
- agenda de profesor
- reglas de disponibilidad y estado

### 8.2 Evidencia tecnica

- backend: `features/clases/*`
- frontend: `pages/Clases/*`, `pages/ReservarClase/*`,
  `pages/ProfesorAgenda/*`, `pages/ClasesPracticasProfesor/*`
- modelo: `ClasePractica`

### 8.3 Estado funcional

**Implementado y operativo.**

---

## 9. Modulo 7: Hojas de ruta

### 9.1 Alcance funcional

- registro de observaciones por clase
- kilometraje, combustible y ejercicios
- gestion de faltas y catalogo de faltas

### 9.2 Evidencia tecnica

- backend: `features/hojas-ruta/*`
- frontend: `pages/HojasRuta/*`
- modelo: `HojaRuta`, `HojaRutaFalta`, `HojaRutaFaltaCatalogo`

### 9.3 Estado funcional

**Implementado y operativo.**

---

## 10. Modulo 8: Temario, clases en directo y test DGT

### 10.1 Alcance funcional

- mantenimiento de temarios
- visualizacion de contenido teorico por alumno
- progreso por tema
- banco de preguntas DGT y registro de intentos
- clases en directo y visualizacion de detalle

### 10.2 Evidencia tecnica

- backend: `features/temarios/*`, `features/preguntas-dgt/*`, `features/clases-directo/*`
- frontend: `pages/Temarios/*`, `pages/TestDGT/*`, `pages/ClasesDirecto/*`
- modelo: `Temario`, `TemarioProgreso`, `TestPractica`, `PreguntaDGT`, `ExamenDGTAlumno`

### 10.3 Estado funcional

**Implementado y operativo.**

---

## 11. Modulo 9: Examenes, convocatorias y solicitudes

### 11.1 Alcance funcional

- mantenimiento de examenes
- convocatorias por licencia y tipo
- solicitudes de examen teorico/practico
- evaluacion y resolucion con metrica de faltas
- fases practicas por licencia dual

### 11.2 Evidencia tecnica

- backend: `features/examenes/*`, `features/convocatorias-examen/*`, `features/solicitudes-examen/*`
- frontend: `pages/Examenes/*`, `pages/ConvocatoriaExamen/*`, `pages/SolicitudesExamen/*`, `pages/ExamenTeoricoAlumno/*`, `pages/ExamenPracticoAlumno/*`
- modelo: `Examen`, `ConvocatoriaExamen`, `SolicitudExamen`

### 11.3 Observacion de alcance

`convocatorias-teorico` ya esta montado en API principal (`app.js`) y operativo en
`/api/convocatorias-teorico`.

### 11.4 Estado funcional

**Implementado y operativo en API principal.**

---

## 12. Modulo 10: Financiero y administrativo

### 12.1 Alcance funcional

- tarifas de matricula y por concepto
- promociones y bonos
- matriculas y pagos
- facturacion (incluido PDF y duplicados)
- nominas
- informes

### 12.2 Evidencia tecnica

- backend: `features/tarifas-*`, `promociones`, `bonos`, `matriculas`, `pagos`, `facturas`, `nominas`, `informes`
- frontend: `pages/Tarifas*`, `Promociones`, `Bonos`, `Matriculas`, `Pagos`, `Facturas`, `Nominas`, `Informes`
- modelo: `TarifaMatricula`, `TarifaConcepto`, `Matricula`, `Pago`, `Factura`, `Nomina`, `Promocion`, `Bono`, `CompraBono`

### 12.3 Estado funcional

**Implementado y operativo.**

---

## 13. Modulo 11: Notificaciones y soporte

### 13.1 Alcance funcional

- notificaciones por eventos de negocio
- marcado de lectura y archivado
- stream de notificaciones
- gestion de usuarios operativos para soporte/admin

### 13.2 Evidencia tecnica

- backend: `features/notificaciones/*`, `features/otros-usuarios/*`
- frontend: `pages/Notificaciones/*`, `pages/OtrosUsuarios/*`
- modelo: `Notificacion`, `PasswordResetAudit`

### 13.3 Estado funcional

**Implementado y operativo.**

---

## 14. Modulo 12: Documentacion del alumno

### 14.1 Alcance funcional

- gestion de documentos del alumno
- subida/consulta/actualizacion y activacion logica
- vista para alumno y vista administrativa

### 14.2 Evidencia tecnica

- backend: `features/documentos-alumno/*`
- frontend: `pages/DocumentosAlumno/*`
- modelo: `DocumentoAlumno`, `DocumentoAlumnoArchivo`

### 14.3 Estado funcional

**Implementado y operativo.**

---

## 15. Conclusion de estado modular

La cobertura funcional es alta en backend y significativa en frontend.
El sistema esta operativo en los modulos nucleares academicos, economicos y de soporte.
Los gaps principales son:

1. mantener sincronia documental continua tras cierres de gaps funcionales
2. reforzar escenarios de regresion avanzada en modulos de alta complejidad operativa
