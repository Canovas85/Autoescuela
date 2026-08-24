import { describe, it, expect, vi } from "vitest";
import { ProfesoresService } from "../profesores.service.js";
import bcrypt from "bcryptjs";

describe("ProfesoresService", () => {
  it("debe crear un profesor cuando los datos son válidos", async () => {
    const profesorCreado = {
      id: "profesor-id",
      licenciaConducir: "B",
      permisosLicencias: ["B", "A"],
      telefono: "600123123",
      activo: true,
      usuario: {
        id: "usuario-id",
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        rol: "PROFESOR",
      },
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(profesorCreado),
      findByEmail: vi.fn().mockResolvedValue(null), // <-- AÑADE ESTA LÍNEA
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.create({
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      password: "Password123",
      dni: "12345678Z",
      permisosLicencias: ["B", "A"],
      telefono: "600123123",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(profesorCreado);
  });

  it("debe lanzar un error cuando el email es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        password: "Password123",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("El email es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el email ya existe", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "usuario-existente",
        email: "juan@autodrive.com",
      }),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("El email ya existe");

    expect(repositoryMock.findByEmail).toHaveBeenCalledWith(
      "juan@autodrive.com",
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe almacenar la contraseña cifrada con bcrypt", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ProfesoresService(repositoryMock);

    const plainPassword = "Password123";

    const result = await service.create({
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      password: plainPassword,
      dni: "12345678z",
      permisosLicencias: ["B"],
      telefono: "600123123",
    });

    expect(result.passwordHash).not.toBe(plainPassword);

    const isValid = await bcrypt.compare(plainPassword, result.passwordHash);

    expect(isValid).toBe(true);
  });

  it("debe crear siempre el usuario con rol PROFESOR aunque se envíe otro rol", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.create({
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      password: "Password123",
      dni: "12345678Z",
      permisosLicencias: ["B"],
      telefono: "600123123",
      rol: "ADMIN",
    });

    expect(result.rol).toBe("PROFESOR");
  });

  it("debe lanzar un error cuando al menos un permiso es obligatorio", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        telefono: "600123123",
      }),
    ).rejects.toThrow("Debes seleccionar al menos un permiso");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando la contraseña es obligatoria", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("La contraseña es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando la contraseña tiene menos de 8 caracteres", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "1234567",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el teléfono es obligatorio", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        licenciaConducir: "B",
      }),
    ).rejects.toThrow("El teléfono es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe crear siempre el profesor como activo aunque se envíe activo false", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.create({
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      password: "Password123",
      dni: "12345678Z",
      permisosLicencias: ["B", "A2"],
      telefono: "600123123",
      activo: false,
    });

    expect(result.activo).toBe(true);
  });

  it("debe lanzar un error cuando el DNI es obligatorio", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("El DNI es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el DNI tiene formato inválido", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        dni: "12A",
        licenciaConducir: "B",
        telefono: "600123123",
      }),
    ).rejects.toThrow("El DNI debe tener un formato válido");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe devolver el listado completo de profesores", async () => {
    const profesores = [
      {
        id: "profesor-1",
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        rol: "PROFESOR",
        activo: true,
      },
      {
        id: "profesor-2",
        nombre: "Ana García",
        email: "ana@autodrive.com",
        rol: "PROFESOR",
        activo: true,
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(profesores),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);

    expect(result).toEqual(profesores);
  });

  it("debe devolver un profesor cuando existe el id", async () => {
    const profesor = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      rol: "PROFESOR",
      activo: true,
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(profesor),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.getById("profesor-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("profesor-1");

    expect(result).toEqual(profesor);
  });

  it("debe actualizar un profesor existente", async () => {
    const profesorActualizado = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      telefono: "699999999",
      licenciaConducir: "B",
      permisosLicencias: ["B", "A1"],
      dni: "12345678Z",
      rol: "PROFESOR",
      activo: true,
    };

    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findUserByDni: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue(profesorActualizado),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.update("profesor-1", {
      nombre: " Juan Pérez ",
      email: "juan@autodrive.com",
      dni: "12345678z",
      telefono: "699999999",
      permisosLicencias: ["b", "a1", "a1"],
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("profesor-1", {
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      dni: "12345678Z",
      telefono: "699999999",
      licenciaConducir: "B",
      permisosLicencias: ["B", "A1"],
    });

    expect(result).toEqual(profesorActualizado);
  });

  it("debe lanzar error al actualizar si el email ya existe en otro usuario", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "otro-usuario",
        email: "repetido@autodrive.com",
      }),
      update: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.update("profesor-1", {
        email: "repetido@autodrive.com",
      }),
    ).rejects.toThrow("El email ya existe");

    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it("debe lanzar error al actualizar si el DNI ya existe en otro usuario", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findUserByDni: vi.fn().mockResolvedValue({
        id: "otro-usuario",
        dni: "12345678Z",
      }),
      update: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.update("profesor-1", {
        dni: "12345678Z",
      }),
    ).rejects.toThrow("El DNI ya existe");

    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it("debe desactivar un profesor existente", async () => {
    const profesorDesactivado = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      licenciaConducir: "LIC-123",
      telefono: "600123123",
      rol: "PROFESOR",
      activo: false,
    };

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(profesorDesactivado),
    };

    const service = new ProfesoresService(repositoryMock);

    const result = await service.deactivate("profesor-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("profesor-1");

    expect(result.activo).toBe(false);
  });

  it("debe lanzar error cuando se envía un permiso inválido", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new ProfesoresService(repositoryMock);

    await expect(
      service.create({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        dni: "12345678Z",
        permisosLicencias: ["B", "X"],
        telefono: "600123123",
      }),
    ).rejects.toThrow("Hay permisos de licencia no válidos");
  });
});
