import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Snackbar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material"; // 1. Importamos IconButton y Tooltip
import { DataGrid } from "@mui/x-data-grid";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // 2. Importamos el icono de PDF (o PrintIcon si prefieres)

import { facturasService } from "../../services/facturasService";

export default function MisFacturas() {
  const [rows, setRows] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadFacturas = async () => {
    try {
      const data = await facturasService.getMine();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar tus facturas",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  // 3. Función para manejar la acción de imprimir/ver PDF
  const handlePrint = async (row) => {
    try {
      // Opción A: Si tu backend ya te devuelve una URL directa al archivo PDF listo:
      // window.open(row.urlPdf, "_blank");

      // Opción B: Si tienes un servicio intermedio que descarga el blob del archivo:
      // const blob = await facturasService.getBlobPdf(row.id);
      // const url = window.URL.createObjectURL(blob);
      // window.open(url, "_blank");

      // Ejemplo temporal para verificar que lee bien la fila:
      console.log("Imprimiendo factura:", row.numero);
      alert(`Abriendo PDF de la factura: ${row.numero}`);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudo generar el PDF de la factura",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "numero",
      headerName: "Nº Factura",
      flex: 1,
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.8,
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
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.6,
      sortable: false, // Desactivamos ordenación para esta columna
      filterable: false, // Desactivamos filtros para esta columna
      disableColumnMenu: true, // Ocultamos el menú de cabecera de la columna
      renderCell: (params) => (
        <Tooltip title="Ver PDF / Imprimir">
          <IconButton
            color="primary"
            onClick={() => handlePrint(params.row)} // Pasamos toda la información de la fila
          >
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Mis Facturas
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
