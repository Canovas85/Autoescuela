import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { MatriculasRepository } from "./matriculas.repository.js";
import { MatriculasService } from "./matriculas.service.js";
import { MatriculasController } from "./matriculas.controller.js";

const router = Router();

const repository = new MatriculasRepository(prisma);

const service = new MatriculasService(repository);

const controller = new MatriculasController(service);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

router.get(
  "/mine",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.getById.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

router.patch("/:id/pagar", authenticate, controller.pagar.bind(controller));

router.patch(
  "/:id/anular",
  authenticate,
  authorize("ADMIN"),
  controller.anular.bind(controller),
);

export default router;
