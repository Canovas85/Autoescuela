import { describe, it, expect, vi } from "vitest";

import { authorize } from "../role.middleware.js";

describe("Role Middleware", () => {
    it("debe permitir el acceso cuando el usuario tiene un rol autorizado", () => {
        const req = {
            user: {
            id: "user-id",
            rol: "ADMIN"
        }
    };

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    };

    const next = vi.fn();

    authorize("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
});

    it("debe devolver 403 cuando el usuario no tiene un rol autorizado", () => {
        const req = {
            user: {
            id: "user-id",
            rol: "ALUMNO"
        }
    };

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    };

    const next = vi.fn();

    authorize("ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(
        403
    );

    expect(res.json).toHaveBeenCalledWith({
        message: "No tiene permisos"
    });

    expect(next).not.toHaveBeenCalled();
    });

    it("debe devolver 403 cuando el usuario no tiene rol definido", () => {
        const req = {
            user: {
                id: "user-id"
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        authorize("ADMIN")(req, res, next);

        expect(res.status).toHaveBeenCalledWith(
            403
        );

        expect(res.json).toHaveBeenCalledWith({
            message: "No tiene permisos"
        });

        expect(next).not.toHaveBeenCalled();
    });
});