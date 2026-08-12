import { describe, it, expect, vi } from "vitest";

import { AlumnosService } from "../alumnos.service.js";
import bcrypt from "bcryptjs";

describe("AlumnosService", () => {
  it("debe crear un alumno cuando los datos son válidos", async () => {
    const alumnoCreado = {
      id: "alumno-id",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      rol: "ALUMNO",
      telefono: "600123123",
      tipoLicencia: "B",
      activo: true,
    };

    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(alumnoCreado),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.create({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: "Password123",
      telefono: "600123123",
      tipoLicencia: "B",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(alumnoCreado);
  });
  it("debe lanzar un error cuando el email es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        password: "Password123",
      }),
    ).rejects.toThrow("El email es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el email ya existe", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "alumno-existente",
        email: "pedro@autodrive.com",
      }),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "Password123",
        telefono: "600123123",
        tipoLicencia: "B",
      }),
    ).rejects.toThrow("El email ya existe");

    expect(repositoryMock.findByEmail).toHaveBeenCalledWith(
      "pedro@autodrive.com",
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe almacenar la contraseña cifrada con bcrypt", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new AlumnosService(repositoryMock);

    const plainPassword = "Password123";

    const result = await service.create({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: plainPassword,
      telefono: "600123123",
      tipoLicencia: "B",
    });

    expect(result.password).not.toBe(plainPassword);

    const isValid = await bcrypt.compare(plainPassword, result.password);

    expect(isValid).toBe(true);
  });
  it("debe crear siempre el usuario con rol ALUMNO aunque se envíe otro rol", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.create({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: "Password123",
      rol: "ADMIN",
      telefono: "600123123",
      tipoLicencia: "B",
    });

    expect(result.rol).toBe("ALUMNO");
  });
  it("debe crear siempre el alumno como activo aunque se envíe activo false", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.create({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: "Password123",
      telefono: "600123123",
      tipoLicencia: "B",
      activo: false,
    });

    expect(result.activo).toBe(true);
  });
  it("debe lanzar un error cuando la contraseña es obligatoria", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
      }),
    ).rejects.toThrow("La contraseña es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la contraseña tiene menos de 8 caracteres", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "1234567",
      }),
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la licencia objetivo es obligatoria", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "Password123",
      }),
    ).rejects.toThrow("La licencia objetivo es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el teléfono es obligatorio", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "Password123",
        tipoLicencia: "B",
      }),
    ).rejects.toThrow("El teléfono es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe devolver el listado completo de alumnos", async () => {
    const alumnos = [
      {
        id: "alumno-1",
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        rol: "ALUMNO",
        activo: true,
      },
      {
        id: "alumno-2",
        nombre: "Laura Martín",
        email: "laura@autodrive.com",
        rol: "ALUMNO",
        activo: true,
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(alumnos),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();

    expect(result).toEqual(alumnos);
  });
  it("debe devolver un alumno cuando existe el id", async () => {
    const alumno = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      tipoLicencia: "B",
      rol: "ALUMNO",
      activo: true,
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(alumno),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.getById("alumno-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("alumno-1");

    expect(result).toEqual(alumno);
  });
  it("debe actualizar un alumno existente", async () => {
    const alumnoActualizado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez Actualizado",
      email: "pedro@autodrive.com",
      telefono: "699999999",
      tipoLicencia: "B",
      rol: "ALUMNO",
      activo: true,
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(alumnoActualizado),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.update("alumno-1", {
      nombre: "Pedro Sánchez Actualizado",
      telefono: "699999999",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("alumno-1", {
      nombre: "Pedro Sánchez Actualizado",
      telefono: "699999999",
    });

    expect(result).toEqual(alumnoActualizado);
  });
  it("debe desactivar un alumno existente", async () => {
    const alumnoDesactivado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      activo: false,
      rol: "ALUMNO",
    };

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(alumnoDesactivado),
    };

    const service = new AlumnosService(repositoryMock);

    const result = await service.deactivate("alumno-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("alumno-1");

    expect(result).toEqual(alumnoDesactivado);
  });
});
