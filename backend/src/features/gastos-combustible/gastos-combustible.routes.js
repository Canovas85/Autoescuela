import { Router } from "express";
import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { GastosCombustibleRepository } from "./gastos-combustible.repository.js";
import { GastosCombustibleService } from "./gastos-combustible.service.js";
import { GastosCombustibleController } from "./gastos-combustible.controller.js";
import { uploadGastoCombustibleRecibo } from "./gastos-combustible.upload.js";
import { NotificacionesRepository } from "../notificaciones/notificaciones.repository.js";

const router = Router();

const repository = new GastosCombustibleRepository(prisma);
const notificacionesRepository = new NotificacionesRepository(prisma);
const service = new GastosCombustibleService(
  repository,
  notificacionesRepository,
);
const controller = new GastosCombustibleController(service);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

router.get(
  "/mine",
  authenticate,
  authorize("PROFESOR"),
  controller.getMine.bind(controller),
);

router.post(
  "/repostar/:vehiculoId",
  authenticate,
  authorize("PROFESOR"),
  uploadGastoCombustibleRecibo.single("recibo"),
  controller.createRefuelExpense.bind(controller),
);

export default router;
