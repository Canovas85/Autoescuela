import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { LicenseChip } from "../../components/common/LicenseChip";

import { facturasService } from "../../services/facturasService";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("es-ES") : "-";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

export default function MisFacturas() {
  const [rows, setRows] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
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

  const handleOpenPreview = async (row) => {
    setLoadingPreview(true);
    setPreviewOpen(true);

    try {
      const preview = await facturasService.getPreview(row.id);
      setSelectedFactura(preview);
    } catch (error) {
      console.error(error);
      setSelectedFactura(null);
      setPreviewOpen(false);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo cargar la factura",
        severity: "error",
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownloadPdf = async (facturaId) => {
    try {
      const { blob, fileName } = await facturasService.downloadPdf(facturaId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "No se pudo descargar el PDF",
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
      valueFormatter: (value) => formatCurrency(value),
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
      valueGetter: (_, row) => formatDate(row.fechaEmision),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Vista previa" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenPreview(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Descargar PDF" arrow>
            <IconButton
              color="success"
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

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Mis Facturas
      </Typography>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "fechaEmision", sort: "asc" }] },
          }}
        />
      </Box>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Vista previa de factura</DialogTitle>
        <DialogContent>
          {loadingPreview ? (
            <Typography>Cargando factura...</Typography>
          ) : selectedFactura ? (
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 2, backgroundColor: "#f8fafc" }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    AUTOESCUELA EGUZKILORE
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Factura oficial
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: "right" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedFactura.numero}
                  </Typography>
                  <Typography variant="body2">
                    Emisión: {formatDate(selectedFactura.fechaEmision)}
                  </Typography>
                  <Typography variant="body2">
                    Estado: {selectedFactura.estado}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Emisor
                  </Typography>
                  <Typography variant="body2">
                    Autoescuela Eguzkilore
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Receptor
                  </Typography>
                  <Typography variant="body2">
                    {selectedFactura.alumno?.nombre || "-"}
                  </Typography>
                  <Typography variant="body2">
                    {selectedFactura.alumno?.email || "-"}
                  </Typography>
                  <Typography variant="body2">
                    DNI: {selectedFactura.alumno?.dni || "-"}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  border: "1px solid #dbeafe",
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    backgroundColor: "#eff6ff",
                    px: 1.5,
                    py: 1,
                    fontWeight: 700,
                  }}
                >
                  <Typography variant="body2">Concepto</Typography>
                  <Typography variant="body2">Base</Typography>
                  <Typography variant="body2">Descuento</Typography>
                  <Typography variant="body2">Total</Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    px: 1.5,
                    py: 1.2,
                    borderTop: "1px solid #dbeafe",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    {selectedFactura.concepto}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(selectedFactura.baseImponible)}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(selectedFactura.descuento)}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(selectedFactura.total)}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={700}>
                  Licencia:
                </Typography>
                <LicenseChip value={selectedFactura.licencia} />
              </Stack>
            </Paper>
          ) : (
            <Alert severity="warning">No hay datos para mostrar</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cerrar</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!selectedFactura}
            onClick={() => handleDownloadPdf(selectedFactura.id)}
          >
            Descargar PDF
          </Button>
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
