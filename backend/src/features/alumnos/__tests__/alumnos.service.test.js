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
      dni: "12345678Z",
      fechaNacimiento: "15/06/1998",
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
  it("debe almacenar la contraseña cifrada con bcrypt en passwordHash", async () => {
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
      dni: "12345678Z",
      fechaNacimiento: "15/06/1998",
      tipoLicencia: "B",
    });

    expect(result.passwordHash).toBeDefined();
    expect(result.passwordHash).not.toBe(plainPassword);

    const isValid = await bcrypt.compare(plainPassword, result.passwordHash);

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
      dni: "12345678Z",
      fechaNacimiento: "15/06/1998",
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
      dni: "12345678Z",
      fechaNacimiento: "15/06/1998",
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
  it("debe aceptar la propiedad tipoLicenciaObjetivo en la creación", async () => {
    const alumnoCreado = {
      id: "alumno-id",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      rol: "ALUMNO",
      telefono: "600123123",
      tipoLicenciaObjetivo: "B",
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
      dni: "12345678Z",
      fechaNacimiento: "15/06/1998",
      tipoLicenciaObjetivo: "B",
    });

    expect(result).toEqual(alumnoCreado);
    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoLicenciaObjetivo: "B",
        rol: "ALUMNO",
      }),
    );
  });
  it("debe lanzar un error cuando el nombre es obligatorio", async () => {
    const repositoryMock = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new AlumnosService(repositoryMock);

    await expect(
      service.create({
        email: "pedro@autodrive.com",
        password: "Password123",
        telefono: "600123123",
        tipoLicencia: "B",
      }),
    ).rejects.toThrow("El nombre es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe aceptar dni y fechaNacimiento válidos en formato español en la creación", async () => {
    const fechaNacimiento = "15/06/1998";
    const alumnoCreado = {
      id: "alumno-id",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      dni: "12345678Z",
      fechaNacimiento,
      rol: "ALUMNO",
      telefono: "600123123",
      tipoLicenciaObjetivo: "B",
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
      dni: "12345678Z",
      fechaNacimiento,
      tipoLicenciaObjetivo: "B",
    });

    expect(result).toEqual(alumnoCreado);
    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        dni: "12345678Z",
        fechaNacimiento: new Date(1998, 5, 15),
        tipoLicenciaObjetivo: "B",
      }),
    );
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
  it("debe lanzar un error cuando el DNI tiene un formato inválido", async () => {
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
        telefono: "600123123",
        dni: "abc",
        tipoLicenciaObjetivo: "B",
      }),
    ).rejects.toThrow("El DNI debe tener un formato válido");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha de nacimiento no es válida", async () => {
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
        telefono: "600123123",
        dni: "12345678Z",
        fechaNacimiento: "no-es-una-fecha",
        tipoLicenciaObjetivo: "B",
      }),
    ).rejects.toThrow("La fecha de nacimiento debe ser una fecha válida");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la licencia objetivo no es un valor permitido", async () => {
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
        telefono: "600123123",
        dni: "12345678Z",
        fechaNacimiento: "15/06/1998",
        tipoLicenciaObjetivo: "Z",
      }),
    ).rejects.toThrow(
      "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
    );

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
  it("debe lanzar un error cuando el DNI es obligatorio", async () => {
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
        telefono: "600123123",
        fechaNacimiento: "15/06/1998",
        tipoLicencia: "B",
      }),
    ).rejects.toThrow("El DNI es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha de nacimiento es obligatoria", async () => {
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
        telefono: "600123123",
        dni: "12345678Z",
        tipoLicencia: "B",
      }),
    ).rejects.toThrow("La fecha de nacimiento es obligatoria");

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

    const matriculasRepositoryMock = {
      findActiveByAlumnoId: vi.fn().mockResolvedValue(null),
    };

    const service = new AlumnosService(
      repositoryMock,
      null,
      matriculasRepositoryMock,
    );

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
