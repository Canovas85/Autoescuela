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

export const exportGastosExcel = (rows) => {
  const data = (rows || []).map((row) => ({
    NumeroFactura: row.numeroFactura || "",
    Profesor: row.profesor?.nombre || "-",
    Vehiculo:
      `${row.vehiculo?.matricula || "-"} ${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""}`.trim(),
    Licencia: row.vehiculo?.tipoPermiso || "-",
    Concepto: "Combustible",
    Litros: Number(row.litrosRepostados || 0).toFixed(2),
    PrecioPorLitro: Number(row.precioLitro || 0).toFixed(2),
    Total: Number(row.total || 0).toFixed(2),
    Fecha: formatDateTime(row.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Gastos_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
