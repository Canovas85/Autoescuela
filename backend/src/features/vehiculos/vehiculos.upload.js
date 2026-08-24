import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MIME_TYPES_PERMITIDOS = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const VEHICULOS_UPLOAD_DIR = path.resolve(
  process.cwd(),
  "uploads",
  "vehiculos",
);

const uploadDir = VEHICULOS_UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!MIME_TYPES_PERMITIDOS.has(file.mimetype)) {
    cb(new Error("Formato de imagen no permitido. Usa png, jpg o webp."));
    return;
  }

  cb(null, true);
};

export const uploadVehiculoImagen = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
});
