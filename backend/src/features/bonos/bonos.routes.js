import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { BonosRepository } from "./bonos.repository.js";
import { BonosService } from "./bonos.service.js";
import { BonosController } from "./bonos.controller.js";

const router = Router();

const repository = new BonosRepository(prisma);
const service = new BonosService(repository);
const controller = new BonosController(service);

/**
 * @swagger
 *   /api/bonos:
 *     post:
 *       summary: POST /api/bonos
 *       tags:
 *         - Bonos
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
 *   /api/bonos/disponibles:
 *     get:
 *       summary: GET /api/bonos/disponibles
 *       tags:
 *         - Bonos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/disponibles",
  authenticate,
  authorize("ALUMNO"),
  controller.getActivos.bind(controller),
);
/**
 * @swagger
 *   /api/bonos/{id}/comprar:
 *     post:
 *       summary: POST /api/bonos/{id}/comprar
 *       tags:
 *         - Bonos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/:id/comprar",
  authenticate,
  authorize("ALUMNO"),
  controller.createCompraPendiente.bind(controller),
);
/**
 * @swagger
 *   /api/bonos:
 *     get:
 *       summary: GET /api/bonos
 *       tags:
 *         - Bonos
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
 *   /api/bonos/{id}:
 *     get:
 *       summary: GET /api/bonos/{id}
 *       tags:
 *         - Bonos
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
 *   /api/bonos/{id}:
 *     put:
 *       summary: PUT /api/bonos/{id}
 *       tags:
 *         - Bonos
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
 *   /api/bonos/{id}:
 *     delete:
 *       summary: DELETE /api/bonos/{id}
 *       tags:
 *         - Bonos
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
 *   /api/bonos/{id}/activar:
 *     patch:
 *       summary: PATCH /api/bonos/{id}/activar
 *       tags:
 *         - Bonos
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
/**
 * @swagger
 *   /api/bonos/{id}/desactivar:
 *     patch:
 *       summary: PATCH /api/bonos/{id}/desactivar
 *       tags:
 *         - Bonos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/desactivar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.deactivate.bind(controller),
);

export default router;
