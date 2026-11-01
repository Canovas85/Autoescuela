import { Router } from "express";
import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { HojasRutaRepository } from "./hojas-ruta.repository.js";
import { HojasRutaService } from "./hojas-ruta.service.js";
import { HojasRutaController } from "./hojas-ruta.controller.js";

const router = Router();

const repository = new HojasRutaRepository(prisma);
const service = new HojasRutaService(repository);
const controller = new HojasRutaController(service);

/**
 * @swagger
 *   /api/hojas-ruta/catalogo-faltas:
 *     get:
 *       summary: GET /api/hojas-ruta/catalogo-faltas
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/catalogo-faltas",
  authenticate,
  authorize("ADMIN", "PROFESOR", "ALUMNO"),
  controller.getFaultCatalog.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/profesor:
 *     get:
 *       summary: GET /api/hojas-ruta/mine/profesor
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/profesor",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorDashboard.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/profesor/{claseId}:
 *     get:
 *       summary: GET /api/hojas-ruta/mine/profesor/{claseId}
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/profesor/:claseId",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorRoadmapDetail.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/profesor/{claseId}/borrador:
 *     put:
 *       summary: PUT /api/hojas-ruta/mine/profesor/{claseId}/borrador
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.put(
  "/mine/profesor/:claseId/borrador",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR", "ALUMNO"),
  controller.saveProfessorDraft.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/profesor/{claseId}/finalizar:
 *     put:
 *       summary: PUT /api/hojas-ruta/mine/profesor/{claseId}/finalizar
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.put(
  "/mine/profesor/:claseId/finalizar",
  authenticate,
  authorize("PROFESOR"),
  controller.finalizeProfessorRoadmap.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/admin/profesores:
 *     get:
 *       summary: GET /api/hojas-ruta/admin/profesores
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/admin/profesores",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAdminProfessorsSummary.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/admin/profesores/{profesorId}/alumnos:
 *     get:
 *       summary: GET /api/hojas-ruta/admin/profesores/{profesorId}/alumnos
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/admin/profesores/:profesorId/alumnos",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAdminStudentsByProfessor.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/admin/profesores/{profesorId}/alumnos/{alumnoId}/hojas:
 *     get:
 *       summary: GET /api/hojas-ruta/admin/profesores/{profesorId}/alumnos/{alumnoId}/hojas
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/admin/profesores/:profesorId/alumnos/:alumnoId/hojas",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAdminRegisteredRoadmapsByStudent.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/admin/hojas/{roadmapId}:
 *     get:
 *       summary: GET /api/hojas-ruta/admin/hojas/{roadmapId}
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/admin/hojas/:roadmapId",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAdminRoadmapDetail.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/alumno:
 *     get:
 *       summary: GET /api/hojas-ruta/mine/alumno
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/alumno",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentRegisteredRoadmaps.bind(controller),
);

/**
 * @swagger
 *   /api/hojas-ruta/mine/alumno/{roadmapId}:
 *     get:
 *       summary: GET /api/hojas-ruta/mine/alumno/{roadmapId}
 *       tags:
 *         - Hojas Ruta
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/alumno/:roadmapId",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentRoadmapDetail.bind(controller),
);

export default router;
