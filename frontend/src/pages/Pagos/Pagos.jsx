import { useEffect, useState } from "react";
import { Alert, Box, Chip, Snackbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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

export default function Pagos() {
  const [rows, setRows] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadPagos = async () => {
    try {
      const data = await pagosService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los pagos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadPagos();
  }, []);

  const columns = [
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.4,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "-",
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.6,
    },
    {
      field: "permiso",
      headerName: "Permiso",
      flex: 0.6,
    },
    {
      field: "importe",
      headerName: "Importe",
      flex: 0.7,
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
      field: "fechaPago",
      headerName: "Fecha pago",
      flex: 0.9,
      valueGetter: (_, row) => formatDate(row.fechaPago),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2} fontWeight="bold">
        Pagos
      </Typography>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
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
