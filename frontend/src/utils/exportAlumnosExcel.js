import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportAlumnosExcel = (rows) => {
  const data = rows.map((alumno) => ({
    Nombre: alumno.usuario?.nombre ?? "",
    Email: alumno.usuario?.email ?? "",
    Licencia: alumno.tipoLicenciaObjetivo ?? "",
    HorasPracticas: alumno.horasPracticasCompletadas ?? 0,
    Profesor: alumno.profesorAsignado?.usuario?.nombre ?? "Sin asignar",
    Telefono: alumno.usuario?.telefono ?? "",
    Estado: alumno.activo ? "Activo" : "Inactivo",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Alumnos_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
