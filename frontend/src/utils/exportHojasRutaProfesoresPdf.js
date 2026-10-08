import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportHojasRutaProfesoresPdf = (rows = []) => {
  const doc = new jsPDF();

  doc.text("Hojas de Ruta por Profesor", 14, 15);
  doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [
      [
        "Profesor",
        "Total",
        "Pendientes",
        "En Curso",
        "Registradas",
        "Canceladas",
      ],
    ],
    body: rows.map((row) => [
      row.profesorNombre || "",
      Number(row.total || 0),
      Number(row.pendientes || 0),
      Number(row.enCurso || 0),
      Number(row.registradas || 0),
      Number(row.canceladas || 0),
    ]),
  });

  doc.save(`HojasRuta_Profesores_${new Date().toISOString().slice(0, 10)}.pdf`);
};
