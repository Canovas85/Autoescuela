import fs from "fs";
import path from "path";
import multer from "multer";

export const GASTOS_COMBUSTIBLE_UPLOAD_DIR = path.resolve(
  process.cwd(),
  "uploads",
  "gastos-combustible",
);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(GASTOS_COMBUSTIBLE_UPLOAD_DIR, { recursive: true });
    cb(null, GASTOS_COMBUSTIBLE_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || ".pdf";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error("El recibo debe ser PDF o imagen (PNG, JPG, WEBP)"));
    return;
  }

  cb(null, true);
};

export const uploadGastoCombustibleRecibo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
