import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { DashboardRepository } from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";
import { DashboardController } from "./dashboard.controller.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new DashboardRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const service = new DashboardService(repository, notificacionesRepository);
const controller = new DashboardController(service);

/**
 * @swagger
 *   /api/dashboard:
 *   get:
 *     summary: Dashboard bÃƒÂ¡sico
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MÃƒÂ©tricas bÃƒÂ¡sicas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
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
 *         description: MÃƒÂ©tricas avanzadas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/advanced",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
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

/**
 * @swagger
 *   /api/dashboard/administrativo:
 *     get:
 *       summary: GET /api/dashboard/administrativo
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/administrativo",
  authenticate,
  authorize("ADMINISTRATIVO"),
  controller.getAdministrativeDashboard.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/soporte:
 *     get:
 *       summary: GET /api/dashboard/soporte
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/soporte",
  authenticate,
  authorize("SOPORTE"),
  controller.getSupportDashboard.bind(controller),
);

/**
 * @swagger
 * /api/dashboard/student:
 *   get:
 *     summary: Dashboard del alumno
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: licencia
 *         schema:
 *           type: string
 *         required: false
 *         description: Licencia del expediente a consultar (ej. B, D). Si se omite, devuelve el expediente actual.
 *     responses:
 *       200:
 *         description: Resumen del alumno autenticado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/student",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentDashboard.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/student/new-license/context:
 *     get:
 *       summary: GET /api/dashboard/student/new-license/context
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/student/new-license/context",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentNewLicenseContext.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/student/new-license/promotions:
 *     get:
 *       summary: GET /api/dashboard/student/new-license/promotions
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/student/new-license/promotions",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentNewLicensePromotions.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/student/new-license:
 *     post:
 *       summary: POST /api/dashboard/student/new-license
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/student/new-license",
  authenticate,
  authorize("ALUMNO"),
  controller.createStudentNewLicenseEnrollment.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor:
 *     get:
 *       summary: GET /api/dashboard/professor
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorDashboard.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/students:
 *     get:
 *       summary: GET /api/dashboard/professor/students
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor/students",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorStudents.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/students/{alumnoId}:
 *     get:
 *       summary: GET /api/dashboard/professor/students/{alumnoId}
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor/students/:alumnoId",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorStudentDetail.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/vehicles:
 *     get:
 *       summary: GET /api/dashboard/professor/vehicles
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor/vehicles",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorVehicles.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/vehicles/{vehiculoId}/schedule:
 *     get:
 *       summary: GET /api/dashboard/professor/vehicles/{vehiculoId}/schedule
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor/vehicles/:vehiculoId/schedule",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorVehicleSchedule.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/agenda:
 *     get:
 *       summary: GET /api/dashboard/professor/agenda
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/professor/agenda",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorAgenda.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/work-schedule:
 *     put:
 *       summary: PUT /api/dashboard/professor/work-schedule
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.put(
  "/professor/work-schedule",
  authenticate,
  authorize("PROFESOR"),
  controller.updateProfessorWorkSchedule.bind(controller),
);

/**
 * @swagger
 *   /api/dashboard/professor/classes/{classId}/status:
 *     patch:
 *       summary: PATCH /api/dashboard/professor/classes/{classId}/status
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.patch(
  "/professor/classes/:classId/status",
  authenticate,
  authorize("PROFESOR"),
  controller.updateProfessorClassStatus.bind(controller),
);

export default router;
