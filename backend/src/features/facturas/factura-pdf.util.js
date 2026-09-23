import PDFDocument from "pdfkit";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("es-ES") : "-";

export const buildFacturaPdfBuffer = (factura) => {
  return new Promise((resolve, reject) => {
    const rawNumero = String(factura?.numero || "-");
    const numeroMostrado =
      rawNumero.length > 28 ? `${rawNumero.slice(0, 28)}...` : rawNumero;

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.rect(40, 40, 515, 76).fill("#f8fafc");
    doc
      .fillColor("#0f172a")
      .fontSize(18)
      .text("AUTOESCUELA EGUZKILORE", 55, 58);
    doc.fontSize(11).fillColor("#475569").text("Factura oficial", 55, 82);

    doc
      .fontSize(10)
      .fillColor("#475569")
      .text("Nº Factura", 390, 56, { width: 150, align: "right" })
      .fontSize(11)
      .fillColor("#0f172a")
      .text(numeroMostrado, 390, 70, { width: 150, align: "right" })
      .fontSize(10)
      .fillColor("#475569")
      .text(`Emisión: ${formatDate(factura.fechaEmision)}`, 390, 86, {
        width: 150,
        align: "right",
      })
      .text(`Estado: ${factura.estado}`, 390, 100, {
        width: 150,
        align: "right",
      });

    doc.rect(40, 120, 250, 90).stroke("#dbeafe");
    doc.rect(305, 120, 250, 90).stroke("#dbeafe");

    doc.fontSize(11).fillColor("#1e293b").text("Emisor", 50, 130);
    doc
      .fontSize(10)
      .fillColor("#334155")
      .text("Autoescuela Eguzkilore", 50, 148);

    doc.fontSize(11).fillColor("#1e293b").text("Receptor", 315, 130);
    doc
      .fontSize(10)
      .fillColor("#334155")
      .text(factura.alumno?.nombre || "-", 315, 148)
      .text(factura.alumno?.email || "-", 315, 164)
      .text(`DNI: ${factura.alumno?.dni || "-"}`, 315, 180);

    doc.rect(40, 230, 515, 30).fill("#eff6ff");
    doc
      .fillColor("#0f172a")
      .fontSize(10)
      .text("Concepto", 50, 240)
      .text("Base", 280, 240, { width: 70, align: "right" })
      .text("Descuento", 360, 240, { width: 90, align: "right" })
      .text("Total", 465, 240, { width: 80, align: "right" });

    doc.rect(40, 260, 515, 42).stroke("#dbeafe");
    doc
      .fillColor("#0f172a")
      .fontSize(10)
      .text(factura.concepto || "-", 50, 274, { width: 220 })
      .text(formatCurrency(factura.baseImponible), 280, 274, {
        width: 70,
        align: "right",
      })
      .text(formatCurrency(factura.descuento), 360, 274, {
        width: 90,
        align: "right",
      })
      .font("Helvetica-Bold")
      .text(formatCurrency(factura.total), 465, 274, {
        width: 80,
        align: "right",
      })
      .font("Helvetica");

    doc
      .fontSize(10)
      .fillColor("#0f172a")
      .text(`Licencia: ${factura.licencia || "-"}`, 50, 325)
      .text(`Fecha pago: ${formatDate(factura.fechaPago)}`, 50, 342)
      .fillColor("#64748b")
      .text(
        "Este documento es un duplicado de factura emitido por Autoescuela Eguzkilore.",
        50,
        390,
        {
          width: 490,
        },
      );

    doc.end();
  });
};
