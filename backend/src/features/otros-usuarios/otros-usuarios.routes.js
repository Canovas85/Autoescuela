import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { OtrosUsuariosRepository } from "./otros-usuarios.repository.js";
import { OtrosUsuariosService } from "./otros-usuarios.service.js";
import { OtrosUsuariosController } from "./otros-usuarios.controller.js";

const router = Router();

const repository = new OtrosUsuariosRepository(prisma);
const service = new OtrosUsuariosService(repository);
const controller = new OtrosUsuariosController(service);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.getAll.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.getById.bind(controller),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.create.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.update.bind(controller),
);

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.activate.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.deactivate.bind(controller),
);

router.patch(
  "/:id/reset-password",
  authenticate,
  authorize("ADMIN", "SOPORTE"),
  controller.resetPassword.bind(controller),
);

export default router;
