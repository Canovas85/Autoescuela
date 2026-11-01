import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PreguntasDGTRepository } from "./preguntas-dgt.repository.js";
import { PreguntasDGTService } from "./preguntas-dgt.service.js";
import { PreguntasDGTController } from "./preguntas-dgt.controller.js";
import { uploadPreguntaDGTImagen } from "./preguntas-dgt.upload.js";

const router = Router();

const repository = new PreguntasDGTRepository(prisma);

const service = new PreguntasDGTService(repository);

const controller = new PreguntasDGTController(service);

//
// ADMIN
//

/**
 * @swagger
 *   /api/preguntas-dgt:
 *     post:
 *       summary: POST /api/preguntas-dgt
 *       tags:
 *         - Preguntas Dgt
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
  uploadPreguntaDGTImagen.single("imagen"),
  controller.create.bind(controller),
);

/**
 * @swagger
 *   /api/preguntas-dgt:
 *     get:
 *       summary: GET /api/preguntas-dgt
 *       tags:
 *         - Preguntas Dgt
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
 *   /api/preguntas-dgt/next-id:
 *     get:
 *       summary: GET /api/preguntas-dgt/next-id
 *       tags:
 *         - Preguntas Dgt
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/next-id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getNextId.bind(controller),
);

/**
 * @swagger
 *   /api/preguntas-dgt/{id}:
 *     get:
 *       summary: GET /api/preguntas-dgt/{id}
 *       tags:
 *         - Preguntas Dgt
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
 *   /api/preguntas-dgt/{id}:
 *     put:
 *       summary: PUT /api/preguntas-dgt/{id}
 *       tags:
 *         - Preguntas Dgt
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
  uploadPreguntaDGTImagen.single("imagen"),
  controller.update.bind(controller),
);

/**
 * @swagger
 *   /api/preguntas-dgt/{id}:
 *     delete:
 *       summary: DELETE /api/preguntas-dgt/{id}
 *       tags:
 *         - Preguntas Dgt
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
 *   /api/preguntas-dgt/{id}/activar:
 *     patch:
 *       summary: PATCH /api/preguntas-dgt/{id}/activar
 *       tags:
 *         - Preguntas Dgt
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
 *   /api/preguntas-dgt/{id}/desactivar:
 *     patch:
 *       summary: PATCH /api/preguntas-dgt/{id}/desactivar
 *       tags:
 *         - Preguntas Dgt
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

//
// ALUMNO
//

/**
 * @swagger
 *   /api/preguntas-dgt/generar-examen:
 *     post:
 *       summary: POST /api/preguntas-dgt/generar-examen
 *       tags:
 *         - Preguntas Dgt
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/generar-examen",
  authenticate,
  authorize("ALUMNO"),
  controller.generarExamen.bind(controller),
);

/**
 * @swagger
 *   /api/preguntas-dgt/corregir-examen:
 *     post:
 *       summary: POST /api/preguntas-dgt/corregir-examen
 *       tags:
 *         - Preguntas Dgt
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/corregir-examen",
  authenticate,
  authorize("ALUMNO"),
  controller.corregirExamen.bind(controller),
);

export default router;
