import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportHojasRutaProfesoresExcel = (rows = []) => {
  const data = rows.map((row) => ({
    Profesor: row.profesorNombre || "",
    Total: Number(row.total || 0),
    Pendientes: Number(row.pendientes || 0),
    EnCurso: Number(row.enCurso || 0),
    Registradas: Number(row.registradas || 0),
    Canceladas: Number(row.canceladas || 0),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "HojasRutaProfesores");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer]),
    `HojasRuta_Profesores_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
};
