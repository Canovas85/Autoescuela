import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportProfesorAlumnosPdf = (rows) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AUTOESCUELA EGUZKILORE", 14, 20);

  doc.setFontSize(13);
  doc.text("Profesor - Mis Alumnos", 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Alumno", "Email", "Licencia", "Estado", "Clases", "Horas"]],
    body: (rows || []).map((alumno) => [
      alumno.nombre || "",
      alumno.email || "",
      alumno.tipoLicenciaObjetivo || "",
      alumno.estadoAlumno?.label || "-",
      alumno.clasesRealizadas ?? 0,
      alumno.horasPracticasTexto || "0h 00min",
    ]),
  });

  doc.save(`Profesor_Alumnos_${new Date().toISOString().slice(0, 10)}.pdf`);
};
