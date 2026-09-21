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
    const buffer = await buildFacturaPdfBuffer(preview);
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
        <h2>DUPLICADO DE FACTURA</h2>
        <p>Adjuntamos el duplicado solicitado para la factura <strong>${preview.numero}</strong>.</p>
        <p><strong>Alumno:</strong> ${preview.alumno.nombre}</p>
        <p><strong>Concepto:</strong> ${preview.concepto}</p>
        <p><strong>Total:</strong> ${Number(preview.total).toFixed(2)} EUR</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0;" />
        <p style="font-size:12px;color:#475569;">
          Este duplicado de factura se remite exclusivamente para uso del destinatario.
          Queda prohibida su difusión o reenvío sin autorización expresa de Autoescuela Eguzkilore.
        </p>
      </div>
    `;

    await this.emailService.sendEmail({
      to: destination,
      subject: `DUPLICADO DE FACTURA - AUTOESCUELA EGUZKILORE - ${preview.numero}`,
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
    const baseFromFactura = Number(factura.baseImponible || 0);
    const total = Number(factura.total || 0);
    const promoOriginal = Number(
      factura.matricula?.promocion?.precioOriginal ?? baseFromFactura,
    );
    const baseImponible = factura.matricula ? promoOriginal : baseFromFactura;
    const descuentoCalculado = baseImponible - total;
    const descuento =
      descuentoCalculado > 0
        ? Number(descuentoCalculado.toFixed(2))
        : Number(factura.descuento || 0);

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
      baseImponible,
      descuento,
      total,
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
