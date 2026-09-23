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

export const exportGastosPdf = (rows) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 16);
  doc.setFontSize(13);
  doc.text("Gastos", 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Nº Factura",
        "Profesor",
        "Vehículo",
        "Licencia",
        "Concepto",
        "Litros",
        "Precio/L",
        "Total",
        "Fecha",
      ],
    ],
    body: (rows || []).map((row) => [
      row.numeroFactura || "",
      row.profesor?.nombre || "-",
      `${row.vehiculo?.matricula || "-"} ${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""}`.trim(),
      row.vehiculo?.tipoPermiso || "-",
      "Combustible",
      `${Number(row.litrosRepostados || 0).toFixed(2)} L`,
      `${Number(row.precioLitro || 0).toFixed(2)} EUR`,
      `${Number(row.total || 0).toFixed(2)} EUR`,
      formatDateTime(row.createdAt),
    ]),
  });

  doc.save(`Gastos_${new Date().toISOString().slice(0, 10)}.pdf`);
};
