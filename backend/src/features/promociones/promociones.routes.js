import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PromocionesRepository } from "./promociones.repository.js";
import { PromocionesService } from "./promociones.service.js";
import { PromocionesController } from "./promociones.controller.js";

import { uploadPromocionImagen } from "./promociones.upload.js";

const router = Router();

const repository = new PromocionesRepository(prisma);

const service = new PromocionesService(repository);

const controller = new PromocionesController(service);

/**
 * @swagger
 *   /api/promociones:
 *     post:
 *       summary: POST /api/promociones
 *       tags:
 *         - Promociones
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
  uploadPromocionImagen.single("imagen"),
  controller.create.bind(controller),
);

/**
 * @swagger
 *   /api/promociones:
 *     get:
 *       summary: GET /api/promociones
 *       tags:
 *         - Promociones
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
 *   /api/promociones/public:
 *     get:
 *       summary: GET /api/promociones/public
 *       tags:
 *         - Promociones
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get("/public", controller.getPublic.bind(controller));

/**
 * @swagger
 *   /api/promociones/{id}:
 *     get:
 *       summary: GET /api/promociones/{id}
 *       tags:
 *         - Promociones
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
 *   /api/promociones/{id}:
 *     put:
 *       summary: PUT /api/promociones/{id}
 *       tags:
 *         - Promociones
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
  uploadPromocionImagen.single("imagen"),
  controller.update.bind(controller),
);

/**
 * @swagger
 *   /api/promociones/{id}:
 *     delete:
 *       summary: DELETE /api/promociones/{id}
 *       tags:
 *         - Promociones
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
 *   /api/promociones/{id}/activar:
 *     patch:
 *       summary: PATCH /api/promociones/{id}/activar
 *       tags:
 *         - Promociones
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
 *   /api/promociones/{id}/desactivar:
 *     patch:
 *       summary: PATCH /api/promociones/{id}/desactivar
 *       tags:
 *         - Promociones
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
