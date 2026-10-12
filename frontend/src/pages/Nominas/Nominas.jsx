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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import BoltIcon from "@mui/icons-material/Bolt";
import { jwtDecode } from "jwt-decode";

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
          {!isProfessor ? (
            <TextField
              size="small"
              label="Buscar profesor"
              value={searchProfesor}
              onChange={(event) => setSearchProfesor(event.target.value)}
              sx={{ width: { xs: "100%", md: 240 } }}
            />
          ) : null}

          <FormControl size="small" sx={{ minWidth: 170 }}>
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

          <FormControl size="small" sx={{ minWidth: 130 }}>
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

          <Button variant="outlined" onClick={loadRows}>
            Recargar
          </Button>

          {canGenerate ? (
            <Button
              variant="contained"
              startIcon={<BoltIcon />}
              onClick={handleGenerateMonth}
            >
              Generar nóminas del mes
            </Button>
          ) : null}

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={(event) => setExportAnchor(event.currentTarget)}
          >
            Exportar
          </Button>

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
