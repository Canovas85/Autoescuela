import { describe, it, expect, vi } from "vitest";

import { AccountActivationService } from "../account-activation.service.js";

describe("AccountActivationService", () => {
  it("debe generar token, invalidar anteriores y enviar email", async () => {
    const repositoryMock = {
      findUserByIdWithCredentials: vi.fn().mockResolvedValue({
        id: "user-1",
        nombre: "Alumno Demo",
        email: "alumno@demo.com",
        requiereCambioPassword: true,
      }),
      invalidatePendingActivationTokens: vi
        .fn()
        .mockResolvedValue({ count: 1 }),
      createActivationToken: vi.fn().mockResolvedValue({ id: "act-1" }),
    };

    const emailServiceMock = {
      sendActivationEmail: vi.fn().mockResolvedValue(undefined),
    };

    const service = new AccountActivationService(
      repositoryMock,
      emailServiceMock,
      {
        frontendBaseUrl: "http://localhost:5173",
        ttlHours: 24,
      },
    );

    const result = await service.issueActivationForUser({
      usuarioId: "user-1",
    });

    expect(repositoryMock.findUserByIdWithCredentials).toHaveBeenCalledWith(
      "user-1",
    );
    expect(
      repositoryMock.invalidatePendingActivationTokens,
    ).toHaveBeenCalledWith("user-1");
    expect(repositoryMock.createActivationToken).toHaveBeenCalledOnce();
    expect(emailServiceMock.sendActivationEmail).toHaveBeenCalledOnce();
    expect(result.activationUrl).toContain("/activar-cuenta?token=");
  });

  it("debe activar cuenta con token valido", async () => {
    const repositoryMock = {
      findActivationTokenByHash: vi.fn().mockResolvedValue({
        id: "act-1",
        usuarioId: "user-1",
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
        usuario: {
          id: "user-1",
          email: "alumno@demo.com",
        },
      }),
      updatePasswordAndClearFirstLogin: vi
        .fn()
        .mockResolvedValue({ id: "user-1" }),
      markActivationTokenAsUsed: vi.fn().mockResolvedValue({ id: "act-1" }),
      invalidatePendingActivationTokens: vi
        .fn()
        .mockResolvedValue({ count: 0 }),
    };

    const emailServiceMock = {
      sendActivationEmail: vi.fn(),
    };

    const service = new AccountActivationService(
      repositoryMock,
      emailServiceMock,
    );

    const result = await service.activateWithToken({
      token: "token-demo",
      newPassword: "Password123",
      confirmPassword: "Password123",
    });

    expect(
      repositoryMock.updatePasswordAndClearFirstLogin,
    ).toHaveBeenCalledOnce();
    expect(repositoryMock.markActivationTokenAsUsed).toHaveBeenCalledWith(
      "act-1",
    );
    expect(result.message).toBe("Cuenta activada correctamente");
  });
});
