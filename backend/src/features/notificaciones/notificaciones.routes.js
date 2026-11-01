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

/**
 * @swagger
 *   /api/notificaciones/stream:
 *     get:
 *       summary: GET /api/notificaciones/stream
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get("/stream", controller.stream.bind(controller));

/**
 * @swagger
 *   /api/notificaciones/mine:
 *     get:
 *       summary: GET /api/notificaciones/mine
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "SOPORTE", "PROFESOR", "ALUMNO"),
  controller.getMine.bind(controller),
);

/**
 * @swagger
 *   /api/notificaciones/mine/read-all:
 *     patch:
 *       summary: PATCH /api/notificaciones/mine/read-all
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/mine/read-all",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "SOPORTE", "PROFESOR", "ALUMNO"),
  controller.markAllMineAsRead.bind(controller),
);

/**
 * @swagger
 *   /api/notificaciones/{id}/read:
 *     patch:
 *       summary: PATCH /api/notificaciones/{id}/read
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/read",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "SOPORTE", "PROFESOR", "ALUMNO"),
  controller.markMineAsRead.bind(controller),
);

/**
 * @swagger
 *   /api/notificaciones/{id}/archive:
 *     patch:
 *       summary: PATCH /api/notificaciones/{id}/archive
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/archive",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "SOPORTE", "PROFESOR", "ALUMNO"),
  controller.archiveMine.bind(controller),
);

/**
 * @swagger
 *   /api/notificaciones/{id}/unarchive:
 *     patch:
 *       summary: PATCH /api/notificaciones/{id}/unarchive
 *       tags:
 *         - Notificaciones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/unarchive",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "SOPORTE", "PROFESOR", "ALUMNO"),
  controller.unarchiveMine.bind(controller),
);

export default router;
