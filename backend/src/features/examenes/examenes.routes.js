import { Router } from "express";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { ExamenesRepository } from "./examenes.repository.js";
import { ExamenesService } from "./examenes.service.js";
import { ExamenesController } from "./examenes.controller.js";

const router = Router();

const repository = new ExamenesRepository({
  examen: {
    create: async () => {},
  },
});

const service = new ExamenesService(repository);

const controller = new ExamenesController(service);

/**
 * @swagger
 * /api/examenes:
 *   post:
 *     summary: Crear examen
 *     tags:
 *       - Examenes
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
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-20T09:00:00Z"
 *               tipo:
 *                 type: string
 *                 example: PRACTICO
 *     responses:
 *       201:
 *         description: Examen creado correctamente
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/examenes:
 *   get:
 *     summary: Obtener todos los exámenes
 *     tags:
 *       - Examenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de exámenes
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/examenes/{id}:
 *   get:
 *     summary: Obtener un examen por id
 *     tags:
 *       - Examenes
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
 *         description: Examen encontrado
 *       404:
 *         description: Examen no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/examenes/{id}:
 *   put:
 *     summary: Actualizar examen
 *     tags:
 *       - Examenes
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
 *         description: Examen actualizado
 *       404:
 *         description: Examen no encontrado
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/examenes/{id}/resultado:
 *   patch:
 *     summary: Registrar resultado de examen
 *     tags:
 *       - Examenes
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
 *         description: Resultado registrado correctamente
 *       404:
 *         description: Examen no encontrado
 */

router.patch(
  "/:id/resultado",
  authenticate,
  authorize("ADMIN"),
  controller.registerResult.bind(controller),
);

export default router;
