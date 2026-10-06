import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const getFileDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
};

const formatCurrency = (value) => Number(value || 0).toFixed(2);

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const exportInformesExcel = ({ rows = [], kpis = {} } = {}) => {
  const summaryRows = [
    {
      Indicador: "Ingresos totales",
      Valor: formatCurrency(kpis.ingresosTotales),
    },
    {
      Indicador: "Gastos totales",
      Valor: formatCurrency(kpis.gastosTotales),
    },
    {
      Indicador: "Beneficio neto",
      Valor: formatCurrency(kpis.beneficioNeto),
    },
    {
      Indicador: "Cobros pendientes matrícula",
      Valor: formatCurrency(kpis.cobrosPendientesMatricula),
    },
  ];

  const movementRows = (rows || []).map((row) => ({
    Tipo: row.tipo || "-",
    Concepto: row.concepto || "-",
    Categoria: row.categoria || "-",
    Estado: row.estado || "-",
    Alumno: row.alumno || "-",
    Referencia: row.referencia || "-",
    Importe: formatCurrency(row.importe),
    Fecha: formatDateTime(row.fecha),
  }));

  const workbook = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");

  const movementSheet = XLSX.utils.json_to_sheet(movementRows);
  XLSX.utils.book_append_sheet(workbook, movementSheet, "Movimientos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `informes_contabilidad_${getFileDate()}.xlsx`);
};
