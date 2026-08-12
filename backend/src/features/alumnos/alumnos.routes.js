import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

// ✅ CÓDIGO CORREGIDO (Subiendo un nivel con "../")
import { AlumnosRepository } from "./alumnos.repository.js";
import { AlumnosService } from "./alumnos.service.js";
import { AlumnosController } from "./alumnos.controller.js";

const router = Router();

const repository = new AlumnosRepository({
  alumno: {
    create: async () => {},
    findFirst: async () => {},
    findMany: async () => [],
    findUnique: async () => {},
    update: async () => {},
  },
});

const service = new AlumnosService(repository);

const controller = new AlumnosController(service);

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     summary: Crear alumno
 *     tags:
 *       - Alumnos
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
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@email.com
 *               telefono:
 *                 type: string
 *                 example: "666555444"
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-15"
 *     responses:
 *       201:
 *         description: Alumno creado
 */

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     summary: Obtener todos los alumnos
 *     tags:
 *       - Alumnos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de alumnos
 */

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   get:
 *     summary: Obtener un alumno por id
 *     tags:
 *       - Alumnos
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
 *         description: Alumno encontrado
 *       404:
 *         description: Alumno no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   put:
 *     summary: Actualizar alumno
 *     tags:
 *       - Alumnos
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
 *         description: Alumno actualizado
 *       404:
 *         description: Alumno no encontrado
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   delete:
 *     summary: Desactivar alumno
 *     tags:
 *       - Alumnos
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
 *         description: Alumno desactivado
 *       404:
 *         description: Alumno no encontrado
 */

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.deactivate.bind(controller),
);

export default router;
