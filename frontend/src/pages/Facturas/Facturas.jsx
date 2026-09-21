import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";

import { facturasService } from "../../services/facturasService";
import { LicenseChip } from "../../components/common/LicenseChip";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("es-ES") : "-";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

export default function Facturas() {
  const [rows, setRows] = useState([]);
  const [activeStates, setActiveStates] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [sendFacturaId, setSendFacturaId] = useState(null);
  const [sendEmail, setSendEmail] = useState("");
  const [sending, setSending] = useState(false);
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

  const normalizeEstado = (estado) => {
    if (estado === "EMITIDA") {
      return "PENDIENTE";
    }

    return estado;
  };

  const toggleStateChip = (state) => {
    setActiveStates((prev) =>
      prev.includes(state)
        ? prev.filter((item) => item !== state)
        : [...prev, state],
    );
  };

  const getBaseAmount = (row) => {
    if (
      row.matricula?.promocion?.precioOriginal !== undefined &&
      row.matricula?.promocion?.precioOriginal !== null
    ) {
      return Number(row.matricula.promocion.precioOriginal);
    }

    return Number(row.baseImponible || 0);
  };

  const getDiscountAmount = (row) => {
    if (row.matricula) {
      const base = getBaseAmount(row);
      const final = Number(row.total || 0);
      const discount = base - final;
      return discount > 0 ? Number(discount.toFixed(2)) : 0;
    }

    return Number(row.descuento || 0);
  };

  const filteredRows = rows.filter((row) => {
    if (activeStates.length === 0) {
      return true;
    }

    return activeStates.includes(normalizeEstado(row.estado));
  });

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

  const handleOpenSend = (row) => {
    setSendFacturaId(row.id);
    setSendEmail(row.alumno?.usuario?.email || "");
    setSendOpen(true);
  };

  const handleSendDuplicate = async () => {
    setSending(true);

    try {
      await facturasService.sendDuplicate(sendFacturaId, sendEmail);
      setSendOpen(false);
      setNotification({
        open: true,
        message: "Duplicado enviado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo enviar el duplicado de factura",
        severity: "error",
      });
    } finally {
      setSending(false);
    }
  };

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
      valueGetter: (_, row) => getBaseAmount(row),
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "descuento",
      headerName: "Descuento",
      flex: 0.8,
      valueGetter: (_, row) => getDiscountAmount(row),
      valueFormatter: (value) => formatCurrency(value),
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
          label={normalizeEstado(params.row.estado)}
          color={
            normalizeEstado(params.row.estado) === "PAGADA"
              ? "success"
              : normalizeEstado(params.row.estado) === "ANULADA"
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
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Ver factura" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenPreview(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Enviar duplicado" arrow>
            <IconButton
              color="secondary"
              size="small"
              onClick={() => handleOpenSend(params.row)}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Facturas
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Gestión administrativa de facturas y estado de pago.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Chip
          color={activeStates.includes("PENDIENTE") ? "primary" : "warning"}
          variant={activeStates.includes("PENDIENTE") ? "filled" : "outlined"}
          label={`Pendientes: ${
            rows.filter((f) => normalizeEstado(f.estado) === "PENDIENTE").length
          }`}
          onClick={() => toggleStateChip("PENDIENTE")}
        />

        <Chip
          color={activeStates.includes("PAGADA") ? "primary" : "success"}
          variant={activeStates.includes("PAGADA") ? "filled" : "outlined"}
          label={`Pagadas: ${
            rows.filter((f) => normalizeEstado(f.estado) === "PAGADA").length
          }`}
          onClick={() => toggleStateChip("PAGADA")}
        />

        <Chip
          color={activeStates.includes("ANULADA") ? "primary" : "error"}
          variant={activeStates.includes("ANULADA") ? "filled" : "outlined"}
          label={`Anuladas: ${
            rows.filter((f) => normalizeEstado(f.estado) === "ANULADA").length
          }`}
          onClick={() => toggleStateChip("ANULADA")}
        />
      </Box>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "numero", sort: "asc" }] },
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
                <Box sx={{ textAlign: "right" }}>
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

      <Dialog
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Enviar duplicado de factura</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <TextField
            fullWidth
            type="email"
            label="Email destino"
            value={sendEmail}
            onChange={(event) => setSendEmail(event.target.value)}
            placeholder="cliente@email.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendDuplicate}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar duplicado"}
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
