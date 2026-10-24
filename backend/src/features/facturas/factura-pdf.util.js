import PDFDocument from "pdfkit";
import { drawPdfBranding } from "../../shared/utils/pdf-branding.util.js";

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

    drawPdfBranding(doc, {
      includeFooter: false,
      headerAlign: "center",
      headerY: 30,
      headerWidth: 190,
      headerHeight: 56,
    });

    doc.rect(40, 102, 515, 76).fill("#f8fafc");
    doc
      .fillColor("#0f172a")
      .fontSize(18)
      .text("AUTOESCUELA EGUZKILORE", 55, 120);
    doc.fontSize(11).fillColor("#475569").text("Factura oficial", 55, 144);

    doc
      .fontSize(10)
      .fillColor("#475569")
      .text("Nº Factura", 390, 118, { width: 150, align: "right" })
      .fontSize(11)
      .fillColor("#0f172a")
      .text(numeroMostrado, 390, 132, { width: 150, align: "right" })
      .fontSize(10)
      .fillColor("#475569")
      .text(`Emisión: ${formatDate(factura.fechaEmision)}`, 390, 148, {
        width: 150,
        align: "right",
      })
      .text(`Estado: ${factura.estado}`, 390, 162, {
        width: 150,
        align: "right",
      });

    doc.rect(40, 182, 250, 90).stroke("#dbeafe");
    doc.rect(305, 182, 250, 90).stroke("#dbeafe");

    doc.fontSize(11).fillColor("#1e293b").text("Emisor", 50, 192);
    doc
      .fontSize(10)
      .fillColor("#334155")
      .text("Autoescuela Eguzkilore", 50, 210);

    doc.fontSize(11).fillColor("#1e293b").text("Receptor", 315, 192);
    doc
      .fontSize(10)
      .fillColor("#334155")
      .text(factura.alumno?.nombre || "-", 315, 210)
      .text(factura.alumno?.email || "-", 315, 226)
      .text(`DNI: ${factura.alumno?.dni || "-"}`, 315, 242);

    doc.rect(40, 292, 515, 30).fill("#eff6ff");
    doc
      .fillColor("#0f172a")
      .fontSize(10)
      .text("Concepto", 50, 302)
      .text("Base", 280, 302, { width: 70, align: "right" })
      .text("Descuento", 360, 302, { width: 90, align: "right" })
      .text("Total", 465, 302, { width: 80, align: "right" });

    doc.rect(40, 322, 515, 42).stroke("#dbeafe");
    doc
      .fillColor("#0f172a")
      .fontSize(10)
      .text(factura.concepto || "-", 50, 336, { width: 220 })
      .text(formatCurrency(factura.baseImponible), 280, 336, {
        width: 70,
        align: "right",
      })
      .text(formatCurrency(factura.descuento), 360, 336, {
        width: 90,
        align: "right",
      })
      .font("Helvetica-Bold")
      .text(formatCurrency(factura.total), 465, 336, {
        width: 80,
        align: "right",
      })
      .font("Helvetica");

    doc
      .fontSize(10)
      .fillColor("#0f172a")
      .text(`Licencia: ${factura.licencia || "-"}`, 50, 387)
      .text(`Fecha pago: ${formatDate(factura.fechaPago)}`, 50, 404)
      .fillColor("#64748b")
      .text(
        "Este documento es un duplicado de factura emitido por Autoescuela Eguzkilore.",
        50,
        452,
        {
          width: 490,
        },
      );

    doc.end();
  });
};
