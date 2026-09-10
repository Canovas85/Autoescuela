export class PagosService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getMine(alumnoId) {
    return this.repository.findByAlumnoId(alumnoId);
  }

  async getMineById(pagoId, alumnoId) {
    const pago = await this.repository.findById(pagoId);

    if (!pago) {
      throw new Error("Pago no encontrado");
    }

    if (pago.alumnoId !== alumnoId) {
      throw new Error("No puedes acceder a un pago que no te pertenece");
    }

    return pago;
  }

  async payMine(pagoId, alumnoId) {
    const pago = await this.repository.findById(pagoId);

    if (!pago) {
      throw new Error("Pago no encontrado");
    }

    if (pago.alumnoId !== alumnoId) {
      throw new Error("No puedes pagar un pago que no te pertenece");
    }

    if (pago.estado === "PAGADO") {
      throw new Error("El pago ya está abonado");
    }

    const paid = await this.repository.pay(pagoId);

    if (typeof this.repository.createNotification === "function") {
      await this.repository.createNotification({
        usuarioId: alumnoId,
        tipo: "PAGO_REALIZADO",
        titulo: "Pago realizado correctamente",
        mensaje: `Se ha registrado el pago: ${paid.concepto}`,
        metadata: {
          pagoId: paid.id,
          numeroFactura: paid.numeroFacturaPago,
        },
      });

      await this.repository.createNotification({
        usuarioId: alumnoId,
        tipo: "FACTURA_GENERADA",
        titulo: "Factura generada",
        mensaje: `Factura ${paid.numeroFacturaPago} disponible en Mis Facturas`,
        metadata: {
          pagoId: paid.id,
          numeroFactura: paid.numeroFacturaPago,
        },
      });
    }

    return paid;
  }
}
