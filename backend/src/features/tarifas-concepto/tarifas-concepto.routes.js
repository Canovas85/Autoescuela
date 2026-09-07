import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { TarifasConceptoRepository } from "./tarifas-concepto.repository.js";
import { TarifasConceptoService } from "./tarifas-concepto.service.js";
import { TarifasConceptoController } from "./tarifas-concepto.controller.js";

const router = Router();

const repository = new TarifasConceptoRepository(prisma);
const service = new TarifasConceptoService(repository);
const controller = new TarifasConceptoController(service);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete.bind(controller),
);

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN"),
  controller.activate.bind(controller),
);

router.patch(
  "/:id/desactivar",
  authenticate,
  authorize("ADMIN"),
  controller.deactivate.bind(controller),
);

export default router;
