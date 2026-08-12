import { Router } from "express";

import { ProfesoresRepository } from "./profesores.repository.js";
import { ProfesoresService } from "./profesores.service.js";
import { ProfesoresController } from "./profesores.controller.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

const router = Router();

const repository = new ProfesoresRepository({
  profesor: {
    create: async () => {},
    findFirst: async () => {},
    findMany: async () => [],
    findUnique: async () => {},
    update: async () => {},
  },
});

const service = new ProfesoresService(repository);

const controller = new ProfesoresController(service);

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Crear profesor
 *     tags:
 *       - Profesores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Pedro García
 *               email:
 *                 type: string
 *                 example: profesor@autoescuela.com
 *               telefono:
 *                 type: string
 *                 example: "666555444"
 *     responses:
 *       201:
 *         description: Profesor creado correctamente
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags:
 *       - Profesores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de profesores
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtener un profesor por id
 *     tags:
 *       - Profesores
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
 *         description: Profesor encontrado
 *       404:
 *         description: Profesor no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualizar profesor
 *     tags:
 *       - Profesores
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
 *         description: Profesor actualizado
 *       404:
 *         description: Profesor no encontrado
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Desactivar profesor
 *     tags:
 *       - Profesores
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
 *         description: Profesor desactivado
 *       404:
 *         description: Profesor no encontrado
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.deactivate.bind(controller),
);

export default router;
