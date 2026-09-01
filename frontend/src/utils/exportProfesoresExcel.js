import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportProfesoresExcel = (rows) => {
  const data = rows.map((profesor) => ({
    Nombre: profesor.usuario?.nombre ?? "",
    Email: profesor.usuario?.email ?? "",
    Telefono: profesor.usuario?.telefono ?? "",
    DNI: profesor.usuario?.dni ?? "",
    Permisos: profesor.permisosLicencias?.join(", ") ?? "",
    Estado: profesor.activo ? "Activo" : "Inactivo",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Profesores");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer]), "Profesores.xlsx");
};
