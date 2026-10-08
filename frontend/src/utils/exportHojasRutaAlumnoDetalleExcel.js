import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const exportHojasRutaAlumnoDetalleExcel = (rows = []) => {
  const data = rows.map((row) => ({
    Fecha: formatDateTime(row.fecha),
    Vehiculo:
      `${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""} ${row.vehiculo?.matricula || ""}`.trim(),
    Faltas: `${row.faltasResumen?.leves || 0} · ${row.faltasResumen?.deficientes || 0} · ${row.faltasResumen?.eliminatorias || 0}`,
    Estado: row.sinDatos ? "PENDIENTE" : row.estado || "REGISTRADA",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "HojasAlumno");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer]),
    `HojasRuta_Alumno_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
};
