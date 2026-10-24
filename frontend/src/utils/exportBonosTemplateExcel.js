import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportBonosTemplateExcel = () => {
  const plantilla = [
    {
      NOMBRE: "Bono 10 clases B",
      DESCRIPCION: "Pack estandar de 10 clases",
      LICENCIA: "B",
      CLASES_INCLUIDAS: 10,
      PRECIO: 280,
      VALIDEZ_DIAS: 90,
      ACTIVO: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "NOMBRE", DESCRIPCION: "Obligatorio" },
    { CAMPO: "CLASES_INCLUIDAS", DESCRIPCION: "Entero mayor que 0" },
    { CAMPO: "PRECIO", DESCRIPCION: "Numero mayor que 0" },
    { CAMPO: "VALIDEZ_DIAS", DESCRIPCION: "Entero mayor que 0" },
    { CAMPO: "LICENCIA", DESCRIPCION: "Opcional: A, A1, A2, B, C, D o E" },
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
  saveAs(new Blob([buffer]), "Plantilla_Bonos.xlsx");
};
