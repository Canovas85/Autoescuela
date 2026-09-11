import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ConvocatoriasExamenRepository } from "./convocatorias-examen.repository.js";
import { ConvocatoriasExamenService } from "./convocatorias-examen.service.js";
import { ConvocatoriasExamenController } from "./convocatorias-examen.controller.js";

const router = Router();

const repository = new ConvocatoriasExamenRepository(prisma);
const service = new ConvocatoriasExamenService(repository);
const controller = new ConvocatoriasExamenController(service);

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
  "/agenda",
  authenticate,
  authorize("ADMIN"),
  controller.getAgenda.bind(controller),
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

export default router;
