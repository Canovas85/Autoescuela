import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportPreguntasDGTTemplateExcel = () => {
  const plantilla = [
    {
      LICENCIAS: "B,A2",
      ENUNCIADO:
        "Cuando circulas por ciudad, ¿qué distancia de seguridad debes mantener con el vehículo delantero?",
      RESPUESTA_1: "La suficiente para detenerme sin colisionar.",
      RESPUESTA_2: "Dos metros en cualquier situación.",
      RESPUESTA_3: "No es necesaria si voy despacio.",
      RESPUESTA_4: "Solo en carretera interurbana.",
      RESPUESTA_CORRECTA: "1",
      EXPLICACION:
        "Debes mantener siempre una distancia de seguridad adecuada a velocidad y condiciones de la vía.",
    },
  ];

  const instrucciones = [
    {
      CAMPO: "LICENCIAS",
      DESCRIPCION: "Licencias separadas por coma. Ej: B,A1,A2",
    },
    {
      CAMPO: "ENUNCIADO",
      DESCRIPCION: "Texto de la pregunta (obligatorio)",
    },
    {
      CAMPO: "RESPUESTA_1..RESPUESTA_4",
      DESCRIPCION: "Mínimo 3 respuestas informadas. RESPUESTA_4 es opcional.",
    },
    {
      CAMPO: "RESPUESTA_CORRECTA",
      DESCRIPCION:
        "Número de respuesta correcta (1,2,3,4) o texto exacto de la respuesta.",
    },
    {
      CAMPO: "EXPLICACION",
      DESCRIPCION: "Texto opcional de explicación.",
    },
    {
      CAMPO: "ID",
      DESCRIPCION:
        "No informar. La aplicación lo genera automáticamente como pregunta-dgt-b-XXX.",
    },
  ];

  const wb = XLSX.utils.book_new();
  const wsPlantilla = XLSX.utils.json_to_sheet(plantilla);
  const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);

  XLSX.utils.book_append_sheet(wb, wsPlantilla, "Plantilla");
  XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Plantilla_Importacion_Preguntas_DGT.xlsx");
};
