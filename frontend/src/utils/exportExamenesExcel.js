import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-ES");
};

export const exportExamenesExcel = (rows) => {
  const data = (rows || []).map((row) => ({
    Alumno: row.alumnoNombre || "",
    FechaSolicitud: formatDate(row.fechaSolicitud),
    FechaConvocatoria: formatDate(row.fechaConvocatoria),
    PermisoLicencia: row.permisoLicencia || "",
    Tipo: row.tipo || "",
    Estado: row.estado || "",
    NumeroConvocatoria: row.numeroIntento ?? "-",
    ConvocatoriasRestantes: row.convocatoriasRestantes ?? "-",
    Profesor: row.profesorAsignado || "Sin asignar",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Examenes");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(
    file,
    `Evaluacion_Examenes_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
};
