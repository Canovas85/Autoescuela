import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTarifasMatriculaTemplateExcel = () => {
  const plantilla = [
    {
      LICENCIA: "B",
      PRECIO: 220,
      ACTIVA: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "LICENCIA", DESCRIPCION: "A, A1, A2, B, C, D o E" },
    { CAMPO: "PRECIO", DESCRIPCION: "Numero mayor que 0" },
    { CAMPO: "ACTIVA", DESCRIPCION: "true/false (opcional)" },
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
  saveAs(new Blob([buffer]), "Plantilla_Tarifas_Matricula.xlsx");
};
