import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportNominasExcel = (rows) => {
  const data = (rows || []).map((row) => ({
    "Nº Nómina": row.numero || "-",
    Profesor: row.profesor?.usuario?.nombre || "-",
    "Periodo de liquidación": `${String(row.mes).padStart(2, "0")}/${row.anio}`,
    Importe: Number(row.liquidoPercibir || 0).toFixed(2),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Nominas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Nominas_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
