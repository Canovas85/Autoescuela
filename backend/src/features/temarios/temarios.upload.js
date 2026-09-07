import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const MIME_TYPES_PERMITIDOS = new Set(["application/pdf"]);

export const TEMARIOS_UPLOAD_DIR = path.resolve(
  process.cwd(),
  "uploads",
  "temarios",
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(TEMARIOS_UPLOAD_DIR, { recursive: true });
    cb(null, TEMARIOS_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!MIME_TYPES_PERMITIDOS.has(file.mimetype)) {
    cb(new Error("Formato de archivo no permitido. Usa un PDF."));
    return;
  }

  cb(null, true);
};

export const uploadTemarioDocumentacion = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_PDF_SIZE_BYTES,
  },
});
