import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { InformesRepository } from "./informes.repository.js";
import { InformesService } from "./informes.service.js";
import { InformesController } from "./informes.controller.js";

const router = Router();

const repository = new InformesRepository(prisma);
const service = new InformesService(repository);
const controller = new InformesController(service);

/**
 * @swagger
 *   /api/informes/accounting:
 *     get:
 *       summary: GET /api/informes/accounting
 *       tags:
 *         - Informes
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/accounting",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAccountingReport.bind(controller),
);

export default router;
