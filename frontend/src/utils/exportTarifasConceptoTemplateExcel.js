import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTarifasConceptoTemplateExcel = () => {
  const plantilla = [
    {
      PERMISO: "B",
      CONCEPTO: "Tasa gestion expediente",
      PRECIO: 45,
      TIPO: "FIJO",
      DESCRIPCION: "Tasa administrativa",
      ACTIVA: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "PERMISO", DESCRIPCION: "A, A1, A2, B, C, D o E" },
    { CAMPO: "CONCEPTO", DESCRIPCION: "Obligatorio" },
    { CAMPO: "PRECIO", DESCRIPCION: "Numero mayor que 0" },
    { CAMPO: "TIPO", DESCRIPCION: "FIJO, VARIABLE, POR_CLASE o POR_EXAMEN" },
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
  saveAs(new Blob([buffer]), "Plantilla_Tarifas_Concepto.xlsx");
};
