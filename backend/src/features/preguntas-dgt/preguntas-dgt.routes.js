import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PreguntasDGTRepository } from "./preguntas-dgt.repository.js";
import { PreguntasDGTService } from "./preguntas-dgt.service.js";
import { PreguntasDGTController } from "./preguntas-dgt.controller.js";

const router = Router();

const repository = new PreguntasDGTRepository(prisma);

const service = new PreguntasDGTService(repository);

const controller = new PreguntasDGTController(service);

//
// ADMIN
//

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

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete.bind(controller),
);

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN"),
  controller.activate.bind(controller),
);

router.patch(
  "/:id/desactivar",
  authenticate,
  authorize("ADMIN"),
  controller.deactivate.bind(controller),
);

//
// ALUMNO
//

router.post(
  "/generar-examen",
  authenticate,
  authorize("ALUMNO"),
  controller.generarExamen.bind(controller),
);

router.post(
  "/corregir-examen",
  authenticate,
  authorize("ALUMNO"),
  controller.corregirExamen.bind(controller),
);

export default router;
