import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import informesRoutes from "../informes.routes.js";

describe("Informes Routes", () => {
  it("expone GET /api/informes/accounting", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/informes", informesRoutes);

    const response = await request(app).get("/api/informes/accounting");

    expect(response.status).toBe(401);
  });
});
