const fs = require("fs");
const path = require("path");
const xlsxPath = path.resolve(process.cwd(), "frontend", "node_modules", "xlsx");
const XLSX = require(xlsxPath);
const outDir = path.resolve(process.cwd(), "demo-imports");
fs.mkdirSync(outDir, { recursive: true });
const files = [
  { name: "convocatorias.xlsx", rows: [{ FECHA: "2026-12-15", LICENCIA: "B", TIPO_EXAMEN: "TEORICO", ACTIVO: "true" }] },
  { name: "promociones.xlsx", rows: [{ NOMBRE: "Promo Demo Oct", DESCRIPCION: "Promo demo import", PRECIO_ORIGINAL: 300, PRECIO_PROMOCIONAL: 250, LICENCIAS: "B", FECHA_INICIO: "2026-10-01", FECHA_FIN: "2026-12-31", ACTIVA: "true" }] },
  { name: "tarifas-concepto.xlsx", rows: [{ PERMISO: "B", CONCEPTO: "Tasa Demo Import", PRECIO: 35, TIPO: "FIJO", DESCRIPCION: "Alta demo", ACTIVA: "true" }] },
  { name: "tarifas-matricula.xlsx", rows: [{ LICENCIA: "B", PRECIO: 245, ACTIVA: "true" }] },
  { name: "bonos.xlsx", rows: [{ NOMBRE: "Bono Demo Import", DESCRIPCION: "Importado por excel", LICENCIA: "B", CLASES_INCLUIDAS: 8, PRECIO: 199, VALIDEZ_DIAS: 60, ACTIVO: "true" }] },
  { name: "vehiculos.xlsx", rows: [{ MATRICULA: "9876XYZ", MARCA: "Toyota", MODELO: "Yaris", TIPO_PERMISO: "B", FECHA_ULTIMA_ITV: "2026-09-15", ACTIVO: "true" }] },
];
for (const f of files) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(f.rows);
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
  const outPath = path.join(outDir, f.name);
  XLSX.writeFile(wb, outPath);
  console.log(outPath);
}
