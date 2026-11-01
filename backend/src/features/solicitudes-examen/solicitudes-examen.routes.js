import { Router } from "express";

import prisma from "../../config/prisma.js";
import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { SolicitudesExamenRepository } from "./solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "./solicitudes-examen.service.js";
import { SolicitudesExamenController } from "./solicitudes-examen.controller.js";

const router = Router();

const repository = new SolicitudesExamenRepository(prisma);
const service = new SolicitudesExamenService(repository, tasaDgtConfig);
const controller = new SolicitudesExamenController(service);

/**
 * @swagger
 *   /api/solicitudes-examen:
 *     post:
 *       summary: POST /api/solicitudes-examen
 *       tags:
 *         - Solicitudes Examen
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
  controller.create.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen:
 *     get:
 *       summary: GET /api/solicitudes-examen
 *       tags:
 *         - Solicitudes Examen
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
 *   /api/solicitudes-examen/evaluacion:
 *     get:
 *       summary: GET /api/solicitudes-examen/evaluacion
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/evaluacion",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAdminEvaluation.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine:
 *     get:
 *       summary: GET /api/solicitudes-examen/mine
 *       tags:
 *         - Solicitudes Examen
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
 *   /api/solicitudes-examen/mine/teorico/eligibilidad:
 *     get:
 *       summary: GET /api/solicitudes-examen/mine/teorico/eligibilidad
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/teorico/eligibilidad",
  authenticate,
  authorize("ALUMNO"),
  controller.getTheoreticalEligibility.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/teorico/calendario:
 *     get:
 *       summary: GET /api/solicitudes-examen/mine/teorico/calendario
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/teorico/calendario",
  authenticate,
  authorize("ALUMNO"),
  controller.getTheoreticalCalendar.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/teorico/solicitar:
 *     post:
 *       summary: POST /api/solicitudes-examen/mine/teorico/solicitar
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/mine/teorico/solicitar",
  authenticate,
  authorize("ALUMNO"),
  controller.createTheoreticalRequest.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/teorico/solicitudes/{id}/cancelar:
 *     patch:
 *       summary: PATCH /api/solicitudes-examen/mine/teorico/solicitudes/{id}/cancelar
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/mine/teorico/solicitudes/:id/cancelar",
  authenticate,
  authorize("ALUMNO"),
  controller.cancelTheoreticalRequest.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/practico/eligibilidad:
 *     get:
 *       summary: GET /api/solicitudes-examen/mine/practico/eligibilidad
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/practico/eligibilidad",
  authenticate,
  authorize("ALUMNO"),
  controller.getPracticalEligibility.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/practico/calendario:
 *     get:
 *       summary: GET /api/solicitudes-examen/mine/practico/calendario
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.get(
  "/mine/practico/calendario",
  authenticate,
  authorize("ALUMNO"),
  controller.getPracticalCalendar.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/practico/solicitar:
 *     post:
 *       summary: POST /api/solicitudes-examen/mine/practico/solicitar
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Operación completada
 */

router.post(
  "/mine/practico/solicitar",
  authenticate,
  authorize("ALUMNO"),
  controller.createPracticalRequest.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/mine/practico/solicitudes/{id}/cancelar:
 *     patch:
 *       summary: PATCH /api/solicitudes-examen/mine/practico/solicitudes/{id}/cancelar
 *       tags:
 *         - Solicitudes Examen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Operación completada
 */

router.patch(
  "/mine/practico/solicitudes/:id/cancelar",
  authenticate,
  authorize("ALUMNO"),
  controller.cancelPracticalRequest.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/{id}:
 *     get:
 *       summary: GET /api/solicitudes-examen/{id}
 *       tags:
 *         - Solicitudes Examen
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
 *   /api/solicitudes-examen/{id}:
 *     put:
 *       summary: PUT /api/solicitudes-examen/{id}
 *       tags:
 *         - Solicitudes Examen
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
  controller.update.bind(controller),
);
/**
 * @swagger
 *   /api/solicitudes-examen/{id}:
 *     delete:
 *       summary: DELETE /api/solicitudes-examen/{id}
 *       tags:
 *         - Solicitudes Examen
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

export default router;
