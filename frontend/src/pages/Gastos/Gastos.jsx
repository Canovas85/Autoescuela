import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Link,
  Menu,
  Select,
  Snackbar,
  Stack,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import { jwtDecode } from "jwt-decode";
import { gastosCombustibleService } from "../../services/gastosCombustibleService";
import { exportGastosExcel } from "../../utils/exportGastosExcel";
import { exportGastosPdf } from "../../utils/exportGastosPdf";
import CloseIcon from "@mui/icons-material/Close";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRole = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded?.rol || null;
  } catch {
    return null;
  }
};

export default function Gastos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [licenciaFiltro, setLicenciaFiltro] = useState("TODAS");
  const [conceptoFiltro, setConceptoFiltro] = useState("TODOS");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const role = getRole();

  const loadData = async () => {
    setLoading(true);

    try {
      const data =
        role === "ADMIN" || role === "ADMINISTRATIVO"
          ? await gastosCombustibleService.getAll()
          : await gastosCombustibleService.getMine();

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotification({
        open: true,
        message: "No se pudieron cargar los gastos de combustible",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      const licencia = row.vehiculo?.tipoPermiso || "-";

      if (licenciaFiltro !== "TODAS" && licencia !== licenciaFiltro) {
        return false;
      }

      if (conceptoFiltro !== "TODOS" && conceptoFiltro !== "COMBUSTIBLE") {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        row.numeroFactura?.toLowerCase().includes(q) ||
        row.vehiculo?.matricula?.toLowerCase().includes(q) ||
        row.vehiculo?.marca?.toLowerCase().includes(q) ||
        row.vehiculo?.modelo?.toLowerCase().includes(q) ||
        row.profesor?.nombre?.toLowerCase().includes(q) ||
        row.alumno?.nombre?.toLowerCase().includes(q)
      );
    });
  }, [rows, search, licenciaFiltro, conceptoFiltro]);

  const licencias = useMemo(() => {
    const values = new Set();

    rows.forEach((row) => {
      if (row.vehiculo?.tipoPermiso) {
        values.add(row.vehiculo.tipoPermiso);
      }
    });

    return Array.from(values).sort();
  }, [rows]);

  const exportMenuOpen = Boolean(exportAnchorEl);

  const handleExportExcel = () => {
    exportGastosExcel(filteredRows);
    setExportAnchorEl(null);
  };

  const handleExportPdf = () => {
    exportGastosPdf(filteredRows);
    setExportAnchorEl(null);
  };

  const columns = [
    {
      field: "numeroFactura",
      headerName: "Nº Factura",
      flex: 1.1,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 0.8,
      valueGetter: () => "Combustible",
      renderCell: () => (
        <Chip
          label="Combustible"
          sx={{
            backgroundColor: "#fffbeb", // Color de fondo (puedes usar HEX, RGB o color de MUI)
            borderColor: "#facc15", // Color del borde
            borderRadius: "15px", // Radio del borde (bordes menos redondeados)
            borderWidth: "1px", // Grosor del borde (opcional)
            color: "#ca8a04", // Color del texto (opcional)
            "& .MuiChip-label": {
              // Estilos para el texto interno (opcional)
              fontWeight: "bold",
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "vehiculo",
      headerName: "Vehículo",
      flex: 1.4,
      valueGetter: (_, row) =>
        ` ${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""}`,
    },
    /*{
      field: "combustibleAntesPct",
      headerName: "Antes",
      flex: 0.7,
      valueGetter: (_, row) => `${row.combustibleAntesPct ?? 0}%`,
    },
    {
      field: "combustibleDespuesPct",
      headerName: "Después",
      flex: 0.7,
      valueGetter: (_, row) => `${row.combustibleDespuesPct ?? 0}%`,
    },*/
    {
      field: "litrosRepostados",
      headerName: "Litros Repostados",
      flex: 0.7,
      valueGetter: (_, row) =>
        `${Number(row.litrosRepostados || 0).toFixed(2)} L`,
    },
    {
      field: "precioLitro",
      headerName: "Precio/L",
      flex: 0.7,
      valueGetter: (_, row) => `${Number(row.precioLitro || 0).toFixed(2)} EUR`,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.7,
      valueGetter: (_, row) => `${Number(row.total || 0).toFixed(2)} EUR`,
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (_, row) => formatDateTime(row.createdAt),
    },
    {
      field: "rutaRecibo",
      headerName: "Recibo",
      flex: 0.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.rutaRecibo ? (
          <Link href={params.row.rutaRecibo} target="_blank" rel="noreferrer">
            Ver recibo
          </Link>
        ) : (
          "-"
        ),
    },
  ];

  if (role === "ADMIN" || role === "ADMINISTRATIVO") {
    columns.splice(3, 0, {
      field: "profesorNombre",
      headerName: "Profesor",
      flex: 1,
      valueGetter: (_, row) => row.profesor?.nombre || "-",
    });
  }

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
            Gastos
          </Typography>

          <Typography color="text.secondary">
            Registro de gastos de combustible realizados por profesores.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          {/* Tarjeta de Filtros (Eliminado mb: 2 para evitar descuadres horizontales) */}
          <Paper sx={{ p: 2, mb: 0 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <FormControl
                size="small"
                sx={{
                  minWidth: 140,
                  "& .MuiInputLabel-root": { color: "rgb(0, 0, 0) !important" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2 !important",
                    borderWidth: "1px",
                  },
                  "& :hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2 !important",
                  },
                }}
              >
                <InputLabel id="licencia-filter-label">Licencia</InputLabel>
                <Select
                  labelId="licencia-filter-label"
                  label="Licencia"
                  value={licenciaFiltro}
                  onChange={(event) => setLicenciaFiltro(event.target.value)}
                >
                  <MenuItem value="TODAS">Todas</MenuItem>
                  {licencias.map((licencia) => (
                    <MenuItem key={licencia} value={licencia}>
                      {licencia}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 150,
                  "& .MuiInputLabel-root": { color: "rgb(0, 0, 0) !important" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2 !important",
                    borderWidth: "1px",
                  },
                  "& :hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2 !important",
                  },
                }}
              >
                <InputLabel id="concepto-filter-label">Concepto</InputLabel>
                <Select
                  labelId="concepto-filter-label"
                  label="Concepto"
                  value={conceptoFiltro}
                  onChange={(event) => setConceptoFiltro(event.target.value)}
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="COMBUSTIBLE">Combustible</MenuItem>
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
              onClick={loadData}
              startIcon={<RefreshIcon />}
              sx={{
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "6px 24px", // Padding optimizado para equilibrar la altura tipográfica

                // Activamos el borde físico para que respete el borderColor
                border: "1px solid",

                // Texto, icono y bordes en color verde/esmeralda de alta tecnología
                color: "#059669",
                borderColor: "#059669",
                backgroundColor: "transparent",

                // Triple sombra adaptada para relieve verde (borde inferior sólido + brillo difuso)
                boxShadow: `
            0px 4px 0px #047857, 
            0px 8px 16px rgba(5, 150, 105, 0.15),
            inset 0px 1px 0px rgba(255, 255, 255, 0.1)
          `,

                // Suavizado de todas las animaciones físicas
                transition: "all 0.15s ease-in-out",

                // Asegura que el icono de Material-UI herede el color verde automáticamente
                "& .MuiButton-startIcon": {
                  color: "inherit",
                },

                "&:hover": {
                  // Al pasar el ratón, se vuelve un verde más brillante e intenso con fondo sutil
                  color: "#10b981",
                  borderColor: "#10b981",
                  backgroundColor: "rgba(5, 150, 105, 0.04)",
                  boxShadow: `
              0px 4px 0px #047857, 
              0px 12px 20px rgba(16, 185, 129, 0.25),
              inset 0px 1px 0px rgba(255, 255, 255, 0.2)
            `,
                  transform: "translateY(-1px)", // Se eleva ligeramente
                },

                "&:active": {
                  // Efecto mecánico físico de hundimiento (Relieve presionado)
                  boxShadow: `
              0px 1px 0px #047857, 
              0px 2px 4px rgba(5, 150, 105, 0.2),
              inset 0px 2px 4px rgba(0, 0, 0, 0.05)
            `,
                  transform: "translateY(3px)", // Se desplaza hacia abajo exactamente el grosor del relieve anterior
                },
              }}
            >
              Actualizar
            </Button>
          </Box>

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
              onClick={(event) => setExportAnchorEl(event.currentTarget)}
              sx={{
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "6px 24px", // Padding optimizado para equilibrar la altura tipográfica

                // Activamos el borde físico para que respete el borderColor
                border: "1px solid",

                // Texto, icono y bordes en color naranja oscuro de alta tecnología
                color: "#ea580c",
                borderColor: "#ea580c",
                backgroundColor: "transparent",

                // Triple sombra adaptada para relieve naranja (borde inferior sólido + brillo difuso)
                boxShadow: `
            0px 4px 0px #c2410c, 
            0px 8px 16px rgba(234, 88, 12, 0.15),
            inset 0px 1px 0px rgba(255, 255, 255, 0.1)
          `,

                // Suavizado de todas las animaciones físicas
                transition: "all 0.15s ease-in-out",

                // Asegura que el icono de Material-UI herede el color naranja oscuro automáticamente
                "& .MuiButton-startIcon": {
                  color: "inherit",
                },

                "&:hover": {
                  // Al pasar el ratón, se vuelve un naranja más brillante e intenso con fondo sutil
                  color: "#f97316",
                  borderColor: "#f97316",
                  backgroundColor: "rgba(234, 88, 12, 0.04)",
                  boxShadow: `
              0px 4px 0px #c2410c, 
              0px 12px 20px rgba(249, 115, 22, 0.25),
              inset 0px 1px 0px rgba(255, 255, 255, 0.2)
            `,
                  transform: "translateY(-1px)", // Se eleva ligeramente
                },

                "&:active": {
                  // Efecto mecánico físico de hundimiento (Relieve presionado)
                  boxShadow: `
              0px 1px 0px #c2410c, 
              0px 2px 4px rgba(234, 88, 12, 0.2),
              inset 0px 2px 4px rgba(0, 0, 0, 0.05)
            `,
                  transform: "translateY(3px)", // Se desplaza hacia abajo exactamente el grosor del relieve anterior
                },
              }}
            >
              Exportar
            </Button>
          </Box>

          <Menu
            anchorEl={exportAnchorEl}
            open={exportMenuOpen}
            onClose={() => setExportAnchorEl(null)}
          >
            <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
            <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
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
            sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
          }}
        />
      </Box>

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
