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
  "/",
  authenticate,
  authorize("ALUMNO"),
  controller.getAll.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.getById.bind(controller),
);

export default router;
