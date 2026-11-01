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

/**
 * @swagger
 *   /api/convocatorias-examen:
 *     post:
 *       summary: POST /api/convocatorias-examen
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.create.bind(controller),
);

/**
 * @swagger
 *   /api/convocatorias-examen:
 *     get:
 *       summary: GET /api/convocatorias-examen
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 *   /api/convocatorias-examen/agenda:
 *     get:
 *       summary: GET /api/convocatorias-examen/agenda
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/agenda",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAgenda.bind(controller),
);

/**
 * @swagger
 *   /api/convocatorias-examen/{id}:
 *     put:
 *       summary: PUT /api/convocatorias-examen/{id}
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.update.bind(controller),
);

/**
 * @swagger
 *   /api/convocatorias-examen/{id}/delete-impact:
 *     get:
 *       summary: GET /api/convocatorias-examen/{id}/delete-impact
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id/delete-impact",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getDeleteImpact.bind(controller),
);

/**
 * @swagger
 *   /api/convocatorias-examen/{id}:
 *     delete:
 *       summary: DELETE /api/convocatorias-examen/{id}
 *       tags:
 *         - Convocatorias Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.delete.bind(controller),
);

export default router;
