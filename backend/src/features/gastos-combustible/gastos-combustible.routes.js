import { Router } from "express";
import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { GastosCombustibleRepository } from "./gastos-combustible.repository.js";
import { GastosCombustibleService } from "./gastos-combustible.service.js";
import { GastosCombustibleController } from "./gastos-combustible.controller.js";
import { uploadGastoCombustibleRecibo } from "./gastos-combustible.upload.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new GastosCombustibleRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const service = new GastosCombustibleService(
  repository,
  notificacionesRepository,
);
const controller = new GastosCombustibleController(service);

/**
 * @swagger
 *   /api/gastos-combustible:
 *     get:
 *       summary: GET /api/gastos-combustible
 *       tags:
 *         - Gastos Combustible
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
 *   /api/gastos-combustible/mine:
 *     get:
 *       summary: GET /api/gastos-combustible/mine
 *       tags:
 *         - Gastos Combustible
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
 *   /api/gastos-combustible/repostar/{vehiculoId}:
 *     post:
 *       summary: POST /api/gastos-combustible/repostar/{vehiculoId}
 *       tags:
 *         - Gastos Combustible
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/repostar/:vehiculoId",
  authenticate,
  authorize("PROFESOR"),
  uploadGastoCombustibleRecibo.single("recibo"),
  controller.createRefuelExpense.bind(controller),
);

/**
 * @swagger
 *   /api/gastos-combustible/revision-itv/{vehiculoId}:
 *     post:
 *       summary: POST /api/gastos-combustible/revision-itv/{vehiculoId}
 *       tags:
 *         - Gastos Combustible
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/revision-itv/:vehiculoId",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.createItvExpense.bind(controller),
);

export default router;
