import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportTarifasConceptoPdf = (rows) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 20);
  doc.setFontSize(13);
  doc.text("Tarifas por permisos", 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Permiso", "Concepto", "Precio", "Tipo", "Estado"]],
    body: (rows || []).map((row) => [
      row.permiso || "",
      row.concepto || "",
      `${Number(row.precio || 0).toFixed(2)} EUR`,
      row.tipo || "",
      row.activa ? "Activo" : "Inactivo",
    ]),
  });

  doc.save(`Tarifas_Permiso_${new Date().toISOString().slice(0, 10)}.pdf`);
};
