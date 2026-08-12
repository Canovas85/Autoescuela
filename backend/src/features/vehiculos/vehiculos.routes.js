import { Router } from "express";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { VehiculosRepository } from "./vehiculos.repository.js";
import { VehiculosService } from "./vehiculos.service.js";
import { VehiculosController } from "./vehiculos.controller.js";

const router = Router();

const repository = new VehiculosRepository({
  vehiculo: {
    create: async () => {},
    findFirst: async () => null,
    findMany: async () => [],
    findUnique: async () => null,
    update: async () => {},
  },
});

const service = new VehiculosService(repository);

const controller = new VehiculosController(service);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear vehículo
 *     tags:
 *       - Vehiculos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: 1234ABC
 *               marca:
 *                 type: string
 *                 example: Seat
 *               modelo:
 *                 type: string
 *                 example: Ibiza
 *     responses:
 *       201:
 *         description: Vehículo creado correctamente
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags:
 *       - Vehiculos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de vehículos
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por id
 *     tags:
 *       - Vehiculos
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
 *         description: Vehículo encontrado
 *       404:
 *         description: Vehículo no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     tags:
 *       - Vehiculos
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
 *         description: Vehículo actualizado
 *       404:
 *         description: Vehículo no encontrado
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Desactivar vehículo
 *     tags:
 *       - Vehiculos
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
 *         description: Vehículo desactivado
 *       404:
 *         description: Vehículo no encontrado
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.deactivate.bind(controller),
);

export default router;
