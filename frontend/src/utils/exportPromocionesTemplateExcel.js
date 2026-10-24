import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportPromocionesTemplateExcel = () => {
  const plantilla = [
    {
      NOMBRE: "Promo Verano B",
      DESCRIPCION: "Descuento especial para permiso B",
      PRECIO_ORIGINAL: 220,
      PRECIO_PROMOCIONAL: 180,
      LICENCIAS: "B",
      FECHA_INICIO: "2026-06-01",
      FECHA_FIN: "2026-09-01",
      ACTIVA: "true",
    },
  ];

  const instrucciones = [
    { CAMPO: "NOMBRE", DESCRIPCION: "Obligatorio" },
    { CAMPO: "PRECIO_ORIGINAL", DESCRIPCION: "Numero mayor que 0" },
    {
      CAMPO: "PRECIO_PROMOCIONAL",
      DESCRIPCION: "Numero mayor que 0 y menor o igual al original",
    },
    {
      CAMPO: "LICENCIAS",
      DESCRIPCION: "Licencias separadas por coma. Ej: B,A1",
    },
    {
      CAMPO: "FECHA_INICIO/FECHA_FIN",
      DESCRIPCION: "Opcional, formato YYYY-MM-DD",
    },
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
  saveAs(new Blob([buffer]), "Plantilla_Promociones.xlsx");
};
