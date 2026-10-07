import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { TemariosRepository } from "./temarios.repository.js";
import { TemariosService } from "./temarios.service.js";
import { TemariosController } from "./temarios.controller.js";
import { uploadTemarioDocumentacion } from "./temarios.upload.js";

const router = Router();

const repository = new TemariosRepository(prisma);
const service = new TemariosService(repository);
const controller = new TemariosController(service);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.create.bind(controller),
);
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.getAll.bind(controller),
);
router.get(
  "/mis-temarios",
  authenticate,
  authorize("ALUMNO"),
  controller.getForAlumno.bind(controller),
);
router.get(
  "/mis-temarios/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.getTemaForAlumno.bind(controller),
);
router.post(
  "/mis-temarios/:id/mini-test",
  authenticate,
  authorize("ALUMNO"),
  controller.saveMiniTestResultado.bind(controller),
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
  controller.update.bind(controller),
);
router.post(
  "/:id/documentacion",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  uploadTemarioDocumentacion.single("documentacion"),
  controller.uploadDocumentacion.bind(controller),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "ADMINISTRATIVO"),
  controller.delete.bind(controller),
);

export default router;
