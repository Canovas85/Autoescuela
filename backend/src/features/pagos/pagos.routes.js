import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PagosRepository } from "./pagos.repository.js";
import { PagosService } from "./pagos.service.js";
import { PagosController } from "./pagos.controller.js";

const router = Router();

const repository = new PagosRepository(prisma);
const service = new PagosService(repository);
const controller = new PagosController(service);

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

router.get(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.getMineById.bind(controller),
);

router.patch(
  "/:id/pagar",
  authenticate,
  authorize("ALUMNO"),
  controller.payMine.bind(controller),
);

export default router;
