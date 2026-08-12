import { describe, it, expect, vi } from "vitest";

import { ProfesoresRepository } from "../profesores.repository.js";

describe("ProfesoresRepository", () => {
    it("debe crear un profesor utilizando Prisma", async () => {
        const profesor = {
            nombre: "Juan Pérez",
            email: "juan@autodrive.com",
            password: "hashed-password",
            licenciaConducir: "LIC-123",
            telefono: "600123123",
            rol: "PROFESOR",
            activo: true
        };

        const prismaMock = {
            profesor: {
                create: vi.fn().mockResolvedValue({
                id: "profesor-id",
                ...profesor
                })
            }
        };

        const repository =
            new ProfesoresRepository(
                prismaMock
        );

        const result = await repository.create(profesor);

        expect(
            prismaMock.profesor.create
        ).toHaveBeenCalledTimes(1);

        expect(result.id).toBe(
            "profesor-id"
        );
    });

    it("debe buscar un profesor por email", async () => {
        const profesor = {
            id: "profesor-id",
            email: "juan@autodrive.com",
            nombre: "Juan Pérez"
        };

        const prismaMock = {
            profesor: {
                findFirst: vi.fn().mockResolvedValue(
                    profesor
                )
            }
        };

        const repository =
            new ProfesoresRepository(
                prismaMock
            );

        const result = await repository.findByEmail(
            "juan@autodrive.com"
        );

        expect(
            prismaMock.profesor.findFirst
            ).toHaveBeenCalledWith({
                where: {
                    email: "juan@autodrive.com"
                }
            });

        expect(result).toEqual(
            profesor
        );
    });


    it("debe devolver todos los profesores", async () => {
        const profesores = [
        {
            id: "profesor-1",
            nombre: "Juan Pérez"
        },
        {
            id: "profesor-2",
            nombre: "Ana García"
        }
        ];

        const prismaMock = {
            profesor: {
                findMany: vi.fn().mockResolvedValue(
                profesores
                )
            }
        };

        const repository =
            new ProfesoresRepository(
                prismaMock
            );

        const result =
            await repository.findAll();

        expect(
            prismaMock.profesor.findMany
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual(
            profesores
        );
    });


    it("debe devolver un profesor por id", async () => {
        const profesor = {
            id: "profesor-1",
            nombre: "Juan Pérez",
            email: "juan@autodrive.com"
        };

        const prismaMock = {
            profesor: {
                findUnique: vi.fn().mockResolvedValue(
                    profesor
                )
            }
        };
   

        const repository =
            new ProfesoresRepository(
                prismaMock
            );

        const result =
            await repository.findById(
                "profesor-1"
        );

        expect(
            prismaMock.profesor.findUnique
                ).toHaveBeenCalledWith({
                    where: {
                        id: "profesor-1"
                    }
                });

        expect(result).toEqual(
            profesor
        );
    });


    it("debe actualizar un profesor existente", async () => {
        const profesorActualizado = {
            id: "profesor-1",
            nombre: "Juan Pérez Actualizado",
            telefono: "699999999"
        };

        const prismaMock = {
            profesor: {
                update: vi.fn().mockResolvedValue(
                profesorActualizado
                )
            }
        };

        const repository =
            new ProfesoresRepository(
                prismaMock
            );

        const result =
            await repository.update(
                "profesor-1",
                {
                    nombre: "Juan Pérez Actualizado",
                    telefono: "699999999"
                }
            );

        expect(
            prismaMock.profesor.update
        ).toHaveBeenCalledWith({
            where: {
                id: "profesor-1"
            },
            data: {
                nombre: "Juan Pérez Actualizado",
                telefono: "699999999"
            }
        });

        expect(result).toEqual(
            profesorActualizado
            );
    });

    it("debe realizar la baja lógica de un profesor", async () => {
        const profesorDesactivado = {
            id: "profesor-1",
            nombre: "Juan Pérez",
            activo: false
        };

        const prismaMock = {
            profesor: {
                update: vi.fn().mockResolvedValue(
                    profesorDesactivado
                )
            }
        };

        const repository =
            new ProfesoresRepository(
                prismaMock
            );

        const result =
            await repository.deactivate(
                "profesor-1"
            );

        expect(
            prismaMock.profesor.update
        ).toHaveBeenCalledWith({
        where: {
            id: "profesor-1"
        },
        data: {
            activo: false
        }
    });

    expect(result).toEqual(
        profesorDesactivado
        );
    });




});
