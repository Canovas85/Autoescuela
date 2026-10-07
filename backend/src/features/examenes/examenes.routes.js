import { Router } from "express";

import prisma from "../../config/prisma.js";
import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ExamenesRepository } from "./examenes.repository.js";
import { ExamenesService } from "./examenes.service.js";
import { ExamenesController } from "./examenes.controller.js";

const router = Router();

const repository = new ExamenesRepository(prisma);
const service = new ExamenesService(repository, tasaDgtConfig);
const controller = new ExamenesController(service);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.create.bind(controller),
);
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getById.bind(controller),
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.update.bind(controller),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.delete.bind(controller),
);
router.patch(
  "/:id/resultado",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.registerResult.bind(controller),
);

export default router;
