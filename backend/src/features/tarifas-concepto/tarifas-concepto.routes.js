import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { TarifasConceptoRepository } from "./tarifas-concepto.repository.js";
import { TarifasConceptoService } from "./tarifas-concepto.service.js";
import { TarifasConceptoController } from "./tarifas-concepto.controller.js";

const router = Router();

const repository = new TarifasConceptoRepository(prisma);
const service = new TarifasConceptoService(repository);
const controller = new TarifasConceptoController(service);

/**
 * @swagger
 *   /api/tarifas-concepto:
 *     post:
 *       summary: POST /api/tarifas-concepto
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto:
 *     get:
 *       summary: GET /api/tarifas-concepto
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto/{id}:
 *     get:
 *       summary: GET /api/tarifas-concepto/{id}
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto/{id}:
 *     put:
 *       summary: PUT /api/tarifas-concepto/{id}
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto/{id}:
 *     delete:
 *       summary: DELETE /api/tarifas-concepto/{id}
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto/{id}/activar:
 *     patch:
 *       summary: PATCH /api/tarifas-concepto/{id}/activar
 *       tags:
 *         - Tarifas Concepto
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
 *   /api/tarifas-concepto/{id}/desactivar:
 *     patch:
 *       summary: PATCH /api/tarifas-concepto/{id}/desactivar
 *       tags:
 *         - Tarifas Concepto
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
