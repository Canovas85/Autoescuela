import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { MatriculasRepository } from "./matriculas.repository.js";
import { MatriculasService } from "./matriculas.service.js";
import { MatriculasController } from "./matriculas.controller.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new MatriculasRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);

const service = new MatriculasService(repository, notificacionesRepository);

const controller = new MatriculasController(service);

/**
 * @swagger
 *   /api/matriculas:
 *     post:
 *       summary: POST /api/matriculas
 *       tags:
 *         - Matriculas
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
 *   /api/matriculas:
 *     get:
 *       summary: GET /api/matriculas
 *       tags:
 *         - Matriculas
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
 *   /api/matriculas/mine:
 *     get:
 *       summary: GET /api/matriculas/mine
 *       tags:
 *         - Matriculas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

/**
 * @swagger
 *   /api/matriculas/{id}:
 *     get:
 *       summary: GET /api/matriculas/{id}
 *       tags:
 *         - Matriculas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 *   /api/matriculas/{id}:
 *     put:
 *       summary: PUT /api/matriculas/{id}
 *       tags:
 *         - Matriculas
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
 *   /api/matriculas/{id}/pagar:
 *     patch:
 *       summary: PATCH /api/matriculas/{id}/pagar
 *       tags:
 *         - Matriculas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch("/:id/pagar", authenticate, controller.pagar.bind(controller));

/**
 * @swagger
 *   /api/matriculas/{id}/anular:
 *     patch:
 *       summary: PATCH /api/matriculas/{id}/anular
 *       tags:
 *         - Matriculas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/anular",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.anular.bind(controller),
);

export default router;
