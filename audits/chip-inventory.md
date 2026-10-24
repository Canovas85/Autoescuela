# Inventario de Chips

Total ocurrencias detectadas: 283

## Componentes compartidos

- frontend/src/components/common/LicenseChip.jsx
- frontend/src/components/common/ExamTypeChip.jsx

## Uso por archivo

### frontend/src/components/agenda/ReadOnlyWeeklyAgendaBoard.jsx

- L16: import { LicenseChip } from "../common/LicenseChip";
- L203: <LicenseChip
- L244: <Chip
- L274: <Chip size="small" label="Sin datos" variant="outlined" />
- L279: <Chip

### frontend/src/components/common/ExamTypeChip.jsx

- L2: import { getExamTypeChipPalette } from "../../theme/chipPalette";
- L9: export function ExamTypeChip({ value, size = "small" }) {
- L12: const palette = getExamTypeChipPalette(key);
- L15: <Chip

### frontend/src/components/common/ExpedientePhaseChip.jsx

- L7: return <Chip size={size} label={meta.label} sx={meta.sx} />;

### frontend/src/components/common/LicenseChip.jsx

- L2: import { getLicenseChipPalette } from "../../theme/chipPalette";
- L4: export function LicenseChip({ value, size = "small" }) {
- L6: const style = getLicenseChipPalette(label);
- L15: <Chip
- L44: export function LicenseChipList({ values }) {
- L66: <LicenseChip key={`${item}-${index}`} value={item} />

### frontend/src/components/common/PracticalClassTypeChip.jsx

- L37: <Chip

### frontend/src/components/common/StatusChip.jsx

- L10: <Chip

### frontend/src/components/layout/Sidebar.jsx

- L760: <Chip
- L795: <Chip

### frontend/src/components/matricula/AccesoRestringidoMatricula.jsx

- L59: <Chip label={`Permiso ${matricula?.licencia}`} color="primary" />
- L61: <Chip label={matricula?.estado} color="warning" />

### frontend/src/pages/Alumnos/Alumnos.jsx

- L48: import { LicenseChip } from "../../components/common/LicenseChip";
- L674: <LicenseChip value={params.row.tipoLicenciaObjetivo} />
- L742: <Chip
- L1758: <Chip
- L1945: <Chip
- L2114: <Chip
- L2177: <Chip

### frontend/src/pages/Bonos/Bonos.jsx

- L37: import { LicenseChip } from "../../components/common/LicenseChip";
- L524: renderCell: (params) => <LicenseChip value={params.value} />,
- L735: <Chip

### frontend/src/pages/Clases/Clases.jsx

- L30: import { LicenseChip } from "../../components/common/LicenseChip";
- L204: <LicenseChip value={params.row.vehiculo?.tipoPermiso || "-"} />
- L228: <Chip

### frontend/src/pages/ClasesDirecto/ClaseDirectoDetalle.jsx

- L99: <Chip label="Clase grabada" color="primary" variant="outlined" />
- L272: <Chip

### frontend/src/pages/ClasesPracticasProfesor/ClasesPracticasProfesor.jsx

- L20: import { LicenseChip } from "../../components/common/LicenseChip";
- L258: <LicenseChip value={item.vehiculo?.tipoPermiso || "-"} />
- L358: <Chip
- L376: <LicenseChip value={item.vehiculo?.tipoPermiso || "-"} />
- L515: <LicenseChip
- L528: <Chip

### frontend/src/pages/ConvocatoriaExamen/ConvocatoriaExamen.jsx

- L30: import { LicenseChip } from "../../components/common/LicenseChip";
- L31: import { ExamTypeChip } from "../../components/common/ExamTypeChip";
- L544: renderCell: (params) => <LicenseChip value={params.value} />,
- L550: renderCell: (params) => <ExamTypeChip value={params.value} />,
- L616: renderCell: (params) => <LicenseChip value={params.value} />,
- L622: renderCell: (params) => <ExamTypeChip value={params.value} />,
- L899: <ExamTypeChip value={item.tipoExamen} size="small" />
- L900: <LicenseChip value={item.licencia} size="small" />

### frontend/src/pages/Dashboard/Dashboard.jsx

- L48: import { LicenseChip } from "../../components/common/LicenseChip";
- L437: <Chip
- L515: <Chip
- L598: <LicenseChip value={student.licencia} />
- L676: <LicenseChip value={profesor.licencia} />
- L763: <LicenseChip
- L860: <LicenseChip value={bono.licencia} />
- L985: <Chip

### frontend/src/pages/Dashboard/ProfessorDashboard.jsx

- L28: import { LicenseChip } from "../../components/common/LicenseChip";
- L120: <Chip
- L403: <LicenseChip value={alumno.tipoLicenciaObjetivo} />
- L460: <Chip
- L527: <LicenseChip
- L534: <Chip
- L595: <LicenseChip
- L603: <Chip
- L618: <Chip
- L633: <Chip
- L648: <Chip
- L771: <Chip
- L822: <Chip
- L884: <Chip
- L923: <Chip
- L932: <Chip
- L941: <Chip

### frontend/src/pages/Dashboard/StudentDashboard.jsx

- L42: import { LicenseChip } from "../../components/common/LicenseChip";
- L194: <Chip
- L410: <Chip
- L626: <Chip
- L641: <Chip
- L650: <Chip
- L735: <Chip
- L740: <Chip
- L956: <Chip label="Preparado" color="success" size="small" />
- L958: <Chip
- L1037: <Chip
- L1047: <Chip
- L1054: <Chip
- L1071: <Chip key={temario} label={temario} variant="outlined" />
- L1168: <Chip label="Revisado" color="success" size="small" />
- L1411: <LicenseChip
- L1816: <Chip

### frontend/src/pages/DocumentosAlumno/DocumentosAlumno.jsx

- L199: <Chip

### frontend/src/pages/DocumentosAlumno/DocumentosAlumnoAdmin.jsx

- L148: <Chip

### frontend/src/pages/Examenes/EvaluacionExamenPractico.jsx

- L25: import { LicenseChip } from "../../components/common/LicenseChip";
- L94: renderCell: (params) => <LicenseChip value={params.value} />,
- L107: <Chip

### frontend/src/pages/Examenes/EvaluacionExamenTeorico.jsx

- L18: import { LicenseChip } from "../../components/common/LicenseChip";
- L98: renderCell: (params) => <LicenseChip value={params.value} />,
- L105: <Chip

### frontend/src/pages/Examenes/Examenes.jsx

- L29: import { LicenseChip } from "../../components/common/LicenseChip";
- L30: import { ExamTypeChip } from "../../components/common/ExamTypeChip";
- L193: renderCell: (params) => <LicenseChip value={params.value} />,
- L199: renderCell: (params) => <ExamTypeChip value={params.value} />,
- L206: <Chip
- L499: <LicenseChip value={selectedRow.permisoLicencia} />
- L505: <Chip
- L587: <Chip
- L632: <Chip
- L642: <Chip
- L652: <Chip
- L669: <Chip
- L679: <Chip

### frontend/src/pages/ExamenPracticoAlumno/ExamenPracticoAlumno.jsx

- L265: <Chip
- L337: <Chip
- L347: <Chip
- L357: <Chip
- L363: <Chip
- L375: <Chip
- L384: <Chip

### frontend/src/pages/ExamenTeoricoAlumno/ExamenTeoricoAlumno.jsx

- L190: return <Chip size="small" label={params.value} color={color} />;
- L305: <Chip
- L315: <Chip
- L325: <Chip
- L333: <Chip

### frontend/src/pages/Facturas/Facturas.jsx

- L25: import { LicenseChip } from "../../components/common/LicenseChip";
- L229: <Chip
- L296: <Chip
- L305: <Chip
- L314: <Chip
- L458: <LicenseChip value={selectedFactura.licencia} />

### frontend/src/pages/Facturas/IngresosFacturas.jsx

- L32: import { LicenseChip } from "../../components/common/LicenseChip";
- L535: <LicenseChip value={getRowLicencia(params.row)} />
- L593: <Chip
- L667: <Chip
- L783: <Chip
- L793: <Chip
- L803: <Chip
- L1052: <LicenseChip value={selectedFactura.licencia} />

### frontend/src/pages/Facturas/MisFacturas.jsx

- L25: import { LicenseChip } from "../../components/common/LicenseChip";
- L447: <LicenseChip value={getRowLicencia(params.row)} />
- L479: <Chip size="small" label={origen} color={color} variant="outlined" />
- L517: <Chip
- L608: <Chip
- L618: <Chip
- L628: <Chip
- L638: <Chip
- L648: <Chip
- L883: <LicenseChip value={selectedFactura.licencia} />

### frontend/src/pages/Gastos/Gastos.jsx

- L164: <Chip

### frontend/src/pages/HojasRuta/HojasRuta.jsx

- L409: <Chip
- L738: <Chip
- L1013: <Chip
- L1248: <Chip
- L2049: <Chip
- L2158: <Chip
- L2350: <Chip
- L2366: <Chip
- L2714: <Chip
- L2720: <Chip size="small" color="success" label="Registrada" />

### frontend/src/pages/Informes/Informes.jsx

- L799: <Chip

### frontend/src/pages/Login/Login.jsx

- L461: <Chip label={`🔥 ${descuento}% DTO`} color="error" />

### frontend/src/pages/Matriculas/Matriculas.jsx

- L17: import { LicenseChip } from "../../components/common/LicenseChip";
- L129: renderCell: (params) => <LicenseChip value={params.value} />,
- L166: <Chip
- L172: <Chip label="Sin promoción" size="small" />
- L190: <Chip
- L293: <Chip
- L302: <Chip
- L311: <Chip

### frontend/src/pages/Notificaciones/Notificaciones.jsx

- L291: <Chip
- L310: <Chip

### frontend/src/pages/NuevaLicencia/NuevaLicencia.jsx

- L27: import { LicenseChip } from "../../components/common/LicenseChip";
- L327: <Chip
- L337: <LicenseChip
- L444: <Chip
- L458: <LicenseChip

### frontend/src/pages/OtrosUsuarios/OtrosUsuarios.jsx

- L414: <Chip
- L443: <Chip

### frontend/src/pages/Pagos/MisPagos.jsx

- L7: import { LicenseChip } from "../../components/common/LicenseChip";
- L72: renderCell: (params) => <LicenseChip value={params.value} />,
- L85: <Chip

### frontend/src/pages/Pagos/Pagos.jsx

- L6: import { LicenseChip } from "../../components/common/LicenseChip";
- L62: renderCell: (params) => <LicenseChip value={params.value} />,
- L75: <Chip

### frontend/src/pages/ProfesorAgenda/ProfesorAgenda.jsx

- L43: import { LicenseChip } from "../../components/common/LicenseChip";
- L615: <Chip
- L620: <Chip
- L625: <Chip
- L647: <Chip
- L652: <Chip
- L657: <Chip
- L1004: <LicenseChip
- L1057: <Chip
- L1073: {/* Eliminamos el Stack antiguo del LicenseChip que rompía la línea */}
- L1087: <Chip
- L1103: <Chip
- L1114: <Chip
- L1311: <Chip

### frontend/src/pages/ProfesorAlumnos/ProfesorAlumnos.jsx

- L31: import { LicenseChip } from "../../components/common/LicenseChip";
- L249: renderCell: (params) => <LicenseChip value={params.value} />,
- L329: <Chip size="small" label={params.value || "-"} />
- L504: <LicenseChip value={detail?.perfil?.tipoLicenciaObjetivo} />
- L508: <LicenseChip value={detail?.perfil?.tipoLicenciaObjetivo} />
- L540: <Chip
- L554: <Chip
- L568: <Chip
- L582: <Chip
- L726: <Chip
- L765: <Chip
- L795: <Chip
- L803: <Chip
- L811: <Chip
- L877: <Chip
- L983: <LicenseChip
- L1104: <LicenseChip value={value} />

### frontend/src/pages/Profesores/Profesores copy.jsx

- L22: import { LicenseChipList } from "../../components/common/LicenseChip";
- L591: <LicenseChipList
- L614: <Chip
- L1253: <Chip
- L1280: <Chip
- L1284: <Chip
- L1477: <Chip
- L1492: <Chip

### frontend/src/pages/Profesores/Profesores.jsx

- L22: import { LicenseChipList } from "../../components/common/LicenseChip";
- L484: <LicenseChipList
- L507: <Chip
- L1361: <Chip
- L1371: <Chip
- L1381: <Chip
- L1391: <Chip
- L1401: <Chip
- L1449: <Chip
- L1475: <Chip

### frontend/src/pages/ProfesorVehiculos/ProfesorVehiculos.jsx

- L26: import { LicenseChip } from "../../components/common/LicenseChip";
- L156: renderCell: (params) => <LicenseChip value={params.value} />,
- L182: <Chip label="Pendiente" color="warning" size="small" />
- L184: <Chip label="Vigente" color="success" size="small" />
- L216: <Chip
- L246: return <Chip label="Sin acciones" size="small" />;
- L255: return <Chip label="Sin acciones" size="small" />;
- L511: <Chip
- L581: <Chip
- L631: <Chip

### frontend/src/pages/Promociones/Promociones.jsx

- L33: import { LicenseChipList } from "../../components/common/LicenseChip";
- L573: <LicenseChipList values={params.row.licenciasAplicables} />

### frontend/src/pages/ReservarClase/ReservarClase.jsx

- L33: import { LicenseChip } from "../../components/common/LicenseChip";
- L565: <Chip
- L572: <Chip
- L591: <Chip
- L597: <Chip
- L602: <Chip
- L894: <Chip size="small" label="Próxima" color="info" />
- L895: <Chip size="small" label="Solicitud" color="warning" />
- L896: <Chip size="small" label="Efectuada" color="success" />
- L1010: <LicenseChip
- L1021: <Chip

### frontend/src/pages/SolicitudesExamen/SolicitudesExamen.jsx

- L243: renderCell: (params) => <Chip label={params.row.estado} size="small" />,

### frontend/src/pages/TarifasConcepto/TarifasConcepto.jsx

- L36: import { LicenseChip } from "../../components/common/LicenseChip";
- L354: renderCell: (params) => <LicenseChip value={params.value} />,

### frontend/src/pages/TarifasMatricula/TarifasMatricula.jsx

- L30: import { LicenseChip } from "../../components/common/LicenseChip";
- L311: renderCell: (params) => <LicenseChip value={params.value} />,

### frontend/src/pages/Temarios/TemarioAlumno.jsx

- L125: <Chip
- L131: <Chip

### frontend/src/pages/Temarios/TemarioClaseDirectoViewer.jsx

- L152: <Chip
- L160: <Chip

### frontend/src/pages/Temarios/TemarioHero.jsx

- L79: <Chip

### frontend/src/pages/Temarios/Temarios.jsx

- L32: import { LicenseChipList } from "../../components/common/LicenseChip";
- L233: return <LicenseChipList values={licencias} />;

### frontend/src/pages/Temarios/TemarioTemaDetalle.jsx

- L382: <Chip
- L526: <Chip
- L801: <Chip

### frontend/src/pages/TestDGT/TestDGTAdmin.jsx

- L37: import { LicenseChipList } from "../../components/common/LicenseChip";
- L670: <LicenseChipList values={params.row.licencia} />
- L679: <Chip

### frontend/src/pages/TestDGT/TestDGTAlumno.jsx

- L441: <Chip label={`Aciertos: ${resultado.aciertos}`} color="success" />
- L442: <Chip label={`Fallos: ${resultado.fallos}`} color="error" />
- L443: <Chip

### frontend/src/pages/Vehiculos/Vehiculos.jsx

- L38: import { LicenseChip } from "../../components/common/LicenseChip";
- L651: renderCell: (params) => <LicenseChip value={params.value} />,

### frontend/src/theme/chipPalette.js

- L41: export const getLicenseChipPalette = (value) => {
- L48: export const getExamTypeChipPalette = (value) => {

