import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PreguntasDGTRepository } from "./preguntas-dgt.repository.js";
import { PreguntasDGTService } from "./preguntas-dgt.service.js";
import { PreguntasDGTController } from "./preguntas-dgt.controller.js";
import { uploadPreguntaDGTImagen } from "./preguntas-dgt.upload.js";

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
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadPreguntaDGTImagen.single("imagen"),
  controller.create.bind(controller),
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);

router.get(
  "/next-id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getNextId.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getById.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadPreguntaDGTImagen.single("imagen"),
  controller.update.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.delete.bind(controller),
);

router.patch(
  "/:id/activar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.activate.bind(controller),
);

router.patch(
  "/:id/desactivar",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
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
