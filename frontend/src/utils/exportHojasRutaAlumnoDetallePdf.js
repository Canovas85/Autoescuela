import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const exportHojasRutaAlumnoDetallePdf = (rows = []) => {
  const doc = new jsPDF();

  doc.text("Hojas de Ruta del Alumno", 14, 15);
  doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [["Fecha", "Vehiculo", "Faltas", "Estado"]],
    body: rows.map((row) => [
      formatDateTime(row.fecha),
      `${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""} ${row.vehiculo?.matricula || ""}`.trim(),
      `${row.faltasResumen?.leves || 0} · ${row.faltasResumen?.deficientes || 0} · ${row.faltasResumen?.eliminatorias || 0}`,
      row.sinDatos ? "PENDIENTE" : row.estado || "REGISTRADA",
    ]),
  });

  doc.save(`HojasRuta_Alumno_${new Date().toISOString().slice(0, 10)}.pdf`);
};
