import PDFDocument from "pdfkit";
import { drawPdfBranding } from "../../shared/utils/pdf-branding.util.js";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("es-ES");
};

const periodLabel = (nomina) => {
  const start = new Date(nomina.periodoInicio);
  const end = new Date(nomina.periodoFin);
  return `${start.getDate()} al ${end.getDate()} de ${end.toLocaleDateString(
    "es-ES",
    {
      month: "long",
    },
  )} de ${end.getFullYear()}`;
};

const drawRow = (
  doc,
  {
    y,
    code = "",
    label,
    cantidad = "-",
    precio = "-",
    devengo = "",
    deduccion = "",
  },
) => {
  const x = {
    code: 34,
    label: 76,
    qty: 335,
    price: 390,
    dev: 448,
    ded: 508,
  };

  doc
    .fontSize(8.2)
    .fillColor("#0f172a")
    .text(code, x.code, y, { width: 38 })
    .text(label, x.label, y, { width: 250 })
    .text(cantidad, x.qty, y, { width: 52, align: "right" })
    .text(precio, x.price, y, { width: 52, align: "right" })
    .text(devengo, x.dev, y, { width: 56, align: "right" })
    .text(deduccion, x.ded, y, { width: 56, align: "right" });
};

export const buildNominaPdfBuffer = (nomina) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 24,
    });

    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const headerBlockY = 84;
    const headerBlockHeight = 80;
    const tableHeaderY = 180;

    drawPdfBranding(doc, {
      includeFooter: false,
      headerAlign: "center",
      headerY: 28,
    });

    doc
      .lineWidth(0.8)
      .strokeColor("#c7d3e3")
      .rect(30, headerBlockY, 535, headerBlockHeight)
      .stroke();

    doc
      .moveTo(297, headerBlockY)
      .lineTo(297, headerBlockY + headerBlockHeight)
      .strokeColor("#c7d3e3")
      .lineWidth(0.6)
      .stroke();

    doc.font("Helvetica-Bold").fillColor("#111827").fontSize(8.2);
    doc.text("EMPRESA:", 36, headerBlockY + 10);
    doc.text("TRABAJADOR:", 304, headerBlockY + 10);

    doc.font("Helvetica").fontSize(8.1);
    doc.text("AUTOESCUELA EGUZKILORE S.L.", 36, headerBlockY + 22);
    doc.text("CIF: B-12345678", 36, headerBlockY + 33);
    doc.text(
      `TRABAJADOR: ${nomina.profesor?.usuario?.nombre || "-"}`,
      304,
      headerBlockY + 22,
    );
    doc.text(`NIF: ${nomina.profesor?.usuario?.dni || "-"}`, 304, headerBlockY + 33);
    doc.text("Categoria: Profesor Formacion Vial", 304, headerBlockY + 44);

    doc
      .lineWidth(0.6)
      .moveTo(30, headerBlockY + 56)
      .lineTo(565, headerBlockY + 56)
      .strokeColor("#c7d3e3")
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(8.1)
      .text("Periodo de Liquidacion:", 36, headerBlockY + 62);
    doc
      .font("Helvetica")
      .fontSize(8.1)
      .text(periodLabel(nomina), 130, headerBlockY + 62);
    doc.font("Helvetica-Bold").fontSize(8.1).text("Nº Nomina:", 304, headerBlockY + 62);
    doc.font("Helvetica").fontSize(8.1).text(nomina.numero, 362, headerBlockY + 62);

    doc.rect(30, tableHeaderY, 535, 20).fill("#1f3b68");
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("Codigo", 34, tableHeaderY + 7)
      .text("Conceptos Salariales (Devengos)", 76, tableHeaderY + 7)
      .text("Cantidad", 335, tableHeaderY + 7, { width: 52, align: "right" })
      .text("Precio", 390, tableHeaderY + 7, { width: 52, align: "right" })
      .text("Importe Bruto", 448, tableHeaderY + 7, { width: 56, align: "right" })
      .text("Deducciones", 508, tableHeaderY + 7, { width: 56, align: "right" });

    let y = tableHeaderY + 28;
    doc.font("Helvetica");

    drawRow(doc, {
      y,
      code: "001",
      label: "Salario Base (Convenio 2026)",
      cantidad: `${nomina.diasTrabajados} dias`,
      precio: "-",
      devengo: formatCurrency(nomina.importeSalarioBase),
    });

    y += 18;
    drawRow(doc, {
      y,
      code: "009",
      label: "Plus de Transporte",
      cantidad: "1 mes",
      precio: "-",
      devengo: formatCurrency(nomina.plusTransporte),
    });

    y += 18;
    drawRow(doc, {
      y,
      code: "045",
      label: "Plus Productividad Convocatorias",
      cantidad: String(nomina.totalPresentados ?? 0),
      precio: "11.00 EUR",
      devengo: formatCurrency(nomina.plusProductividad),
    });

    y += 18;
    drawRow(doc, {
      y,
      code: "090",
      label: "Prorrata Pagas Extraordinarias",
      cantidad: "-",
      precio: "-",
      devengo: formatCurrency(nomina.prorrataPagasExtra),
    });

    y += 22;
    drawRow(doc, {
      y,
      label: "Contingencias Comunes (4,70%)",
      deduccion: formatCurrency(nomina.deduccionContingenciasComunes),
    });

    y += 18;
    drawRow(doc, {
      y,
      label: "Desempleo (1,55%)",
      deduccion: formatCurrency(nomina.deduccionDesempleo),
    });

    y += 18;
    drawRow(doc, {
      y,
      label: "Formacion Profesional (0,10%)",
      deduccion: formatCurrency(nomina.deduccionFormacionProfesional),
    });

    y += 18;
    drawRow(doc, {
      y,
      label: "Retencion por I.R.P.F. (13,50%)",
      deduccion: formatCurrency(nomina.deduccionIrpf),
    });

    y += 24;
    doc.font("Helvetica-Bold");
    drawRow(doc, {
      y,
      label: "TOTALES",
      devengo: formatCurrency(nomina.totalDevengos),
      deduccion: formatCurrency(nomina.totalDeducciones),
    });

    y += 30;
    doc
      .font("Helvetica-Bold")
      .fontSize(9.8)
      .text(
        `LIQUIDO TOTAL A PERCIBIR (NETO): ${formatCurrency(nomina.liquidoPercibir)}`,
        34,
        y,
      );

    y += 24;
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(
        "DETERMINACION DE LAS BASES DE COTIZACION A LA SEGURIDAD SOCIAL",
        34,
        y,
      );

    y += 16;
    doc
      .font("Helvetica")
      .text(
        `Base Contingencias Comunes: ${formatCurrency(nomina.baseCotizacionComunes)}`,
        34,
        y,
      );
    y += 14;
    doc.text(
      `Base Contingencias Profesionales (AT y EP): ${formatCurrency(nomina.baseCotizacionProfesionales)}`,
      34,
      y,
    );
    y += 14;
    doc.text(
      `Base Retencion I.R.P.F.: ${formatCurrency(nomina.baseRetencionIrpf)}`,
      34,
      y,
    );

    y += 20;
    doc
      .fillColor("#475569")
      .fontSize(7.2)
      .text(
        "Documento interno de nomina. Los importes de prorrata y deducciones se aplican segun parametrizacion 2026.",
        34,
        y,
        { width: 528 },
      );

    doc.end();
  });
};
