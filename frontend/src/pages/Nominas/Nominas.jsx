import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import BoltIcon from "@mui/icons-material/Bolt";
import { jwtDecode } from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";

import { nominasService } from "../../services/nominasService";
import { exportNominasExcel } from "../../utils/exportNominasExcel";
import { exportNominasPdf } from "../../utils/exportNominasPdf";

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

const normalizeRole = (role) => {
  if (role === "GESTOR") {
    return "ADMINISTRATIVO";
  }

  return role;
};

const resolveRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token || "");
    return normalizeRole(decoded?.rol || "");
  } catch {
    return "";
  }
};

export default function Nominas() {
  const now = new Date();
  const token = localStorage.getItem("token") || "";
  const [role] = useState(() => resolveRoleFromToken(token));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchProfesor, setSearchProfesor] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");
  const [exportAnchor, setExportAnchor] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isProfessor = role === "PROFESOR";
  const canGenerate = role === "ADMIN" || role === "ADMINISTRATIVO";
  const canListNominas = canGenerate || isProfessor;

  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = 2026; year <= now.getFullYear() + 2; year += 1) {
      years.push(year);
    }
    return years;
  }, []);

  const loadRows = async () => {
    if (!canListNominas) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const params = {
        ...(mesFiltro ? { mes: Number(mesFiltro) } : {}),
        ...(anioFiltro ? { anio: Number(anioFiltro) } : {}),
        ...(!isProfessor && searchProfesor.trim()
          ? { profesorNombre: searchProfesor.trim() }
          : {}),
      };

      const data = isProfessor
        ? await nominasService.getMine(params)
        : await nominasService.getAll(params);

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudieron cargar las nóminas",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, [canListNominas, role, mesFiltro, anioFiltro]);

  const filteredRows = useMemo(() => {
    if (isProfessor) {
      return rows;
    }

    const text = searchProfesor.trim().toLowerCase();
    if (!text) {
      return rows;
    }

    return rows.filter((row) =>
      String(row.profesor?.usuario?.nombre || "")
        .toLowerCase()
        .includes(text),
    );
  }, [rows, isProfessor, searchProfesor]);

  const handleOpenPreview = async (row) => {
    setPreviewOpen(true);
    setPreviewLoading(true);

    try {
      const data = await nominasService.getPreview(row.id);
      setSelectedNomina(data);
    } catch (error) {
      setPreviewOpen(false);
      setNotification({
        open: true,
        message: error.response?.data?.message || "No se pudo cargar la nómina",
        severity: "error",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const { blob, fileName } = await nominasService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo descargar el PDF de nómina",
        severity: "error",
      });
    }
  };

  const handleGenerateMonth = async () => {
    try {
      const payload = {
        year: anioFiltro ? Number(anioFiltro) : now.getFullYear(),
        month: mesFiltro ? Number(mesFiltro) : now.getMonth() + 1,
      };

      const result = await nominasService.generateMonth(payload);

      setNotification({
        open: true,
        message: `Generación completada: ${result.generated} nóminas nuevas, ${result.skipped} omitidas`,
        severity: "success",
      });

      await loadRows();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudieron generar las nóminas",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "numero",
      headerName: "Nº Nómina",
      flex: 1,
    },
    {
      field: "profesor",
      headerName: "Profesor",
      flex: 1.4,
      valueGetter: (_, row) => row.profesor?.usuario?.nombre || "-",
    },
    {
      field: "periodo",
      headerName: "Periodo de liquidación",
      flex: 1,
      valueGetter: (_, row) =>
        `${String(row.mes).padStart(2, "0")}/${row.anio}`,
    },
    {
      field: "importe",
      headerName: "Importe nómina",
      flex: 0.9,
      valueGetter: (_, row) => formatCurrency(row.liquidoPercibir),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Ver nómina" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenPreview(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Descargar nómina" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleDownloadPdf(params.row.id)}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const exportRows = filteredRows.map((row) => ({
    numero: row.numero,
    profesor: row.profesor,
    mes: row.mes,
    anio: row.anio,
    liquidoPercibir: row.liquidoPercibir,
  }));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} mb={2}>
            Nóminas
          </Typography>

          <Typography color="text.secondary">
            Gestión mensual de nóminas de profesorado.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          {/* Tarjeta de Filtros (Eliminado mb: 2 para no desalinear horizontalmente) */}
          <Paper sx={{ p: 2, mb: 0 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              {/* Buscador de Profesor original (condicional) */}
              {!isProfessor ? (
                <TextField
                  size="small"
                  label="Buscar profesor"
                  value={searchProfesor}
                  onChange={(event) => setSearchProfesor(event.target.value)}
                  sx={{ width: { xs: "100%", md: 240 } }}
                />
              ) : null}

              {/* Selector de Mes original */}
              <FormControl
                size="small"
                sx={{ minWidth: 170, width: { xs: "100%", md: "auto" } }}
              >
                <InputLabel>Mes</InputLabel>
                <Select
                  label="Mes"
                  value={mesFiltro}
                  onChange={(event) => setMesFiltro(event.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {MONTHS.map((item) => (
                    <MenuItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selector de Año original */}
              <FormControl
                size="small"
                sx={{ minWidth: 130, width: { xs: "100%", md: "auto" } }}
              >
                <InputLabel>Año</InputLabel>
                <Select
                  label="Año"
                  value={anioFiltro}
                  onChange={(event) => setAnioFiltro(event.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={String(year)}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Contenedor del Botón Actualizar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: { xs: 0, md: -0.5 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadRows}
              sx={{
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "6px 24px", // Ajustado padding vertical para equilibrar el texto
                border: "1px solid",
                color: "#059669",
                borderColor: "#059669",
                backgroundColor: "transparent",
                boxShadow: `
          0px 4px 0px #047857, 
          0px 8px 16px rgba(5, 150, 105, 0.15),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1)
        `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": {
                  color: "inherit",
                },
                "&:hover": {
                  color: "#10b981",
                  borderColor: "#10b981",
                  backgroundColor: "rgba(5, 150, 105, 0.04)",
                  boxShadow: `
            0px 4px 0px #047857, 
            0px 12px 20px rgba(16, 185, 129, 0.25),
            inset 0px 1px 0px rgba(255, 255, 255, 0.2)
          `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  boxShadow: `
            0px 1px 0px #047857, 
            0px 2px 4px rgba(5, 150, 105, 0.2),
            inset 0px 2px 4px rgba(0, 0, 0, 0.05)
          `,
                  transform: "translateY(3px)",
                },
              }}
            >
              Actualizar
            </Button>
          </Box>

          {/* Contenedor del Botón Generar Nóminas */}
          {canGenerate ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: { xs: 0, md: -0.5 },
              }}
            >
              <Button
                variant="contained"
                startIcon={<BoltIcon />}
                onClick={handleGenerateMonth}
                sx={{
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderRadius: "8px",
                  padding: "6px 24px", // Ajustado padding vertical para equilibrar el texto
                  border: "1px solid",
                  color: "#eab308",
                  borderColor: "#eab308",
                  backgroundColor: "transparent",
                  boxShadow: `
            0px 4px 0px #ca8a04, 
            0px 8px 20px rgba(234, 179, 8, 0.3),
            inset 0px 1px 0px rgba(255, 255, 255, 0.2)
          `,
                  transition: "all 0.15s ease-in-out",
                  "& .MuiButton-startIcon": {
                    color: "inherit",
                  },
                  "&:hover": {
                    color: "#facc15",
                    borderColor: "#facc15",
                    backgroundColor: "rgba(234, 179, 8, 0.08)",
                    boxShadow: `
              0px 4px 0px #ca8a04, 
              0px 12px 24px rgba(250, 204, 21, 0.5),
              inset 0px 1px 0px rgba(255, 255, 255, 0.4)
            `,
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    boxShadow: `
              0px 1px 0px #ca8a04, 
              0px 2px 4px rgba(234, 179, 8, 0.2),
              inset 0px 2px 4px rgba(0, 0, 0, 0.1)
            `,
                    transform: "translateY(3px)",
                  },
                }}
              >
                Generar Nóminas
              </Button>
            </Box>
          ) : null}

          {/* Contenedor del Botón Exportar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: { xs: 0, md: -0.5 },
            }}
          >
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={(event) => setExportAnchor(event.currentTarget)}
              sx={{
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "6px 24px", // Ajustado padding vertical para equilibrar el texto
                border: "1px solid",
                color: "#ea580c",
                borderColor: "#ea580c",
                backgroundColor: "transparent",
                boxShadow: `
          0px 4px 0px #c2410c, 
          0px 8px 16px rgba(234, 88, 12, 0.15),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1)
        `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": {
                  color: "inherit",
                },
                "&:hover": {
                  color: "#f97316",
                  borderColor: "#f97316",
                  backgroundColor: "rgba(234, 88, 12, 0.04)",
                  boxShadow: `
            0px 4px 0px #c2410c, 
            0px 12px 20px rgba(249, 115, 22, 0.25),
            inset 0px 1px 0px rgba(255, 255, 255, 0.2)
          `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  boxShadow: `
            0px 1px 0px #c2410c, 
            0px 2px 4px rgba(234, 88, 12, 0.2),
            inset 0px 2px 4px rgba(0, 0, 0, 0.05)
          `,
                  transform: "translateY(3px)",
                },
              }}
            >
              Exportar
            </Button>
          </Box>

          <Menu
            anchorEl={exportAnchor}
            open={Boolean(exportAnchor)}
            onClose={() => setExportAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                exportNominasExcel(exportRows);
                setExportAnchor(null);
              }}
            >
              Exportar a Excel
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportNominasPdf(exportRows);
                setExportAnchor(null);
              }}
            >
              Exportar a PDF
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "anio", sort: "desc" }] },
          }}
        />
      </Box>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalle de nómina</DialogTitle>
        <DialogContent>
          {previewLoading ? (
            <Typography>Cargando...</Typography>
          ) : selectedNomina ? (
            <Stack spacing={1.2} sx={{ mt: 1 }}>
              <Typography>
                <strong>Nº Nómina:</strong> {selectedNomina.numero}
              </Typography>
              <Typography>
                <strong>Profesor:</strong>{" "}
                {selectedNomina.profesor?.usuario?.nombre || "-"}
              </Typography>
              <Typography>
                <strong>Periodo:</strong>{" "}
                {String(selectedNomina.mes).padStart(2, "0")}/
                {selectedNomina.anio}
              </Typography>
              <Typography>
                <strong>Días trabajados:</strong>{" "}
                {selectedNomina.diasTrabajados}/{selectedNomina.diasMes}
              </Typography>
              <Typography>
                <strong>Convocatorias APTO/NO_APTO:</strong>{" "}
                {selectedNomina.presentadosApto}/
                {selectedNomina.presentadosNoApto}
              </Typography>
              <Typography>
                <strong>Total convocatorias:</strong>{" "}
                {selectedNomina.totalPresentados}
              </Typography>
              <Typography>
                <strong>Total devengos:</strong>{" "}
                {formatCurrency(selectedNomina.totalDevengos)}
              </Typography>
              <Typography>
                <strong>Total deducciones:</strong>{" "}
                {formatCurrency(selectedNomina.totalDeducciones)}
              </Typography>
              <Typography>
                <strong>Líquido a percibir:</strong>{" "}
                {formatCurrency(selectedNomina.liquidoPercibir)}
              </Typography>
            </Stack>
          ) : (
            <Typography>No hay información para mostrar.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {selectedNomina?.id ? (
            <Button onClick={() => handleDownloadPdf(selectedNomina.id)}>
              Descargar PDF
            </Button>
          ) : null}
          <Button onClick={() => setPreviewOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
