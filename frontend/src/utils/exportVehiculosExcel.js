import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportVehiculosExcel = (rows) => {
  const data = rows.map((vehiculo) => ({
    Matricula: vehiculo.matricula,
    Marca: vehiculo.marca,
    Modelo: vehiculo.modelo,

    Estado: vehiculo.activo ? "Activo" : "Inactivo",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Vehiculos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer]), "Vehiculos.xlsx");
};
