import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { FacturasRepository } from "./facturas.repository.js";
import { FacturasService } from "./facturas.service.js";
import { FacturasController } from "./facturas.controller.js";

const router = Router();

const repository = new FacturasRepository(prisma);
const service = new FacturasService(repository);
const controller = new FacturasController(service);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

router.get(
  "/mine",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

export default router;
