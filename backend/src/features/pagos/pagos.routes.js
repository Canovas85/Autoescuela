import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PagosRepository } from "./pagos.repository.js";
import { PagosService } from "./pagos.service.js";
import { PagosController } from "./pagos.controller.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";
import { SolicitudesExamenRepository } from "../solicitudes-examen/solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "../solicitudes-examen/solicitudes-examen.service.js";
import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";

const router = Router();

const repository = new PagosRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const solicitudesExamenRepository = new SolicitudesExamenRepository(prisma);
const solicitudesExamenService = new SolicitudesExamenService(
  solicitudesExamenRepository,
  tasaDgtConfig,
);
const service = new PagosService(
  repository,
  notificacionesRepository,
  solicitudesExamenService,
);
const controller = new PagosController(service);

/**
 * @swagger
 *   /api/pagos:
 *     get:
 *       summary: GET /api/pagos
 *       tags:
 *         - Pagos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 *   /api/pagos/mine:
 *     get:
 *       summary: GET /api/pagos/mine
 *       tags:
 *         - Pagos
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
 *   /api/pagos/{id}:
 *     get:
 *       summary: GET /api/pagos/{id}
 *       tags:
 *         - Pagos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.getMineById.bind(controller),
);

/**
 * @swagger
 *   /api/pagos/{id}/pagar:
 *     patch:
 *       summary: PATCH /api/pagos/{id}/pagar
 *       tags:
 *         - Pagos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/:id/pagar",
  authenticate,
  authorize("ALUMNO"),
  controller.payMine.bind(controller),
);

export default router;
