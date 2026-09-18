import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import { gastosCombustibleService } from "../../services/gastosCombustibleService";

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
    if (!search.trim()) {
      return rows;
    }

    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      return (
        row.numeroFactura?.toLowerCase().includes(q) ||
        row.vehiculo?.matricula?.toLowerCase().includes(q) ||
        row.vehiculo?.marca?.toLowerCase().includes(q) ||
        row.vehiculo?.modelo?.toLowerCase().includes(q) ||
        row.profesor?.nombre?.toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

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
      <Typography variant="h4" fontWeight={700} mb={2}>
        Gastos
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Registro de gastos de combustible realizados por profesores.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 360 } }}
        />
        <Button variant="outlined" onClick={loadData}>
          Recargar
        </Button>
      </Stack>

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
