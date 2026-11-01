import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { NominasRepository } from "./nominas.repository.js";
import { NominasService } from "./nominas.service.js";
import { NominasController } from "./nominas.controller.js";

const router = Router();

const repository = new NominasRepository(prisma);
const service = new NominasService(repository);
const controller = new NominasController(service);

/**
 * @swagger
 *   /api/nominas:
 *     get:
 *       summary: GET /api/nominas
 *       tags:
 *         - Nominas
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
 *   /api/nominas/mine:
 *     get:
 *       summary: GET /api/nominas/mine
 *       tags:
 *         - Nominas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine",
  authenticate,
  authorize("PROFESOR"),
  controller.getMine.bind(controller),
);

/**
 * @swagger
 *   /api/nominas/generar:
 *     post:
 *       summary: POST /api/nominas/generar
 *       tags:
 *         - Nominas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/generar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.generateMonth.bind(controller),
);

/**
 * @swagger
 *   /api/nominas/{id}/preview:
 *     get:
 *       summary: GET /api/nominas/{id}/preview
 *       tags:
 *         - Nominas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id/preview",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.getPreview.bind(controller),
);

/**
 * @swagger
 *   /api/nominas/{id}/pdf:
 *     get:
 *       summary: GET /api/nominas/{id}/pdf
 *       tags:
 *         - Nominas
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id/pdf",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.getPdf.bind(controller),
);

export default router;
