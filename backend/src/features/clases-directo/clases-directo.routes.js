import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ClasesDirectoRepository } from "./clases-directo.repository.js";
import { ClasesDirectoService } from "./clases-directo.service.js";
import { ClasesDirectoController } from "./clases-directo.controller.js";

const router = Router();

const repository = new ClasesDirectoRepository(prisma);
const service = new ClasesDirectoService(repository);
const controller = new ClasesDirectoController(service);

router.get(
  "/alumno",
  authenticate,
  authorize("ALUMNO"),
  controller.getAllActive.bind(controller),
);

router.get(
  "/",
  authenticate,
  authorize("ALUMNO", "ADMIN"),
  controller.getAll.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ALUMNO", "ADMIN"),
  controller.getById.bind(controller),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
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
  controller.deactivate.bind(controller),
);

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN"),
  controller.activate.bind(controller),
);

export default router;
