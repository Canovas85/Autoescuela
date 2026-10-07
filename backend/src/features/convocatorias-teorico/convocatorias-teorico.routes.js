import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ConvocatoriasTeoricoRepository } from "./convocatorias-teorico.repository.js";
import { ConvocatoriasTeoricoService } from "./convocatorias-teorico.service.js";
import { ConvocatoriasTeoricoController } from "./convocatorias-teorico.controller.js";

const router = Router();

const repository = new ConvocatoriasTeoricoRepository(prisma);
const service = new ConvocatoriasTeoricoService(repository);
const controller = new ConvocatoriasTeoricoController(service);

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

export default router;
