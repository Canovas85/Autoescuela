import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ConvocatoriasTeoricoRepository } from "./convocatorias-teorico.repository.js";
import { ConvocatoriasTeoricoService } from "./convocatorias-teorico.service.js";
import { ConvocatoriasTeoricoController } from "./convocatorias-teorico.controller.js";

const router = Router();

const repository = new ConvocatoriasTeoricoRepository(prisma);
const service = new ConvocatoriasTeoricoService(repository);
const controller = new ConvocatoriasTeoricoController(service);

/**
 * @swagger
 *   /api/convocatorias-teorico:
 *     post:
 *       summary: POST /api/convocatorias-teorico
 *       tags:
 *         - Convocatorias Teorico
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
 *   /api/convocatorias-teorico:
 *     get:
 *       summary: GET /api/convocatorias-teorico
 *       tags:
 *         - Convocatorias Teorico
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
 *   /api/convocatorias-teorico/{id}:
 *     put:
 *       summary: PUT /api/convocatorias-teorico/{id}
 *       tags:
 *         - Convocatorias Teorico
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
 *   /api/convocatorias-teorico/{id}:
 *     delete:
 *       summary: DELETE /api/convocatorias-teorico/{id}
 *       tags:
 *         - Convocatorias Teorico
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
