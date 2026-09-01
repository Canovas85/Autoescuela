import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportProfesoresPdf = (rows) => {
  const doc = new jsPDF();

  doc.text("Listado de Profesores", 14, 15);

  autoTable(doc, {
    startY: 25,

    head: [["Nombre", "Email", "Permisos", "Telefono", "Estado"]],

    body: rows.map((profesor) => [
      profesor.usuario?.nombre ?? "",
      profesor.usuario?.email ?? "",
      profesor.permisosLicencias?.join(", ") ?? "",
      profesor.usuario?.telefono ?? "",
      profesor.activo ? "Activo" : "Inactivo",
    ]),
  });

  doc.save("Profesores.pdf");
};
