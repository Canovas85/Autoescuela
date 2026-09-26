import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ConvocatoriasExamenRepository } from "./convocatorias-examen.repository.js";
import { ConvocatoriasExamenService } from "./convocatorias-examen.service.js";
import { ConvocatoriasExamenController } from "./convocatorias-examen.controller.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new ConvocatoriasExamenRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const service = new ConvocatoriasExamenService(
  repository,
  notificacionesRepository,
);
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

router.get(
  "/:id/delete-impact",
  authenticate,
  authorize("ADMIN"),
  controller.getDeleteImpact.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete.bind(controller),
);

export default router;
