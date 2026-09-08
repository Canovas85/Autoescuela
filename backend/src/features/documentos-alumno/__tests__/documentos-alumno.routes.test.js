import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import documentosAlumnoRoutes from "../documentos-alumno.routes.js";
import { fileFilter } from "../documentos-alumno.upload.js";

const app = express();
app.use(express.json());
app.use("/api/documentos-alumno", documentosAlumnoRoutes);

describe("documentos-alumno routes", () => {
  it("debe requerir autenticación para listar documentos del alumno", async () => {
    const response = await request(app).get("/api/documentos-alumno");

    expect(response.status).toBe(401);
  });

  it("acepta PDFs con MIME genérico cuando la extensión es correcta", () => {
    const callback = vi.fn();

    fileFilter(
      {},
      { originalname: "documento.pdf", mimetype: "application/octet-stream" },
      callback,
    );

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it("acepta imágenes JPG con mime alternativo del navegador", () => {
    const callback = vi.fn();

    fileFilter(
      {},
      { originalname: "foto.jpg", mimetype: "image/jpg" },
      callback,
    );

    expect(callback).toHaveBeenCalledWith(null, true);
  });
});
