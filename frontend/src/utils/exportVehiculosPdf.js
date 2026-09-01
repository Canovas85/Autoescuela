import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportVehiculosPdf = (rows) => {
  const doc = new jsPDF();

  doc.text("Listado de Vehiculos", 14, 15);

  autoTable(doc, {
    startY: 25,

    head: [["Matricula", "Marca", "Modelo", "Estado"]],

    body: rows.map((vehiculo) => [
      vehiculo.matricula,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.activo ? "Activo" : "Inactivo",
    ]),
  });

  doc.save("Vehiculos.pdf");
};
