import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { TemariosRepository } from "./temarios.repository.js";
import { TemariosService } from "./temarios.service.js";
import { TemariosController } from "./temarios.controller.js";
import { uploadTemarioDocumentacion } from "./temarios.upload.js";

const router = Router();

const repository = new TemariosRepository(prisma);
const service = new TemariosService(repository);
const controller = new TemariosController(service);

/**
 * @swagger
 *   /api/temarios:
 *     post:
 *       summary: POST /api/temarios
 *       tags:
 *         - Temarios
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
 *   /api/temarios:
 *     get:
 *       summary: GET /api/temarios
 *       tags:
 *         - Temarios
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
 *   /api/temarios/mis-temarios:
 *     get:
 *       summary: GET /api/temarios/mis-temarios
 *       tags:
 *         - Temarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mis-temarios",
  authenticate,
  authorize("ALUMNO"),
  controller.getForAlumno.bind(controller),
);
/**
 * @swagger
 *   /api/temarios/mis-temarios/{id}:
 *     get:
 *       summary: GET /api/temarios/mis-temarios/{id}
 *       tags:
 *         - Temarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mis-temarios/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.getTemaForAlumno.bind(controller),
);
/**
 * @swagger
 *   /api/temarios/mis-temarios/{id}/mini-test:
 *     post:
 *       summary: POST /api/temarios/mis-temarios/{id}/mini-test
 *       tags:
 *         - Temarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/mis-temarios/:id/mini-test",
  authenticate,
  authorize("ALUMNO"),
  controller.saveMiniTestResultado.bind(controller),
);
/**
 * @swagger
 *   /api/temarios/{id}:
 *     get:
 *       summary: GET /api/temarios/{id}
 *       tags:
 *         - Temarios
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
 *   /api/temarios/{id}:
 *     put:
 *       summary: PUT /api/temarios/{id}
 *       tags:
 *         - Temarios
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
 *   /api/temarios/{id}/documentacion:
 *     post:
 *       summary: POST /api/temarios/{id}/documentacion
 *       tags:
 *         - Temarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/:id/documentacion",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadTemarioDocumentacion.single("documentacion"),
  controller.uploadDocumentacion.bind(controller),
);
/**
 * @swagger
 *   /api/temarios/{id}:
 *     delete:
 *       summary: DELETE /api/temarios/{id}
 *       tags:
 *         - Temarios
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
