import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportVehiculosPdf = (rows) => {
  const doc = new jsPDF();

  doc.text("Listado de Vehiculos", 14, 15);

  autoTable(doc, {
    startY: 25,

    head: [
      [
        "Matricula",
        "Marca",
        "Modelo",
        "Permiso",
        "Numero de Clases",
        "Fecha ultima ITV",
        "Estado",
      ],
    ],

    body: rows.map((vehiculo) => [
      vehiculo.matricula,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.tipoPermiso || "",
      Number(vehiculo.numeroClasesRealizadas || 0),
      vehiculo.fechaUltimaItv
        ? new Date(vehiculo.fechaUltimaItv).toLocaleDateString("es-ES")
        : "-",
      vehiculo.activo ? "Activo" : "Inactivo",
    ]),
  });

  doc.save("Vehiculos.pdf");
};
