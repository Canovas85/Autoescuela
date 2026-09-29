import { buildFacturaPdfBuffer } from "./factura-pdf.util.js";

export class FacturasService {
  constructor(repository, emailService = null) {
    this.repository = repository;
    this.emailService = emailService;
  }

  classifyConcepto(concepto) {
    const text = String(concepto || "").toLowerCase();

    if (text.includes("matricul")) {
      return "MATRICULA";
    }

    if (text.includes("tasa") || text.includes("dgt")) {
      return "TASA_DGT";
    }

    if (text.includes("bono")) {
      return "BONO";
    }

    if (text.includes("clase")) {
      return "CLASE_PRACTICA";
    }

    if (
      text.includes("práctic") ||
      text.includes("practic") ||
      text.includes("examen")
    ) {
      return "EXAMEN_PRACTICO";
    }

    return "OTROS";
  }

  buildPagosByNumeroMap(pagos = []) {
    const map = new Map();

    for (const pago of pagos || []) {
      const numero = String(pago?.numeroFacturaPago || "");

      if (!numero) {
        continue;
      }

      if (!map.has(numero)) {
        map.set(numero, []);
      }

      map.get(numero).push(pago);
    }

    return map;
  }

  hideTechnicalCancelledDuplicates(facturas, pagosByNumero = new Map()) {
    const keyByFactura = (factura) =>
      [
        factura.alumnoId,
        String(factura.concepto || "")
          .trim()
          .toUpperCase(),
        Number(factura.total || 0).toFixed(2),
      ].join("|");

    const grouped = new Map();

    for (const factura of facturas || []) {
      const key = keyByFactura(factura);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(factura);
    }

    return (facturas || []).filter((factura) => {
      const pagosFactura =
        pagosByNumero.get(String(factura.numero || "")) || [];
      const estadoFactura = String(factura.estado || "").toUpperCase();
      const invoiceIsUnpayableByCanceledPayment =
        ["PENDIENTE", "EMITIDA"].includes(estadoFactura) &&
        pagosFactura.length > 0 &&
        pagosFactura.every(
          (pago) => String(pago.estado || "").toUpperCase() === "CANCELADO",
        );

      if (invoiceIsUnpayableByCanceledPayment) {
        return false;
      }

      const isAnulada =
        String(factura.estado || "").toUpperCase() === "ANULADA";
      const categoria = this.classifyConcepto(factura.concepto);
      const isManagedDuplicateCategory =
        categoria === "EXAMEN_PRACTICO" || categoria === "TASA_DGT";

      if (!isAnulada || !isManagedDuplicateCategory) {
        const isPendiente =
          String(factura.estado || "").toUpperCase() === "PENDIENTE";

        if (!isPendiente || !isManagedDuplicateCategory) {
          return true;
        }

        const siblings = grouped.get(keyByFactura(factura)) || [];
        const pendientes = siblings.filter(
          (item) => String(item.estado || "").toUpperCase() === "PENDIENTE",
        );

        if (pendientes.length <= 1) {
          return true;
        }

        return pendientes[0]?.id === factura.id;
      }

      const siblings = grouped.get(keyByFactura(factura)) || [];

      return !siblings.some(
        (item) =>
          item.id !== factura.id &&
          String(item.estado || "").toUpperCase() !== "ANULADA",
      );
    });
  }

  async getAll() {
    const facturas = await this.repository.findAll();
    const pagos =
      typeof this.repository.findPagosByInvoiceNumbers === "function"
        ? await this.repository.findPagosByInvoiceNumbers([
            ...new Set((facturas || []).map((item) => item.numero)),
          ])
        : [];
    const pagosByNumero = this.buildPagosByNumeroMap(pagos);
    const visibles = this.hideTechnicalCancelledDuplicates(
      facturas,
      pagosByNumero,
    );
    return this.attachInferredLicense(visibles, pagos);
  }

  async getMine(alumnoId) {
    const facturas = await this.repository.findByAlumnoId(alumnoId);
    const pagos =
      typeof this.repository.findPagosByInvoiceNumbers === "function"
        ? await this.repository.findPagosByInvoiceNumbers([
            ...new Set((facturas || []).map((item) => item.numero)),
          ])
        : [];
    const pagosByNumero = this.buildPagosByNumeroMap(pagos);
    const visibles = this.hideTechnicalCancelledDuplicates(
      facturas,
      pagosByNumero,
    );
    return this.attachInferredLicense(visibles, pagos);
  }

  async attachInferredLicense(facturas, pagosProvided = null) {
    if (typeof this.repository.findPagosByInvoiceNumbers !== "function") {
      return facturas || [];
    }

    const numbers = [...new Set((facturas || []).map((item) => item.numero))];
    const pagos =
      pagosProvided ||
      (await this.repository.findPagosByInvoiceNumbers(numbers));
    const permisoByNumero = new Map(
      (pagos || []).map((item) => [item.numeroFacturaPago, item.permiso]),
    );

    return (facturas || []).map((factura) => {
      const licenciaRelacion =
        factura.compraBono?.bono?.licencia || factura.matricula?.licencia;
      const licenciaPago = permisoByNumero.get(factura.numero);

      if (licenciaRelacion || !licenciaPago) {
        return factura;
      }

      return {
        ...factura,
        licenciaInferida: licenciaPago,
      };
    });
  }

  async getPreview(facturaId) {
    const factura = await this.repository.findById(facturaId);

    if (!factura) {
      throw new Error("Factura no encontrada");
    }

    return this.toPreviewModel(factura);
  }

  async getPreviewMine(facturaId, alumnoId) {
    const factura = await this.repository.findByIdAndAlumnoId(
      facturaId,
      alumnoId,
    );

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

  async getPdfMine(facturaId, alumnoId) {
    const preview = await this.getPreviewMine(facturaId, alumnoId);
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
    const category = this.classifyConcepto(factura.concepto);
    const baseFromFactura = Number(factura.baseImponible || 0);
    const total = Number(factura.total || 0);
    const promoOriginal = Number(factura.matricula?.promocion?.precioOriginal);
    const usePromotionBase =
      category === "MATRICULA" &&
      Number.isFinite(promoOriginal) &&
      promoOriginal > 0;
    const baseImponible = usePromotionBase ? promoOriginal : baseFromFactura;
    const descuentoCalculado = baseImponible - total;
    const descuento =
      descuentoCalculado > 0
        ? Number(descuentoCalculado.toFixed(2))
        : Number(factura.descuento || 0);

    const licencia =
      factura.compraBono?.bono?.licencia ||
      factura.clasePractica?.vehiculo?.tipoPermiso ||
      factura.matricula?.licencia ||
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
