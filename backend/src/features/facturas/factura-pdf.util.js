const EURO = "EUR";

const sanitizePdfText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const formatNumber = (value) => {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
};

const formatCurrency = (value) => `${formatNumber(value)} ${EURO}`;

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES");
};

const buildPdfDocument = (lines) => {
  let contentStream = "";

  lines.forEach((line) => {
    const safeText = sanitizePdfText(line.text);
    contentStream += `BT /F1 ${line.size} Tf ${line.x} ${line.y} Td (${safeText}) Tj ET\n`;
  });

  const streamLength = Buffer.byteLength(contentStream, "utf8");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${streamLength} >>\nstream\n${contentStream}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((objectText, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${objectText}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");

  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += "trailer\n";
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += "startxref\n";
  pdf += `${xrefOffset}\n`;
  pdf += "%%EOF";

  return Buffer.from(pdf, "utf8");
};

export const buildFacturaPdfBuffer = (factura) => {
  const lines = [];
  let y = 805;

  const addLine = (text, options = {}) => {
    lines.push({
      text,
      x: options.x ?? 40,
      y,
      size: options.size ?? 11,
    });
    y -= options.gap ?? 16;
  };

  addLine("AUTOESCUELA EGUZKILORE", { size: 16, gap: 20 });
  addLine("FACTURA", { size: 14, gap: 20 });

  addLine(`Numero: ${factura.numero}`);
  addLine(`Fecha emision: ${formatDate(factura.fechaEmision)}`);
  addLine(`Estado: ${factura.estado}`);
  addLine(`Alumno: ${factura.alumno.nombre}`);
  addLine(`Email: ${factura.alumno.email || "-"}`);
  addLine(`DNI: ${factura.alumno.dni || "-"}`);
  addLine(`Telefono: ${factura.alumno.telefono || "-"}`);
  addLine(`Licencia: ${factura.licencia || "-"}`, { gap: 22 });

  addLine("Detalle economico", { size: 13, gap: 18 });
  addLine(`Concepto: ${factura.concepto}`);
  addLine(`Base imponible: ${formatCurrency(factura.baseImponible)}`);
  addLine(`Descuento: ${formatCurrency(factura.descuento)}`);
  addLine(`Total: ${formatCurrency(factura.total)}`, { size: 12, gap: 22 });

  addLine("Informacion adicional", { size: 13, gap: 18 });
  addLine(`Fecha pago: ${formatDate(factura.fechaPago)}`);

  return buildPdfDocument(lines);
};
