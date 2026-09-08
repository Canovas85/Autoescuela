import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { DocumentosAlumnoRepository } from "./documentos-alumno.repository.js";
import { DocumentosAlumnoService } from "./documentos-alumno.service.js";
import { DocumentosAlumnoController } from "./documentos-alumno.controller.js";
import { uploadDocumentosAlumno } from "./documentos-alumno.upload.js";

const router = Router();

const repository = new DocumentosAlumnoRepository(prisma);
const service = new DocumentosAlumnoService(repository);
const controller = new DocumentosAlumnoController(service);

router.get(
  "/",
  authenticate,
  authorize("ALUMNO"),
  controller.getMine.bind(controller),
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  controller.getAllAdmin.bind(controller),
);

router.post(
  "/",
  authenticate,
  authorize("ALUMNO"),
  uploadDocumentosAlumno.array("archivos", 10),
  controller.create.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  uploadDocumentosAlumno.array("archivos", 10),
  controller.update.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ALUMNO"),
  controller.remove.bind(controller),
);

router.patch(
  "/:id/validar",
  authenticate,
  authorize("ADMIN"),
  controller.validate.bind(controller),
);

export default router;
