import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportConvocatoriasTemplateExcel = () => {
  const plantilla = [
    {
      FECHA: "2026-11-15",
      LICENCIA: "B",
      TIPO_EXAMEN: "TEORICO",
      ACTIVO: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "FECHA", DESCRIPCION: "Formato YYYY-MM-DD (obligatorio)" },
    { CAMPO: "LICENCIA", DESCRIPCION: "Licencia objetivo. Ej: B, A1, A2" },
    { CAMPO: "TIPO_EXAMEN", DESCRIPCION: "TEORICO o PRACTICO" },
    { CAMPO: "ACTIVO", DESCRIPCION: "true/false (opcional, por defecto true)" },
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
  saveAs(new Blob([buffer]), "Plantilla_Convocatorias_Examen.xlsx");
};
