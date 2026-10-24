const path = require("path");
const XLSX = require(path.resolve(process.cwd(), "frontend", "node_modules", "xlsx"));
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet([{ FECHA: "2027-01-31", LICENCIA: "E", TIPO_EXAMEN: "PRACTICO", ACTIVO: "true" }]);
XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
XLSX.writeFile(wb, path.resolve(process.cwd(), "demo-imports", "convocatorias.xlsx"));
console.log("updated");
