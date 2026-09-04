import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

// ✅ CÓDIGO CORREGIDO (Subiendo un nivel con "../")
import { AlumnosRepository } from "./alumnos.repository.js";
import { PromocionesRepository } from "../promociones/promociones.repository.js";
import { AlumnosService } from "./alumnos.service.js";
import { AlumnosController } from "./alumnos.controller.js";
import prisma from "../../config/prisma.js";
import { AuthRepository } from "../auth/auth.repository.js";
import { AccountActivationService } from "../auth/account-activation.service.js";
import { EmailService } from "../../shared/services/email.service.js";
import { MatriculasRepository } from "../matriculas/matriculas.repository.js";

const router = Router();

const repository = new AlumnosRepository(prisma);
const matriculasRepository = new MatriculasRepository(prisma);
const promocionesRepository = new PromocionesRepository(prisma);

const authRepository = new AuthRepository(prisma);
const emailService = new EmailService();
const accountActivationService = new AccountActivationService(
  authRepository,
  emailService,
);

const service = new AlumnosService(
  repository,
  accountActivationService,
  matriculasRepository,
  promocionesRepository,
);
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
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - telefono
 *               - dni
 *               - fechaNacimiento
 *               - tipoLicenciaObjetivo
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@email.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               telefono:
 *                 type: string
 *                 example: "666555444"
 *               dni:
 *                 type: string
 *                 example: "12345678Z"
 *               fechaNacimiento:
 *                 type: string
 *                 example: "15/05/2000"
 *               tipoLicenciaObjetivo:
 *                 type: string
 *                 enum: [B, A1, A2, A, C, D, E]
 *                 example: "B"
 *     responses:
 *       201:
 *         description: Alumno creado
 */

router.post(
  "/promociones-elegibles",
  authenticate,
  authorize("ADMIN"),
  controller.getEligiblePromotions.bind(controller),
);

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
  "/:id/profesores-elegibles",
  authenticate,
  authorize("ADMIN"),
  controller.getEligibleProfesores.bind(controller),
);

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

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN"),
  controller.activate.bind(controller),
);

export default router;
