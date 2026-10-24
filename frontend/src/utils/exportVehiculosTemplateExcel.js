import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportVehiculosTemplateExcel = () => {
  const plantilla = [
    {
      MATRICULA: "1234ABC",
      MARCA: "Seat",
      MODELO: "Ibiza",
      TIPO_PERMISO: "B",
      FECHA_ULTIMA_ITV: "2026-09-10",
      ACTIVO: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "MATRICULA", DESCRIPCION: "Obligatorio" },
    { CAMPO: "MARCA", DESCRIPCION: "Obligatorio" },
    { CAMPO: "MODELO", DESCRIPCION: "Obligatorio" },
    { CAMPO: "TIPO_PERMISO", DESCRIPCION: "A, A1, A2, B, C, D o E" },
    { CAMPO: "FECHA_ULTIMA_ITV", DESCRIPCION: "Opcional, formato YYYY-MM-DD" },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(plantilla),
    "Plantilla",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(instrucciones),
    "Instrucciones",
  );

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buffer]), "Plantilla_Vehiculos.xlsx");
};
