import { Router } from "express";

import prisma from "../../config/prisma.js";

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

export default router;
