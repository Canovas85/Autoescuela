import { Router } from "express";

import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { SolicitudesExamenRepository } from "./solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "./solicitudes-examen.service.js";
import { SolicitudesExamenController } from "./solicitudes-examen.controller.js";

const router = Router();

const repository = new SolicitudesExamenRepository(prisma);
const service = new SolicitudesExamenService(repository);
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
