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
 *     summary: Crear una clase práctica
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
  authorize("ADMIN"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/clases:
 *   get:
 *     summary: Obtener todas las clases prácticas
 *     tags:
 *       - Clases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de clases prácticas
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Obtener una clase práctica por id
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
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   put:
 *     summary: Actualizar una clase práctica
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
  authorize("ADMIN"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/clases/{id}:
 *   delete:
 *     summary: Cancelar clase práctica
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
  authorize("ADMIN"),
  controller.cancel.bind(controller),
);

export default router;
