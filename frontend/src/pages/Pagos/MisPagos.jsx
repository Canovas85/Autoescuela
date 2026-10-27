import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Snackbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { pagosService } from "../../services/pagosService";
import { LicenseChip } from "../../components/common/LicenseChip";

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
      field: "numeroFacturaPago",
      headerName: "Factura pago",
      flex: 1,
      valueGetter: (_, row) => row.numeroFacturaPago || "Pendiente",
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.7,
    },
    {
      field: "permiso",
      headerName: "Permiso",
      flex: 0.6,
      renderCell: (params) => <LicenseChip value={params.value} />,
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
            size="small"
            variant="outlined"
            onClick={() => handlePagar(params.row)}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "4px 16px", // Padding optimizado para botones pequeños (size="small")
              border: "1px solid",
              color: "#15803d",
              borderColor: "#15803d !important",
              backgroundColor: "transparent",
              boxShadow: `
      0px 3px 0px #166534, 
      0px 6px 12px rgba(21, 128, 61, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#22c55e",
                borderColor: "#22c55e !important",
                backgroundColor: "rgba(21, 128, 61, 0.04)",
                boxShadow: `
        0px 3px 0px #166534, 
        0px 10px 16px rgba(34, 197, 94, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                transform: "translateY(-1px)",
              },
              "&:active": {
                borderColor: "#15803d !important",
                boxShadow: `
        0px 1px 0px #166534, 
        0px 2px 4px rgba(21, 128, 61, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                transform: "translateY(2px)", // Hundimiento táctil adaptado al relieve pequeño
              },
            }}
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
