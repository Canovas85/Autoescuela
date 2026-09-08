import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "documentos-alumno");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

const TIPOS_PERMITIDOS = new Set([
  "application/pdf",
  "application/x-pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/webp",
]);

const EXTENSIONES_PERMITIDAS = new Map([
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const fileFilter = (_req, file, cb) => {
  const mime = (file.mimetype || file.type || "").toLowerCase();
  const extension = path.extname(file.originalname || "").toLowerCase();

  const mimeValido = TIPOS_PERMITIDOS.has(mime);
  const extensionValida = EXTENSIONES_PERMITIDAS.has(extension);

  if (!mimeValido && !extensionValida) {
    cb(new Error("Formato no permitido. Usa PDF, PNG, JPG o WEBP."));
    return;
  }

  if (
    (mime === "application/octet-stream" ||
      mime === "application/x-download" ||
      mime === "" ||
      mime.startsWith("image/octet-stream")) &&
    extensionValida
  ) {
    file.mimetype = EXTENSIONES_PERMITIDAS.get(extension);
  }

  cb(null, true);
};

export const uploadDocumentosAlumno = multer({
  storage,
  limits: {
    files: 10,
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter,
});

export const DOCUMENTOS_ALUMNO_UPLOAD_DIR = UPLOAD_DIR;
