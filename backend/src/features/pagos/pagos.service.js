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

    return this.repository.pay(pagoId);
  }
}
