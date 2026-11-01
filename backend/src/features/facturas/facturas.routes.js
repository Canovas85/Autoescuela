import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { EmailService } from "../../shared/services/email.service.js";

import { FacturasRepository } from "./facturas.repository.js";
import { FacturasService } from "./facturas.service.js";
import { FacturasController } from "./facturas.controller.js";

const router = Router();

const repository = new FacturasRepository(prisma);
const emailService = new EmailService();
const service = new FacturasService(repository, emailService);
const controller = new FacturasController(service);

/**
 * @swagger
 *   /api/facturas:
 *     get:
 *       summary: GET /api/facturas
 *       tags:
 *         - Facturas
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
 *   /api/facturas/mine:
 *     get:
 *       summary: GET /api/facturas/mine
 *       tags:
 *         - Facturas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

/**
 * @swagger
 *   /api/facturas/{id}/preview:
 *     get:
 *       summary: GET /api/facturas/{id}/preview
 *       tags:
 *         - Facturas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id/preview",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "ALUMNO"),
  controller.getPreview.bind(controller),
);

/**
 * @swagger
 *   /api/facturas/{id}/pdf:
 *     get:
 *       summary: GET /api/facturas/{id}/pdf
 *       tags:
 *         - Facturas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id/pdf",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "ALUMNO"),
  controller.getPdf.bind(controller),
);

/**
 * @swagger
 *   /api/facturas/{id}/send-duplicate:
 *     post:
 *       summary: POST /api/facturas/{id}/send-duplicate
 *       tags:
 *         - Facturas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/:id/send-duplicate",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.sendDuplicate.bind(controller),
);

export default router;
