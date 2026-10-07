import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportOtrosUsuariosExcel = (rows) => {
  const data = (rows || []).map((usuario) => ({
    Nombre: usuario.nombre || "",
    Email: usuario.email || "",
    Perfil: usuario.rol || "",
    DNI: usuario.dni || "",
    Telefono: usuario.telefono || "",
    Estado: usuario.activo ? "Activo" : "Inactivo",
    "Requiere Cambio Password": usuario.requiereCambioPassword ? "Si" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "OtrosUsuarios");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer]), "Otros-Usuarios.xlsx");
};
