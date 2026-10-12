import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportNominasPdf = (rows) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 16);
  doc.setFontSize(13);
  doc.text("Nominas", 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [["Nº Nómina", "Profesor", "Periodo de liquidación", "Importe"]],
    body: (rows || []).map((row) => [
      row.numero || "-",
      row.profesor?.usuario?.nombre || "-",
      `${String(row.mes).padStart(2, "0")}/${row.anio}`,
      `${Number(row.liquidoPercibir || 0).toFixed(2)} EUR`,
    ]),
  });

  doc.save(`Nominas_${new Date().toISOString().slice(0, 10)}.pdf`);
};
