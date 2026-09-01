import { Router } from "express";

import prisma from "../../config/prisma.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";

import { PromocionesRepository } from "./promociones.repository.js";
import { PromocionesService } from "./promociones.service.js";
import { PromocionesController } from "./promociones.controller.js";

import { uploadPromocionImagen } from "./promociones.upload.js";

const router = Router();

const repository = new PromocionesRepository(prisma);

const service = new PromocionesService(repository);

const controller = new PromocionesController(service);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadPromocionImagen.single("imagen"),
  controller.create.bind(controller),
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.getAll.bind(controller),
);

router.get("/public", controller.getPublic.bind(controller));

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
  uploadPromocionImagen.single("imagen"),
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

export default router;
