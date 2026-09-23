import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-ES");
};

export const exportExamenesPdf = (rows) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 16);
  doc.setFontSize(13);
  doc.text("Evaluación de exámenes", 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Alumno",
        "F. solicitud",
        "F. convocatoria",
        "Permiso",
        "Tipo",
        "Estado",
        "Intento",
        "Restantes",
      ],
    ],
    body: (rows || []).map((row) => [
      row.alumnoNombre || "",
      formatDate(row.fechaSolicitud),
      formatDate(row.fechaConvocatoria),
      row.permisoLicencia || "",
      row.tipo || "",
      row.estado || "",
      row.numeroIntento ?? "-",
      row.convocatoriasRestantes ?? "-",
    ]),
  });

  doc.save(`Evaluacion_Examenes_${new Date().toISOString().slice(0, 10)}.pdf`);
};
