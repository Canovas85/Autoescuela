import { Router } from "express";
import prisma from "../../config/prisma.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/role.middleware.js";
import { HojasRutaRepository } from "./hojas-ruta.repository.js";
import { HojasRutaService } from "./hojas-ruta.service.js";
import { HojasRutaController } from "./hojas-ruta.controller.js";

const router = Router();

const repository = new HojasRutaRepository(prisma);
const service = new HojasRutaService(repository);
const controller = new HojasRutaController(service);

router.get(
  "/catalogo-faltas",
  authenticate,
  authorize("ADMIN", "PROFESOR", "ALUMNO"),
  controller.getFaultCatalog.bind(controller),
);

router.get(
  "/mine/profesor",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorDashboard.bind(controller),
);

router.get(
  "/mine/profesor/:claseId",
  authenticate,
  authorize("PROFESOR"),
  controller.getProfessorRoadmapDetail.bind(controller),
);

router.put(
  "/mine/profesor/:claseId/borrador",
  authenticate,
  authorize("PROFESOR"),
  controller.saveProfessorDraft.bind(controller),
);

router.put(
  "/mine/profesor/:claseId/finalizar",
  authenticate,
  authorize("PROFESOR"),
  controller.finalizeProfessorRoadmap.bind(controller),
);

router.get(
  "/admin/profesores",
  authenticate,
  authorize("ADMIN"),
  controller.getAdminProfessorsSummary.bind(controller),
);

router.get(
  "/admin/profesores/:profesorId/alumnos",
  authenticate,
  authorize("ADMIN"),
  controller.getAdminStudentsByProfessor.bind(controller),
);

router.get(
  "/admin/profesores/:profesorId/alumnos/:alumnoId/hojas",
  authenticate,
  authorize("ADMIN"),
  controller.getAdminRegisteredRoadmapsByStudent.bind(controller),
);

router.get(
  "/admin/hojas/:roadmapId",
  authenticate,
  authorize("ADMIN"),
  controller.getAdminRoadmapDetail.bind(controller),
);

router.get(
  "/mine/alumno",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentRegisteredRoadmaps.bind(controller),
);

router.get(
  "/mine/alumno/:roadmapId",
  authenticate,
  authorize("ALUMNO"),
  controller.getStudentRoadmapDetail.bind(controller),
);

export default router;
