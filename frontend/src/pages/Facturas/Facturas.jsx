import { useEffect, useState } from "react";
import { Alert, Box, Chip, Snackbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { facturasService } from "../../services/facturasService";

export default function Facturas() {
  const [rows, setRows] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadFacturas = async () => {
    try {
      const data = await facturasService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar las facturas",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const columns = [
    {
      field: "numero",
      headerName: "Nº Factura",
      flex: 1.1,
    },
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.5,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "-",
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.8,
    },
    {
      field: "baseImponible",
      headerName: "Base",
      flex: 0.7,
      valueFormatter: (value) => `${value} EUR`,
    },
    {
      field: "descuento",
      headerName: "Descuento",
      flex: 0.8,
      valueFormatter: (value) => `${value} EUR`,
    },
    {
      field: "total",
      headerName: "Total",
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
          color={
            params.row.estado === "PAGADA"
              ? "success"
              : params.row.estado === "ANULADA"
                ? "error"
                : "warning"
          }
        />
      ),
    },
    {
      field: "fechaEmision",
      headerName: "Emisión",
      flex: 1,
      valueGetter: (_, row) =>
        row.fechaEmision
          ? new Date(row.fechaEmision).toLocaleDateString("es-ES")
          : "-",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Facturas
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
