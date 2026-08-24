import { describe, it, expect, vi } from "vitest";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AuthService } from "../auth.service.js";

describe("AuthService", () => {
  it("debe devolver un JWT válido cuando las credenciales son correctas", async () => {
    const plainPassword = "Password123";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const repositoryMock = {
      findUserByEmail: vi.fn().mockResolvedValue({
        id: "user-id",
        email: "admin@autodrive.com",
        passwordHash,
        rol: "ADMIN",
      }),
    };

    process.env.JWT_SECRET = "test-secret";

    const authService = new AuthService(repositoryMock);

    const result = await authService.login(
      "admin@autodrive.com",
      plainPassword,
    );

    const payload = jwt.verify(result.token, process.env.JWT_SECRET);

    expect(payload.id).toBe("user-id");

    expect(payload.email).toBe("admin@autodrive.com");

    expect(payload.rol).toBe("ADMIN");
  });

  it("debe generar un JWT con fecha de expiracion", async () => {
    const plainPassword = "Password123";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const repositoryMock = {
      findUserByEmail: vi.fn().mockResolvedValue({
        id: "user-id",
        email: "admin@autodrive.com",
        passwordHash,
        rol: "ADMIN",
      }),
    };

    process.env.JWT_SECRET = "test-secret";

    const authService = new AuthService(repositoryMock);

    const result = await authService.login(
      "admin@autodrive.com",
      plainPassword,
    );

    const payload = jwt.verify(result.token, process.env.JWT_SECRET);

    expect(payload.id).toBe("user-id");
    expect(payload.email).toBe("admin@autodrive.com");
    expect(payload.rol).toBe("ADMIN");
    expect(payload).toHaveProperty("iat");
    expect(payload).toHaveProperty("exp");
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });
});
