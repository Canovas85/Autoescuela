import { Router } from "express";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { VehiculosRepository } from "./vehiculos.repository.js";
import { VehiculosService } from "./vehiculos.service.js";
import { VehiculosController } from "./vehiculos.controller.js";
import { uploadVehiculoImagen } from "./vehiculos.upload.js";
import prisma from "../../config/prisma.js";

const router = Router();

const repository = new VehiculosRepository(prisma);

const service = new VehiculosService(repository);

const controller = new VehiculosController(service);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear vehÃƒÂ­culo
 *     tags:
 *       - Vehiculos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               tipoPermiso:
 *                 type: string
 *                 example: B
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: VehÃƒÂ­culo creado correctamente
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadVehiculoImagen.single("imagen"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehÃƒÂ­culos
 *     tags:
 *       - Vehiculos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de vehÃƒÂ­culos
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehÃƒÂ­culo por id
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
 *         description: VehÃƒÂ­culo encontrado
 *       404:
 *         description: VehÃƒÂ­culo no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehÃƒÂ­culo
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               tipoPermiso:
 *                 type: string
 *                 example: B
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: VehÃƒÂ­culo actualizado
 *       404:
 *         description: VehÃƒÂ­culo no encontrado
 */

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadVehiculoImagen.single("imagen"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Desactivar vehÃƒÂ­culo
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
 *         description: VehÃƒÂ­culo desactivado
 *       404:
 *         description: VehÃƒÂ­culo no encontrado
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.deactivate.bind(controller),
);

/**
 * @swagger
 *   /api/vehiculos/{id}/deactivation-impact:
 *     get:
 *       summary: GET /api/vehiculos/{id}/deactivation-impact
 *       tags:
 *         - Vehiculos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get(
  "/:id/deactivation-impact",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getDeactivationImpact.bind(controller),
);

/**
 * @swagger
 *   /api/vehiculos/{id}/deactivate-with-reassignment:
 *     post:
 *       summary: POST /api/vehiculos/{id}/deactivate-with-reassignment
 *       tags:
 *         - Vehiculos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/:id/deactivate-with-reassignment",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.deactivateWithReassignment.bind(controller),
);

/**
 * @swagger
 *   /api/vehiculos/{id}/activar:
 *     patch:
 *       summary: PATCH /api/vehiculos/{id}/activar
 *       tags:
 *         - Vehiculos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.activate.bind(controller),
);

/**
 * @swagger
 *   /api/vehiculos/{id}/pagar-itv:
 *     post:
 *       summary: POST /api/vehiculos/{id}/pagar-itv
 *       tags:
 *         - Vehiculos
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/:id/pagar-itv",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO", "PROFESOR"),
  controller.payItv.bind(controller),
);

export default router;
