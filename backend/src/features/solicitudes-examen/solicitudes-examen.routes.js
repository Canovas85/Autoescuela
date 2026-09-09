import { Router } from "express";

import prisma from "../../config/prisma.js";
import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { SolicitudesExamenRepository } from "./solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "./solicitudes-examen.service.js";
import { SolicitudesExamenController } from "./solicitudes-examen.controller.js";

const router = Router();

const repository = new SolicitudesExamenRepository(prisma);
const service = new SolicitudesExamenService(repository, tasaDgtConfig);
const controller = new SolicitudesExamenController(service);

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
  "/mine/teorico/eligibilidad",
  authenticate,
  authorize("ALUMNO"),
  controller.getTheoreticalEligibility.bind(controller),
);
router.get(
  "/mine/teorico/calendario",
  authenticate,
  authorize("ALUMNO"),
  controller.getTheoreticalCalendar.bind(controller),
);
router.post(
  "/mine/teorico/solicitar",
  authenticate,
  authorize("ALUMNO"),
  controller.createTheoreticalRequest.bind(controller),
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

export default router;
