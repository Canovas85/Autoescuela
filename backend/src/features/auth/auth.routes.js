import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

const router = Router();

const repository = new AuthRepository(prisma);

const service = new AuthService(repository);

const controller = new AuthController(service);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@autoescuela.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", controller.login.bind(controller));

router.post(
  "/primer-acceso/cambiar-password",
  authenticate,
  controller.changePasswordFirstLogin.bind(controller),
);

router.get("/me", authenticate, controller.me.bind(controller));

export default router;
