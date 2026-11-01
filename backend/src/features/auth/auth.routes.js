import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { EmailService } from "../../shared/services/email.service.js";

import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { AccountActivationService } from "./account-activation.service.js";

const router = Router();

const repository = new AuthRepository(prisma);

const emailService = new EmailService();

const accountActivationService = new AccountActivationService(
  repository,
  emailService,
);

const service = new AuthService(
  repository,
  accountActivationService,
  emailService,
);

const controller = new AuthController(service);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesiÃƒÂ³n
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
 *         description: Credenciales invÃƒÂ¡lidas
 */
router.post("/login", controller.login.bind(controller));

/**
 * @swagger
 *   /api/auth/primer-acceso/cambiar-password:
 *     post:
 *       summary: POST /api/auth/primer-acceso/cambiar-password
 *       tags:
 *         - Auth
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/primer-acceso/cambiar-password",
  authenticate,
  controller.changePasswordFirstLogin.bind(controller),
);

/**
 * @swagger
 *   /api/auth/me:
 *     get:
 *       summary: GET /api/auth/me
 *       tags:
 *         - Auth
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: OperaciÃ³n completada
 */

router.get("/me", authenticate, controller.me.bind(controller));

/**
 * @swagger
 *   /api/auth/activacion/validar:
 *     post:
 *       summary: POST /api/auth/activacion/validar
 *       tags:
 *         - Auth
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/activacion/validar",
  controller.validateActivationToken.bind(controller),
);

/**
 * @swagger
 *   /api/auth/activacion/completar:
 *     post:
 *       summary: POST /api/auth/activacion/completar
 *       tags:
 *         - Auth
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/activacion/completar",
  controller.activateFirstAccess.bind(controller),
);

/**
 * @swagger
 *   /api/auth/activacion/reenviar/{userId}:
 *     post:
 *       summary: POST /api/auth/activacion/reenviar/{userId}
 *       tags:
 *         - Auth
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/activacion/reenviar/:userId",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.resendActivation.bind(controller),
);

/**
 * @swagger
 *   /api/auth/password-reset/validate-email:
 *     post:
 *       summary: POST /api/auth/password-reset/validate-email
 *       tags:
 *         - Auth
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/password-reset/validate-email",
  controller.validatePasswordResetEmail.bind(controller),
);

/**
 * @swagger
 *   /api/auth/password-reset/reset-default:
 *     post:
 *       summary: POST /api/auth/password-reset/reset-default
 *       tags:
 *         - Auth
 *       responses:
 *         201:
 *           description: OperaciÃ³n completada
 */

router.post(
  "/password-reset/reset-default",
  controller.resetPasswordToDefault.bind(controller),
);

export default router;
