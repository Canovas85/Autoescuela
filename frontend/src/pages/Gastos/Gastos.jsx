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
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import { gastosCombustibleService } from "../../services/gastosCombustibleService";
import { exportGastosExcel } from "../../utils/exportGastosExcel";
import { exportGastosPdf } from "../../utils/exportGastosPdf";

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
        role === "ADMIN"
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
        <Chip label="Combustible" color="warning" size="small" />
      ),
    },
    {
      field: "vehiculo",
      headerName: "Vehículo",
      flex: 1.4,
      valueGetter: (_, row) =>
        `${row.vehiculo?.matricula || "-"} ${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""}`,
    },
    {
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
    },
    {
      field: "litrosRepostados",
      headerName: "Litros",
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

  if (role === "ADMIN") {
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

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            size="small"
            label="Buscar alumno"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: "100%", md: 260 } }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Licencia</InputLabel>
            <Select
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Concepto</InputLabel>
            <Select
              label="Concepto"
              value={conceptoFiltro}
              onChange={(event) => setConceptoFiltro(event.target.value)}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="COMBUSTIBLE">Combustible</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={loadData}>
            Recargar
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={(event) => setExportAnchorEl(event.currentTarget)}
          >
            Exportar
          </Button>

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
