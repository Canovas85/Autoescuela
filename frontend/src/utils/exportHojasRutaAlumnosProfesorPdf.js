import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportHojasRutaAlumnosProfesorPdf = (rows = []) => {
  const doc = new jsPDF();

  doc.text("Alumnos del Profesor - Hojas de Ruta", 14, 15);
  doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [
      [
        "Alumno",
        "Total",
        "Pendientes",
        "En Curso",
        "Registradas",
        "Canceladas",
      ],
    ],
    body: rows.map((row) => [
      row.alumnoNombre || "",
      Number(row.total || 0),
      Number(row.pendientes || 0),
      Number(row.enCurso || 0),
      Number(row.registradas || 0),
      Number(row.canceladas || 0),
    ]),
  });

  doc.save(
    `HojasRuta_AlumnosProfesor_${new Date().toISOString().slice(0, 10)}.pdf`,
  );
};
