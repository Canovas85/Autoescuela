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

/**
 * @swagger
 *   /api/examenes:
 *     post:
 *       summary: POST /api/examenes
 *       tags:
 *         - Examenes
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
 *   /api/examenes:
 *     get:
 *       summary: GET /api/examenes
 *       tags:
 *         - Examenes
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
 *   /api/examenes/{id}:
 *     get:
 *       summary: GET /api/examenes/{id}
 *       tags:
 *         - Examenes
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
 *   /api/examenes/{id}:
 *     put:
 *       summary: PUT /api/examenes/{id}
 *       tags:
 *         - Examenes
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
 *   /api/examenes/{id}:
 *     delete:
 *       summary: DELETE /api/examenes/{id}
 *       tags:
 *         - Examenes
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
/**
 * @swagger
 *   /api/examenes/{id}/resultado:
 *     patch:
 *       summary: PATCH /api/examenes/{id}/resultado
 *       tags:
 *         - Examenes
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/resultado",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.registerResult.bind(controller),
);

export default router;
