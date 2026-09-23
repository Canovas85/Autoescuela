import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportProfesorAlumnosExcel = (rows) => {
  const data = (rows || []).map((alumno) => ({
    Alumno: alumno.nombre || "",
    Email: alumno.email || "",
    Licencia: alumno.tipoLicenciaObjetivo || "",
    Estado: alumno.estadoAlumno?.label || "-",
    ClasesRealizadas: alumno.clasesRealizadas ?? 0,
    HorasPractica: alumno.horasPracticasTexto || "0h 00min",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "ProfesorAlumnos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(
    file,
    `Profesor_Alumnos_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
};
