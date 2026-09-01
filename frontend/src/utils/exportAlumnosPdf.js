import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAlumnosPdf = (rows) => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("AUTOESCUELA EGUZKILORE", 14, 20);

  doc.setFontSize(14);

  doc.text("Listado de Alumnos", 14, 30);

  autoTable(doc, {
    startY: 40,

    head: [["Nombre", "Email", "Licencia", "Profesor", "Estado"]],

    body: rows.map((alumno) => [
      alumno.usuario?.nombre ?? "",
      alumno.usuario?.email ?? "",
      alumno.tipoLicenciaObjetivo ?? "",
      alumno.profesorAsignado?.usuario?.nombre ?? "Sin asignar",
      alumno.activo ? "Activo" : "Inactivo",
    ]),
  });

  doc.save(`Alumnos_${new Date().toISOString().slice(0, 10)}.pdf`);
};
