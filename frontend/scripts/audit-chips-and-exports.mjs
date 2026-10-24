import fs from "fs";
import path from "path";

const root = process.cwd();
const srcDir = path.join(root, "frontend", "src");
const outDir = path.join(root, "audits");

fs.mkdirSync(outDir, { recursive: true });

const walk = (dir, acc = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, acc);
      continue;
    }

    if (/\.(jsx|js)$/.test(entry.name)) {
      acc.push(fullPath);
    }
  }

  return acc;
};

const toRel = (absPath) => path.relative(root, absPath).replace(/\\/g, "/");

const files = walk(srcDir);
const pageFiles = files.filter((filePath) =>
  filePath.includes(`${path.sep}pages${path.sep}`),
);

const chipLines = [];
for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    if (
      line.includes("<Chip") ||
      line.includes("LicenseChip") ||
      line.includes("ExamTypeChip")
    ) {
      chipLines.push({
        file: toRel(filePath),
        line: idx + 1,
        code: line.trim(),
      });
    }
  });
}

const chipByFile = new Map();
for (const item of chipLines) {
  if (!chipByFile.has(item.file)) {
    chipByFile.set(item.file, []);
  }
  chipByFile.get(item.file).push(item);
}

let chipMd = "# Inventario de Chips\n\n";
chipMd += `Total ocurrencias detectadas: ${chipLines.length}\n\n`;
chipMd += "## Componentes compartidos\n\n";
[
  "frontend/src/components/common/LicenseChip.jsx",
  "frontend/src/components/common/ExamTypeChip.jsx",
].forEach((componentPath) => {
  if (fs.existsSync(path.join(root, componentPath))) {
    chipMd += `- ${componentPath}\n`;
  }
});
chipMd += "\n## Uso por archivo\n\n";

for (const [file, items] of [...chipByFile.entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
)) {
  chipMd += `### ${file}\n\n`;
  for (const item of items.slice(0, 40)) {
    chipMd += `- L${item.line}: ${item.code}\n`;
  }

  if (items.length > 40) {
    chipMd += `- ... ${items.length - 40} ocurrencias adicionales\n`;
  }

  chipMd += "\n";
}

fs.writeFileSync(path.join(outDir, "chip-inventory.md"), chipMd, "utf8");

const getVisibleFields = (content) => {
  const fields = [];
  const regex = /field\s*:\s*"([^"]+)"/g;
  let match;

  while ((match = regex.exec(content))) {
    fields.push(match[1]);
  }

  return [...new Set(fields)];
};

const getExportImports = (content) => {
  const result = [];
  const regex =
    /import\s+\{\s*([^}]+)\s*\}\s+from\s+"(\.\.\/\.\.\/utils\/[^"]+)"/g;
  let match;

  while ((match = regex.exec(content))) {
    const names = match[1]
      .split(",")
      .map((name) => name.trim())
      .filter((name) => /^export.+(Excel|Pdf)$/i.test(name));

    if (names.length > 0) {
      result.push({
        names,
        importPath: match[2],
      });
    }
  }

  return result;
};

const getExportKeys = (utilFilePath) => {
  if (!fs.existsSync(utilFilePath)) {
    return [];
  }

  const content = fs.readFileSync(utilFilePath, "utf8");
  const keys = new Set();

  const objectKeyRegex = /\{\s*([A-Za-zÁÉÍÓÚáéíóúÑñ0-9_ ]+)\s*:/g;
  let match;
  while ((match = objectKeyRegex.exec(content))) {
    const key = String(match[1] || "").trim();
    if (key && !key.includes("=>")) {
      keys.add(key);
    }
  }

  const headTextRegex = /"([A-Za-zÁÉÍÓÚáéíóúÑñ0-9_ ()º#.-]+)"/g;
  while ((match = headTextRegex.exec(content))) {
    const text = String(match[1] || "").trim();
    if (text.length > 1 && !text.endsWith(".pdf") && !text.endsWith(".xlsx")) {
      keys.add(text);
    }
  }

  return [...keys];
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const rows = [];
for (const filePath of pageFiles) {
  const content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("DataGrid")) {
    continue;
  }

  const visibleFields = getVisibleFields(content);
  const exportImports = getExportImports(content);

  if (exportImports.length === 0) {
    rows.push({
      page: toRel(filePath),
      visibleFields,
      exportFiles: [],
      exportKeys: [],
      missing: [],
      status: "SIN_EXPORT_UTIL",
    });
    continue;
  }

  const exportFiles = [];
  const exportKeys = new Set();

  for (const exp of exportImports) {
    const utilAbsPath = path.resolve(
      path.dirname(filePath),
      `${exp.importPath}.js`,
    );
    exportFiles.push(toRel(utilAbsPath));

    getExportKeys(utilAbsPath).forEach((key) => exportKeys.add(key));
  }

  const normalizedExport = new Set([...exportKeys].map(normalize));
  const missing = visibleFields.filter((field) => {
    if (field === "acciones") {
      return false;
    }

    return !normalizedExport.has(normalize(field));
  });

  rows.push({
    page: toRel(filePath),
    visibleFields,
    exportFiles,
    exportKeys: [...exportKeys],
    missing,
    status: missing.length > 0 ? "REVISAR" : "OK",
  });
}

rows.sort((a, b) => a.page.localeCompare(b.page));

let exportMd = "# Auditoría DataGrid vs Exportaciones\n\n";
exportMd +=
  "Criterio: columnas visibles en DataGrid vs claves/cabeceras detectadas en utilidades de export Excel/PDF (heurístico automático).\n\n";
exportMd +=
  "| Página | Estado | Campos visibles | Utilidades export | Campos faltantes en export |\n";
exportMd += "|---|---|---|---|---|\n";

for (const row of rows) {
  exportMd += `| ${row.page} | ${row.status} | ${row.visibleFields.join(", ")} | ${row.exportFiles.join("<br>") || "-"} | ${row.missing.join(", ") || "-"} |\n`;
}

exportMd += "\n## Notas\n\n";
exportMd +=
  "- La columna `acciones` se excluye de la comparación por ser operativa (no exportable).\n";
exportMd +=
  "- Si una página tiene estado `REVISAR`, conviene alinear cabeceras y orden con su DataGrid.\n";

fs.writeFileSync(
  path.join(outDir, "datagrid-export-audit.md"),
  exportMd,
  "utf8",
);

console.log("Generated audits:");
console.log(path.join(outDir, "chip-inventory.md"));
console.log(path.join(outDir, "datagrid-export-audit.md"));
