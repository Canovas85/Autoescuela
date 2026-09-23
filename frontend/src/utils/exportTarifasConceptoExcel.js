import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTarifasConceptoExcel = (rows) => {
  const data = (rows || []).map((row) => ({
    Permiso: row.permiso || "",
    Concepto: row.concepto || "",
    Precio: Number(row.precio || 0),
    Tipo: row.tipo || "",
    Descripcion: row.descripcion || "",
    Estado: row.activa ? "Activo" : "Inactivo",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "TarifasConcepto");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Tarifas_Permiso_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
