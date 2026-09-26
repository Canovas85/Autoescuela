import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getFileDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
};

const getGenerationDate = () =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

export const exportIngresosPdf = (rows) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 14);

  doc.setFontSize(12);
  doc.text("Ingresos y facturas", 14, 22);
  doc.setFontSize(10);
  doc.text(`Generado: ${getGenerationDate()}`, 14, 28);

  autoTable(doc, {
    startY: 34,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    head: [
      [
        "Nº Factura",
        "Alumno",
        "Licencia",
        "Origen",
        "Concepto",
        "Precio Base",
        "Descuento",
        "Precio Final",
        "Estado",
        "Fecha Emisión",
        "Fecha Pago",
      ],
    ],
    body: rows.map((row) => [
      row["Nº Factura"],
      row.Alumno,
      row.Licencia,
      row.Origen,
      row.Concepto,
      row["Precio Base"],
      row.Descuento,
      row["Precio Final"],
      row.Estado,
      row["Fecha Emisión"],
      row["Fecha Pago"],
    ]),
  });

  doc.save(`ingresos_${getFileDate()}.pdf`);
};
