import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { NominasRepository } from "./nominas.repository.js";
import { NominasService } from "./nominas.service.js";
import { NominasController } from "./nominas.controller.js";

const router = Router();

const repository = new NominasRepository(prisma);
const service = new NominasService(repository);
const controller = new NominasController(service);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);

router.get(
  "/mine",
  authenticate,
  authorize("PROFESOR"),
  controller.getMine.bind(controller),
);

router.post(
  "/generar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.generateMonth.bind(controller),
);

router.get(
  "/:id/preview",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.getPreview.bind(controller),
);

router.get(
  "/:id/pdf",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.getPdf.bind(controller),
);

export default router;
