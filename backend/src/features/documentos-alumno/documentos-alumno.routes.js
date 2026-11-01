import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { DocumentosAlumnoRepository } from "./documentos-alumno.repository.js";
import { DocumentosAlumnoService } from "./documentos-alumno.service.js";
import { DocumentosAlumnoController } from "./documentos-alumno.controller.js";
import { uploadDocumentosAlumno } from "./documentos-alumno.upload.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new DocumentosAlumnoRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const service = new DocumentosAlumnoService(
  repository,
  notificacionesRepository,
);
const controller = new DocumentosAlumnoController(service);

/**
 * @swagger
 *   /api/documentos-alumno:
 *     get:
 *       summary: GET /api/documentos-alumno
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

/**
 * @swagger
 *   /api/documentos-alumno/admin:
 *     get:
 *       summary: GET /api/documentos-alumno/admin
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAllAdmin.bind(controller),
);

/**
 * @swagger
 *   /api/documentos-alumno:
 *     post:
 *       summary: POST /api/documentos-alumno
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/",
  authenticate,
  authorize("ALUMNO"),
  uploadDocumentosAlumno.array("archivos", 10),
  controller.create.bind(controller),
);

/**
 * @swagger
 *   /api/documentos-alumno/{id}:
 *     put:
 *       summary: PUT /api/documentos-alumno/{id}
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.put(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  uploadDocumentosAlumno.array("archivos", 10),
  controller.update.bind(controller),
);

/**
 * @swagger
 *   /api/documentos-alumno/{id}:
 *     delete:
 *       summary: DELETE /api/documentos-alumno/{id}
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.remove.bind(controller),
);

/**
 * @swagger
 *   /api/documentos-alumno/{id}/validar:
 *     patch:
 *       summary: PATCH /api/documentos-alumno/{id}/validar
 *       tags:
 *         - Documentos Alumno
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/validar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.validate.bind(controller),
);

export default router;
