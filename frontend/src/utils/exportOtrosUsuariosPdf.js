import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportOtrosUsuariosPdf = (rows) => {
  const doc = new jsPDF();

  doc.text("Listado de Otros Usuarios", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Nombre", "Email", "Perfil", "DNI", "Telefono", "Estado"]],
    body: (rows || []).map((usuario) => [
      usuario.nombre || "",
      usuario.email || "",
      usuario.rol || "",
      usuario.dni || "",
      usuario.telefono || "",
      usuario.activo ? "Activo" : "Inactivo",
    ]),
  });

  doc.save("Otros-Usuarios.pdf");
};
