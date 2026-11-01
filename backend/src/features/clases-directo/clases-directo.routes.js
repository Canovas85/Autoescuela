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

/**
 * @swagger
 *   /api/clases-directo/alumno:
 *     get:
 *       summary: GET /api/clases-directo/alumno
 *       tags:
 *         - Clases Directo
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/alumno",
  authenticate,
  authorize("ALUMNO"),
  controller.getAllActive.bind(controller),
);

/**
 * @swagger
 *   /api/clases-directo:
 *     get:
 *       summary: GET /api/clases-directo
 *       tags:
 *         - Clases Directo
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/",
  authenticate,
  authorize("ALUMNO", "ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 *   /api/clases-directo/{id}:
 *     get:
 *       summary: GET /api/clases-directo/{id}
 *       tags:
 *         - Clases Directo
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id",
  authenticate,
  authorize("ALUMNO", "ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 *   /api/clases-directo:
 *     post:
 *       summary: POST /api/clases-directo
 *       tags:
 *         - Clases Directo
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
 *   /api/clases-directo/{id}:
 *     put:
 *       summary: PUT /api/clases-directo/{id}
 *       tags:
 *         - Clases Directo
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
 *   /api/clases-directo/{id}:
 *     delete:
 *       summary: DELETE /api/clases-directo/{id}
 *       tags:
 *         - Clases Directo
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
  controller.deactivate.bind(controller),
);

/**
 * @swagger
 *   /api/clases-directo/{id}/activar:
 *     patch:
 *       summary: PATCH /api/clases-directo/{id}/activar
 *       tags:
 *         - Clases Directo
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.activate.bind(controller),
);

export default router;
