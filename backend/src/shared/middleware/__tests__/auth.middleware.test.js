import { describe, it, expect, vi } from "vitest";
import { authenticate } from "../auth.middleware.js";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
    it("debe devolver 401 cuando el token es inválido", () => {
        const req = {
            headers: {
                authorization: "Bearer token-invalido"
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            message: "Token inválido"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("debe decolver 401 cuando no hay token", () => {
        const req = {
            headers: {}
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();
        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            message: "Token no enviado"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("debe devolver 401 cuando el token ha expirado", () => {
        process.env.JWT_SECRET = "test-secret";

        const expiredToken = jwt.sign(
            {
                id: "user-id", 
                email: "admin@autodrive.com",
                rol: "ADMIN"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "-1s"
            }
        );

        const req = {
            headers: {
                authorization: `Bearer ${expiredToken}`
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            message: "Token expirado"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("debe permitir el acceso y guardar el usuario en req.user cuando el token es válido", () => {
        process.env.JWT_SECRET = "test-secret"; 

        const validToken = jwt.sign(
        {
            id: "user-id",
            email: "admin@autodrive.com",
            rol: "ADMIN"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
);


        const req = {
            headers: {
                authorization: `Bearer ${validToken}`
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        authenticate(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user.id).toBe("user-id");

        expect(req.user.email).toBe("admin@autodrive.com");

        expect(req.user.rol).toBe("ADMIN");

        expect(next).toHaveBeenCalledOnce();

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});