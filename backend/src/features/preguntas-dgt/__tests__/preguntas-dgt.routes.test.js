import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import preguntasDGTRoutes from "../preguntas-dgt.routes.js";

describe("PreguntasDGT Routes", () => {
  it("debe exponer POST /api/preguntas-dgt", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app)
      .post("/api/preguntas-dgt")
      .send({
        licencia: ["B"],
        enunciado: "¿Pregunta?",
        respuestas: [
          { texto: "A", correcta: true },
          { texto: "B", correcta: false },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
        ],
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/preguntas-dgt", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app).get("/api/preguntas-dgt");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/preguntas-dgt/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app).get("/api/preguntas-dgt/preg-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/preguntas-dgt/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app)
      .put("/api/preguntas-dgt/preg-1")
      .send({
        licencia: ["B"],
        enunciado: "¿Pregunta actualizada?",
        respuestas: [
          { texto: "A", correcta: true },
          { texto: "B", correcta: false },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
        ],
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/preguntas-dgt/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app).delete("/api/preguntas-dgt/preg-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/preguntas-dgt/:id/activar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app).patch(
      "/api/preguntas-dgt/preg-1/activar",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/preguntas-dgt/:id/desactivar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app).patch(
      "/api/preguntas-dgt/preg-1/desactivar",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/preguntas-dgt/generar-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app)
      .post("/api/preguntas-dgt/generar-examen")
      .send({ licencia: "B" });

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/preguntas-dgt/corregir-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/preguntas-dgt", preguntasDGTRoutes);

    const response = await request(app)
      .post("/api/preguntas-dgt/corregir-examen")
      .send({
        licencia: "B",
        preguntas: [{ id: "preg-1" }],
        respuestasAlumno: [{ preguntaId: "preg-1", respuestaId: "r1" }],
      });

    expect(response.status).toBe(401);
  });
});
