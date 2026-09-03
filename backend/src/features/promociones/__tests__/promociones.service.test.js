import { describe, it, expect, vi } from "vitest";

import { PromocionesService } from "../promociones.service.js";

describe("PromocionesService", () => {
  it("debe crear una promoción cuando los datos son válidos", async () => {
    const promocionCreada = {
      id: "promo-1",
      nombre: "Promoción verano",
      descripcion: "Descuento de verano",
      precioOriginal: 600,
      precioPromocional: 450,
      licenciasAplicables: ["B", "A1"],
      imagenRuta: null,
      fechaInicio: "2026-09-01T00:00:00.000Z",
      fechaFin: "2026-09-30T00:00:00.000Z",
      activa: true,
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(promocionCreada),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.create(
      {
        nombre: "  Promoción verano  ",
        descripcion: "  Descuento de verano  ",
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B", "A1"],
        fechaInicio: "2026-09-01T00:00:00.000Z",
        fechaFin: "2026-09-30T00:00:00.000Z",
      },
      null,
    );

    expect(repositoryMock.create).toHaveBeenCalledWith({
      nombre: "Promoción verano",
      descripcion: "Descuento de verano",
      precioOriginal: 600,
      precioPromocional: 450,
      licenciasAplicables: ["B", "A1"],
      imagenRuta: null,
      fechaInicio: new Date("2026-09-01T00:00:00.000Z"),
      fechaFin: new Date("2026-09-30T00:00:00.000Z"),
      activa: true,
      requiereCarnetEstudiante: false,
      requiereFidelidad: false,
      edadMinima: null,
      edadMaxima: null,
    });

    expect(result).toEqual(promocionCreada);
  });

  it("debe lanzar un error cuando el nombre es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B"],
      }),
    ).rejects.toThrow("El nombre es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el precio original no es válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 0,
        precioPromocional: 450,
        licenciasAplicables: ["B"],
      }),
    ).rejects.toThrow("El precio original debe ser mayor que 0");
  });

  it("debe lanzar un error cuando el precio promocional no es válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 600,
        precioPromocional: 0,
        licenciasAplicables: ["B"],
      }),
    ).rejects.toThrow("El precio promocional debe ser mayor que 0");
  });

  it("debe lanzar un error cuando el precio promocional supera al original", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 500,
        precioPromocional: 700,
        licenciasAplicables: ["B"],
      }),
    ).rejects.toThrow(
      "El precio promocional no puede ser superior al precio original",
    );
  });

  it("debe lanzar un error si no se indica ninguna licencia válida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 500,
        precioPromocional: 400,
        licenciasAplicables: [],
      }),
    ).rejects.toThrow("Debe seleccionar al menos una licencia");
  });

  it("debe lanzar un error si hay licencias no válidas", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 500,
        precioPromocional: 400,
        licenciasAplicables: ["B", "Z"],
      }),
    ).rejects.toThrow("Existen licencias no válidas");
  });

  it("debe devolver todas las promociones", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promoción verano", activa: true },
      { id: "promo-2", nombre: "Promoción otoño", activa: false },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(promociones),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(promociones);
  });

  it("debe devolver una promoción por id cuando existe", async () => {
    const promocion = {
      id: "promo-1",
      nombre: "Promoción verano",
      activa: true,
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(promocion),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.getById("promo-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("promo-1");
    expect(result).toEqual(promocion);
  });

  it("debe lanzar un error si la promoción no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(service.getById("promo-404")).rejects.toThrow(
      "Promoción no encontrada",
    );
  });

  it("debe actualizar una promoción y borrar la imagen anterior cuando se elimina", async () => {
    const promocionActual = {
      id: "promo-1",
      imagenRuta: "/api/uploads/promociones/old.png",
    };

    const promocionActualizada = {
      id: "promo-1",
      nombre: "Nueva promo",
      imagenRuta: null,
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(promocionActual),
      update: vi.fn().mockResolvedValue(promocionActualizada),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.update(
      "promo-1",
      {
        nombre: "Nueva promo",
        precioOriginal: 500,
        precioPromocional: 400,
        licenciasAplicables: ["B"],
        eliminarImagen: "true",
      },
      null,
    );

    expect(repositoryMock.update).toHaveBeenCalledWith("promo-1", {
      nombre: "Nueva promo",
      descripcion: null,
      precioOriginal: 500,
      precioPromocional: 400,
      licenciasAplicables: ["B"],
      imagenRuta: null,
      fechaInicio: null,
      fechaFin: null,
      activa: true,
      requiereCarnetEstudiante: false,
      edadMinima: null,
      edadMaxima: null,
      requiereFidelidad: false,
    });

    expect(result).toEqual(promocionActualizada);
  });

  it("debe eliminar una promoción", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "promo-1" }),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.delete("promo-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("promo-1");
    expect(result).toEqual({ id: "promo-1" });
  });

  it("debe activar una promoción", async () => {
    const promocionActivada = { id: "promo-1", activa: true };

    const repositoryMock = {
      activate: vi.fn().mockResolvedValue(promocionActivada),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.activate("promo-1");

    expect(repositoryMock.activate).toHaveBeenCalledWith("promo-1");
    expect(result).toEqual(promocionActivada);
  });

  it("debe desactivar una promoción", async () => {
    const promocionDesactivada = { id: "promo-1", activa: false };

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(promocionDesactivada),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.deactivate("promo-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("promo-1");
    expect(result).toEqual(promocionDesactivada);
  });

  it("debe devolver las promociones públicas activas", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promo pública", activa: true },
    ];

    const repositoryMock = {
      findPublic: vi.fn().mockResolvedValue(promociones),
    };

    const service = new PromocionesService(repositoryMock);

    const result = await service.getPublic();

    expect(repositoryMock.findPublic).toHaveBeenCalledOnce();
    expect(result).toEqual(promociones);
  });

  it("debe persistir reglas avanzadas cuando se informan", async () => {
    const repositoryMock = {
      create: vi.fn().mockResolvedValue({ id: "promo-1" }),
    };

    const service = new PromocionesService(repositoryMock);

    await service.create({
      nombre: "Promo estudiante fidelidad",
      precioOriginal: 800,
      precioPromocional: 700,
      licenciasAplicables: ["B"],
      requiereCarnetEstudiante: true,
      requiereFidelidad: true,
      edadMinima: 18,
      edadMaxima: 30,
    });

    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        requiereCarnetEstudiante: true,
        requiereFidelidad: true,
        edadMinima: 18,
        edadMaxima: 30,
      }),
    );
  });

  it("debe fallar si edad mínima es mayor que edad máxima", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PromocionesService(repositoryMock);

    await expect(
      service.create({
        nombre: "Promo",
        precioOriginal: 700,
        precioPromocional: 600,
        licenciasAplicables: ["B"],
        edadMinima: 40,
        edadMaxima: 25,
      }),
    ).rejects.toThrow("La edad mínima no puede ser superior a la edad máxima");
  });
});
