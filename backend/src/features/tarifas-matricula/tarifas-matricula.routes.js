import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { TarifasMatriculaRepository } from "./tarifas-matricula.repository.js";
import { TarifasMatriculaService } from "./tarifas-matricula.service.js";
import { TarifasMatriculaController } from "./tarifas-matricula.controller.js";

const router = Router();

const repository = new TarifasMatriculaRepository(prisma);

const service = new TarifasMatriculaService(repository);

const controller = new TarifasMatriculaController(service);

/**
 * @swagger
 *   /api/tarifas-matricula:
 *     post:
 *       summary: POST /api/tarifas-matricula
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula:
 *     get:
 *       summary: GET /api/tarifas-matricula
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula/{id}:
 *     get:
 *       summary: GET /api/tarifas-matricula/{id}
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula/{id}:
 *     put:
 *       summary: PUT /api/tarifas-matricula/{id}
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula/{id}:
 *     delete:
 *       summary: DELETE /api/tarifas-matricula/{id}
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula/{id}/activar:
 *     patch:
 *       summary: PATCH /api/tarifas-matricula/{id}/activar
 *       tags:
 *         - Tarifas Matricula
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
 *   /api/tarifas-matricula/{id}/desactivar:
 *     patch:
 *       summary: PATCH /api/tarifas-matricula/{id}/desactivar
 *       tags:
 *         - Tarifas Matricula
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
