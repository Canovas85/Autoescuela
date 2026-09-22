import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { EmailService } from "../../shared/services/email.service.js";

import { FacturasRepository } from "./facturas.repository.js";
import { FacturasService } from "./facturas.service.js";
import { FacturasController } from "./facturas.controller.js";

const router = Router();

const repository = new FacturasRepository(prisma);
const emailService = new EmailService();
const service = new FacturasService(repository, emailService);
const controller = new FacturasController(service);

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
  "/:id/preview",
  authenticate,
  authorize("ADMIN", "ALUMNO"),
  controller.getPreview.bind(controller),
);

router.get(
  "/:id/pdf",
  authenticate,
  authorize("ADMIN", "ALUMNO"),
  controller.getPdf.bind(controller),
);

router.post(
  "/:id/send-duplicate",
  authenticate,
  authorize("ADMIN"),
  controller.sendDuplicate.bind(controller),
);

export default router;
