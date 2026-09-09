import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Snackbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { pagosService } from "../../services/pagosService";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export default function MisPagos() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadPagos = async () => {
    try {
      setLoading(true);
      const data = await pagosService.getMine();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar tus pagos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPagos();
  }, []);

  const handlePagar = (row) => {
    navigate(`/pago-matricula?pagoId=${row.id}`);
  };

  const columns = [
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.7,
    },
    {
      field: "permiso",
      headerName: "Permiso",
      flex: 0.6,
    },
    {
      field: "importe",
      headerName: "Importe",
      flex: 0.8,
      valueFormatter: (value) => `${value} EUR`,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.estado}
          color={params.row.estado === "PAGADO" ? "success" : "warning"}
        />
      ),
    },
    {
      field: "convocatorias",
      headerName: "Convocatorias",
      flex: 1,
      valueGetter: (_, row) =>
        `${row.convocatoriasConsumidas}/${row.convocatoriasIncluidas}`,
    },
    {
      field: "numeroFacturaPago",
      headerName: "Factura pago",
      flex: 1,
      valueGetter: (_, row) => row.numeroFacturaPago || "Pendiente",
    },
    {
      field: "fechaPago",
      headerName: "Fecha pago",
      flex: 0.9,
      valueGetter: (_, row) => formatDate(row.fechaPago),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        params.row.estado === "PENDIENTE" ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => handlePagar(params.row)}
          >
            Pagar ahora
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Completado
          </Typography>
        ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2} fontWeight="bold">
        Mis Pagos
      </Typography>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "fechaPago", sort: "asc" }] },
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
