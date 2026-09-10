import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { NotificacionesRepository } from "./notificaciones.repository.js";
import { NotificacionesService } from "./notificaciones.service.js";
import { NotificacionesController } from "./notificaciones.controller.js";

const router = Router();

const repository = new NotificacionesRepository(prisma);
const service = new NotificacionesService(repository);
const controller = new NotificacionesController(service);

router.get(
  "/mine",
  authenticate,
  authorize("ADMIN", "PROFESOR", "ALUMNO"),
  controller.getMine.bind(controller),
);

router.patch(
  "/mine/read-all",
  authenticate,
  authorize("ADMIN", "PROFESOR", "ALUMNO"),
  controller.markAllMineAsRead.bind(controller),
);

router.patch(
  "/:id/read",
  authenticate,
  authorize("ADMIN", "PROFESOR", "ALUMNO"),
  controller.markMineAsRead.bind(controller),
);

export default router;
