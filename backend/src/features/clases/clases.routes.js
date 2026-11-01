import prisma from "../../config/prisma.js";

import { Router } from "express";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ClasesRepository } from "./clases.repository.js";
import { ClasesService } from "./clases.service.js";
import { ClasesController } from "./clases.controller.js";

const router = Router();

const repository = new ClasesRepository(prisma);

const service = new ClasesService(repository);

const controller = new ClasesController(service);

/**
 * @swagger
 * /api/clases:
 *   post:
 *     summary: Crear una clase prÃƒÂ¡ctica
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alumnoId:
 *                 type: string
 *                 example: alumno-1
 *               profesorId:
 *                 type: string
 *                 example: profesor-1
 *               vehiculoId:
 *                 type: string
 *                 example: vehiculo-1
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-15T10:00:00Z"
 *               duracion:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       201:
 *         description: Clase creada correctamente
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/clases:
 *   get:
 *     summary: Obtener todas las clases prÃƒÂ¡cticas
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de clases prÃƒÂ¡cticas
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Obtener una clase prÃƒÂ¡ctica por id
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clase encontrada
 *       404:
 *         description: Clase no encontrada
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   put:
 *     summary: Actualizar una clase prÃƒÂ¡ctica
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clase actualizada
 *       404:
 *         description: Clase no encontrada
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   delete:
 *     summary: Cancelar clase prÃƒÂ¡ctica
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clase cancelada
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.cancel.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/student/eligibility:
 *     get:
 *       summary: GET /api/clases/mine/student/eligibility
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/mine/student/eligibility",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentEligibility.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/student/booking-context:
 *     get:
 *       summary: GET /api/clases/mine/student/booking-context
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/mine/student/booking-context",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentBookingContext.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/student/request:
 *     post:
 *       summary: POST /api/clases/mine/student/request
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/mine/student/request",
  authenticate,
  authorize("ALUMNO"),
  controller.createStudentRequest.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/student/{id}/cancel:
 *     patch:
 *       summary: PATCH /api/clases/mine/student/{id}/cancel
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.patch(
  "/mine/student/:id/cancel",
  authenticate,
  authorize("ALUMNO"),
  controller.cancelStudentRequest.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/professor/requests:
 *     get:
 *       summary: GET /api/clases/mine/professor/requests
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/mine/professor/requests",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorRequests.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/professor/{id}/confirm:
 *     patch:
 *       summary: PATCH /api/clases/mine/professor/{id}/confirm
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.patch(
  "/mine/professor/:id/confirm",
  authenticate,
  authorize("PROFESOR"),
  controller.confirmProfessorRequest.bind(controller),
);

/**
 * @swagger
 *   /api/clases/mine/professor/{id}/cancel:
 *     patch:
 *       summary: PATCH /api/clases/mine/professor/{id}/cancel
 *       tags:
 *         - Clases
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.patch(
  "/mine/professor/:id/cancel",
  authenticate,
  authorize("PROFESOR"),
  controller.cancelProfessorRequest.bind(controller),
);

export default router;
