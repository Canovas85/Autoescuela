import { buildFacturaPdfBuffer } from "./factura-pdf.util.js";

export class FacturasService {
  constructor(repository, emailService = null) {
    this.repository = repository;
    this.emailService = emailService;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getMine(alumnoId) {
    return this.repository.findByAlumnoId(alumnoId);
  }

  async getPreview(facturaId) {
    const factura = await this.repository.findById(facturaId);

    if (!factura) {
      throw new Error("Factura no encontrada");
    }

    return this.toPreviewModel(factura);
  }

  async getPdf(facturaId) {
    const preview = await this.getPreview(facturaId);
    const buffer = buildFacturaPdfBuffer(preview);
    const fileName = `Factura_${preview.numero}.pdf`;

    return { buffer, fileName };
  }

  async sendDuplicate(facturaId, email) {
    const destination = String(email || "").trim();

    if (!destination || !/^\S+@\S+\.\S+$/.test(destination)) {
      throw new Error("Debes indicar un email valido para el envio");
    }

    if (!this.emailService) {
      throw new Error("Servicio de email no configurado");
    }

    const preview = await this.getPreview(facturaId);
    const { buffer, fileName } = await this.getPdf(facturaId);

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5; color:#0f172a;">
        <h2>Duplicado de factura ${preview.numero}</h2>
        <p>Adjuntamos el duplicado solicitado.</p>
        <p><strong>Alumno:</strong> ${preview.alumno.nombre}</p>
        <p><strong>Concepto:</strong> ${preview.concepto}</p>
        <p><strong>Total:</strong> ${Number(preview.total).toFixed(2)} EUR</p>
      </div>
    `;

    await this.emailService.sendEmail({
      to: destination,
      subject: `Duplicado factura ${preview.numero} - Autoescuela Eguzkilore`,
      html,
      attachments: [
        {
          filename: fileName,
          content: buffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return { message: "Duplicado de factura enviado correctamente" };
  }

  toPreviewModel(factura) {
    const licencia =
      factura.matricula?.licencia ||
      factura.compraBono?.bono?.licencia ||
      factura.clasePractica?.vehiculo?.tipoPermiso ||
      "-";

    return {
      id: factura.id,
      numero: factura.numero,
      concepto: factura.concepto,
      estado: factura.estado,
      fechaEmision: factura.fechaEmision,
      fechaPago: factura.fechaPago,
      baseImponible: Number(factura.baseImponible || 0),
      descuento: Number(factura.descuento || 0),
      total: Number(factura.total || 0),
      licencia,
      alumno: {
        id: factura.alumno?.id,
        nombre: factura.alumno?.usuario?.nombre || "-",
        email: factura.alumno?.usuario?.email || "",
        telefono: factura.alumno?.usuario?.telefono || "",
        dni: factura.alumno?.usuario?.dni || "",
      },
      emisor: {
        nombre: "Autoescuela Eguzkilore",
      },
    };
  }
}
