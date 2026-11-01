import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { OtrosUsuariosRepository } from "./otros-usuarios.repository.js";
import { OtrosUsuariosService } from "./otros-usuarios.service.js";
import { OtrosUsuariosController } from "./otros-usuarios.controller.js";

const router = Router();

const repository = new OtrosUsuariosRepository(prisma);
const service = new OtrosUsuariosService(repository);
const controller = new OtrosUsuariosController(service);

/**
 * @swagger
 *   /api/otros-usuarios:
 *     get:
 *       summary: GET /api/otros-usuarios
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}:
 *     get:
 *       summary: GET /api/otros-usuarios/{id}
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios:
 *     post:
 *       summary: POST /api/otros-usuarios
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.create.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}:
 *     put:
 *       summary: PUT /api/otros-usuarios/{id}
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.update.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}/activar:
 *     patch:
 *       summary: PATCH /api/otros-usuarios/{id}/activar
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.activate.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}:
 *     delete:
 *       summary: DELETE /api/otros-usuarios/{id}
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.deactivate.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}/hard-delete:
 *     delete:
 *       summary: DELETE /api/otros-usuarios/{id}/hard-delete
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.delete(
  "/:id/hard-delete",
  authenticate,
  authorize("ADMIN"),
  controller.hardDelete.bind(controller),
);

/**
 * @swagger
 *   /api/otros-usuarios/{id}/reset-password:
 *     patch:
 *       summary: PATCH /api/otros-usuarios/{id}/reset-password
 *       tags:
 *         - Otros Usuarios
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/reset-password",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.resetPassword.bind(controller),
);

export default router;
