import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { DashboardRepository } from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";
import { DashboardController } from "./dashboard.controller.js";

const router = Router();

const repository = new DashboardRepository(prisma);
const service = new DashboardService(repository);
const controller = new DashboardController(service);

/**
 * @swagger
 *   /api/dashboard:
 *   get:
 *     summary: Dashboard básico
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas básicas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getMetrics.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/advanced:
 *   get:
 *     summary: Dashboard avanzado
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas avanzadas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/advanced",
  authenticate,
  authorize("ADMIN"),
  controller.getAdvancedMetrics.bind(controller),
);

/**
 * @swagger
 * /api/dashboard/executive:
 *   get:
 *     summary: Dashboard ejecutivo
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard ejecutivo
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/executive",
  authenticate,
  authorize("ADMIN"),
  controller.getExecutiveDashboard.bind(controller),
);

export default router;
