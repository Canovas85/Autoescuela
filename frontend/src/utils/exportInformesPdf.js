import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

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

const getGenerationDate = () =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

export const exportInformesPdf = ({ rows = [], kpis = {} } = {}) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 14);

  doc.setFontSize(12);
  doc.text("Informe de contabilidad", 14, 22);
  doc.setFontSize(10);
  doc.text(`Generado: ${getGenerationDate()}`, 14, 28);

  doc.setFontSize(10);
  doc.text(
    `Ingresos: ${formatCurrency(kpis.ingresosTotales)} | Gastos: ${formatCurrency(
      kpis.gastosTotales,
    )} | Beneficio neto: ${formatCurrency(
      kpis.beneficioNeto,
    )} | Pendiente matrícula: ${formatCurrency(kpis.cobrosPendientesMatricula)}`,
    14,
    34,
  );

  autoTable(doc, {
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    head: [
      [
        "Tipo",
        "Concepto",
        "Categoria",
        "Estado",
        "Alumno",
        "Referencia",
        "Importe",
        "Fecha",
      ],
    ],
    body: (rows || []).map((row) => [
      row.tipo || "-",
      row.concepto || "-",
      row.categoria || "-",
      row.estado || "-",
      row.alumno || "-",
      row.referencia || "-",
      formatCurrency(row.importe),
      formatDateTime(row.fecha),
    ]),
  });

  doc.save(
    `informes_contabilidad_${new Date().toISOString().slice(0, 10)}.pdf`,
  );
};
