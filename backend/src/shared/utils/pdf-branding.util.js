import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRANDING_DIR = path.resolve(__dirname, "../../assets/branding");
const HEADER_IMAGE = path.join(BRANDING_DIR, "IMAGEN7.jpeg");
const SEAL_IMAGE = path.join(BRANDING_DIR, "IMAGEN8.jpeg");
const SIGNATURE_IMAGE = path.join(BRANDING_DIR, "IMAGEN9.jpeg");

const safeImage = (doc, filePath, x, y, options = {}) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    doc.image(filePath, x, y, options);
  } catch {
    // Ignore image rendering issues to avoid breaking PDF generation.
  }
};

export const drawDecorativeFrame = (doc) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 22;
  const line = 18;

  doc
    .save()
    .lineWidth(1)
    .strokeColor("#d4af37")
    .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
    .stroke();

  doc
    .lineWidth(2)
    .strokeColor("#d4af37")
    .moveTo(margin, margin + line)
    .lineTo(margin, margin)
    .lineTo(margin + line, margin)
    .stroke();

  doc
    .moveTo(pageWidth - margin - line, margin)
    .lineTo(pageWidth - margin, margin)
    .lineTo(pageWidth - margin, margin + line)
    .stroke();

  doc
    .moveTo(margin, pageHeight - margin - line)
    .lineTo(margin, pageHeight - margin)
    .lineTo(margin + line, pageHeight - margin)
    .stroke();

  doc
    .moveTo(pageWidth - margin - line, pageHeight - margin)
    .lineTo(pageWidth - margin, pageHeight - margin)
    .lineTo(pageWidth - margin, pageHeight - margin - line)
    .stroke();

  const squareSize = 46;
  doc
    .lineWidth(0.8)
    .strokeColor("#e2e8f0")
    .rect(
      pageWidth / 2 - squareSize / 2,
      pageHeight / 2 - squareSize / 2,
      squareSize,
      squareSize,
    )
    .stroke();

  doc.restore();
};

export const drawPdfBranding = (
  doc,
  {
    includeFooter = false,
    headerAlign = "right",
    headerY = 28,
    headerWidth = 140,
    headerHeight = 40,
  } = {},
) => {
  drawDecorativeFrame(doc);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const headerX =
    headerAlign === "center"
      ? (pageWidth - headerWidth) / 2
      : headerAlign === "left"
        ? 40
        : pageWidth - headerWidth - 40;

  safeImage(doc, HEADER_IMAGE, headerX, headerY, {
    width: headerWidth,
    height: headerHeight,
  });

  if (!includeFooter) {
    return;
  }

  safeImage(doc, SEAL_IMAGE, 32, pageHeight - 132, {
    width: 90,
    height: 90,
  });

  safeImage(doc, SIGNATURE_IMAGE, pageWidth - 142, pageHeight - 112, {
    width: 100,
    height: 34,
  });
};
