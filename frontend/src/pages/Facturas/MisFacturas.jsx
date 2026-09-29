import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LicenseChip } from "../../components/common/LicenseChip";
import { useNavigate } from "react-router-dom";

import { facturasService } from "../../services/facturasService";
import { pagosService } from "../../services/pagosService";
import { exportIngresosExcel } from "../../utils/exportIngresosExcel";
import { exportIngresosPdf } from "../../utils/exportIngresosPdf";

const CONCEPTO_OPTIONS = [
  { value: "MATRICULA", label: "Matrícula" },
  { value: "TASA_DGT", label: "Tasa DGT" },
  { value: "EXAMEN_PRACTICO", label: "Examen práctico" },
  { value: "BONO", label: "Bono" },
  { value: "CLASE_PRACTICA", label: "Clase práctica" },
  { value: "OTROS", label: "Otros" },
];

const TASA_DGT_FIJA = 94.05;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("es-ES") : "-";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} EUR`;

const normalizeEstado = (estado) => {
  if (estado === "EMITIDA") {
    return "PENDIENTE";
  }

  return estado;
};

const classifyConcepto = (concepto) => {
  const text = String(concepto || "").toLowerCase();

  if (text.includes("matricul")) {
    return "MATRICULA";
  }

  if (text.includes("tasa") || text.includes("dgt")) {
    return "TASA_DGT";
  }

  if (text.includes("bono")) {
    return "BONO";
  }

  if (text.includes("clase")) {
    return "CLASE_PRACTICA";
  }

  if (
    text.includes("práctic") ||
    text.includes("practic") ||
    text.includes("examen")
  ) {
    return "EXAMEN_PRACTICO";
  }

  return "OTROS";
};

const getRowOrigen = (row) => {
  const category = classifyConcepto(row?.concepto);

  if (category === "TASA_DGT") {
    return "DGT";
  }

  if (category === "EXAMEN_PRACTICO") {
    return "EXAMEN PRÁCTICO";
  }

  if (row?.compraBonoId || row?.clasePracticaId) {
    return "PAGO";
  }

  if (row?.matriculaId) {
    return "MATRÍCULA";
  }

  return "FACTURA";
};

const getRowLicencia = (row) =>
  row?.licenciaInferida ||
  row?.compraBono?.bono?.licencia ||
  row?.clasePractica?.vehiculo?.tipoPermiso ||
  row?.matricula?.licencia ||
  "-";

const getBaseAmount = (row) => {
  const category = classifyConcepto(row?.concepto);

  if (category === "TASA_DGT") {
    return TASA_DGT_FIJA;
  }

  if (
    category === "MATRICULA" &&
    row.matricula?.promocion?.precioOriginal !== undefined &&
    row.matricula?.promocion?.precioOriginal !== null
  ) {
    return Number(row.matricula.promocion.precioOriginal);
  }

  return Number(row.baseImponible || 0);
};

const getDiscountAmount = (row) => {
  const category = classifyConcepto(row?.concepto);

  if (category === "TASA_DGT") {
    return 0;
  }

  if (category === "MATRICULA" && row.matricula) {
    const base = getBaseAmount(row);
    const final = Number(row.total || 0);
    const discount = base - final;

    return discount > 0 ? Number(discount.toFixed(2)) : 0;
  }

  return Number(row.descuento || 0);
};

const getFinalAmount = (row) => {
  if (classifyConcepto(row?.concepto) === "TASA_DGT") {
    return TASA_DGT_FIJA;
  }

  return Number(row.total || 0);
};

export default function MisFacturas() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchConcepto, setSearchConcepto] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [focusFechaDesde, setFocusFechaDesde] = useState(false);
  const [focusFechaHasta, setFocusFechaHasta] = useState(false);
  const [tipoFechaDesde, setTipoFechaDesde] = useState("text");
  const [tipoFechaHasta, setTipoFechaHasta] = useState("text");
  const [activeStates, setActiveStates] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

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

  const toggleStateChip = (state) => {
    setActiveStates((prev) =>
      prev.includes(state)
        ? prev.filter((item) => item !== state)
        : [...prev, state],
    );
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const normalizedEstado = normalizeEstado(row.estado);

      if (activeStates.length > 0 && !activeStates.includes(normalizedEstado)) {
        return false;
      }

      if (searchConcepto.trim()) {
        const concepto = String(row.concepto || "").toLowerCase();
        if (!concepto.includes(searchConcepto.trim().toLowerCase())) {
          return false;
        }
      }

      if (conceptoFiltro) {
        const category = classifyConcepto(row.concepto);
        if (category !== conceptoFiltro) {
          return false;
        }
      }

      const emision = row.fechaEmision ? new Date(row.fechaEmision) : null;
      if (fechaDesde && emision && emision < new Date(fechaDesde)) {
        return false;
      }

      if (fechaHasta && emision) {
        const endDate = new Date(fechaHasta);
        endDate.setHours(23, 59, 59, 999);

        if (emision > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    rows,
    activeStates,
    searchConcepto,
    conceptoFiltro,
    fechaDesde,
    fechaHasta,
  ]);

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

  const handlePagarFactura = async (row) => {
    const estado = normalizeEstado(row?.estado);

    if (estado !== "PENDIENTE") {
      return;
    }

    setPayingInvoiceId(row?.id || null);

    try {
      const category = classifyConcepto(row?.concepto);

      if (category === "MATRICULA") {
        navigate("/pago-matricula");
        return;
      }

      const pagos = await pagosService.getMine();
      const pagoPendiente = (pagos || []).find(
        (pago) =>
          String(pago?.numeroFacturaPago || "") === String(row?.numero || "") &&
          String(pago?.estado || "").toUpperCase() === "PENDIENTE",
      );

      if (!pagoPendiente?.id) {
        setNotification({
          open: true,
          message:
            "No se encontró un pago pendiente asociado a esta factura. Revisa Mis Pagos.",
          severity: "warning",
        });
        return;
      }

      navigate(`/pago-matricula?pagoId=${pagoPendiente.id}`);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "No se pudo iniciar el pago",
        severity: "error",
      });
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const openExportMenu = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchor(null);
  };

  const getExportRows = () =>
    filteredRows.map((row) => ({
      "Nº Factura": row.numero || "-",
      Licencia: getRowLicencia(row),
      Origen: getRowOrigen(row),
      Concepto: row.concepto || "-",
      "Precio Base": Number(getBaseAmount(row) || 0).toFixed(2),
      Descuento: Number(getDiscountAmount(row) || 0).toFixed(2),
      "Precio Final": Number(getFinalAmount(row) || 0).toFixed(2),
      Estado: normalizeEstado(row.estado),
      "Fecha Emisión": formatDate(row.fechaEmision),
      "Fecha Pago": formatDate(row.fechaPago),
    }));

  const handleExportExcel = () => {
    exportIngresosExcel(getExportRows());
    closeExportMenu();
  };

  const handleExportPdf = () => {
    exportIngresosPdf(getExportRows());
    closeExportMenu();
  };

  const columns = [
    {
      field: "numero",
      headerName: "Nº Factura",
      flex: 1,
    },
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <LicenseChip value={getRowLicencia(params.row)} />
      ),
    },
    {
      field: "origen",
      headerName: "Origen",
      flex: 0.8,
      valueGetter: (_, row) => getRowOrigen(row),
      renderCell: (params) => {
        const origen = params.value;
        const color =
          origen === "MATRÍCULA"
            ? "primary"
            : origen === "PAGO"
              ? "success"
              : "default";

        return (
          <Chip size="small" label={origen} color={color} variant="outlined" />
        );
      },
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 1.9,
    },
    {
      field: "baseImponible",
      headerName: "Precio Base",
      flex: 0.8,
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
      headerName: "Precio Final",
      flex: 0.85,
      valueGetter: (_, row) => getFinalAmount(row),
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.85,
      renderCell: (params) => {
        const estado = normalizeEstado(params.row.estado);

        return (
          <Chip
            size="small"
            label={estado}
            color={
              estado === "PAGADA"
                ? "success"
                : estado === "DEVUELTA"
                  ? "info"
                  : estado === "PENALIZACION"
                    ? "error"
                    : estado === "ANULADA"
                      ? "error"
                      : "warning"
            }
          />
        );
      },
    },
    {
      field: "fechaEmision",
      headerName: "Fecha Emisión",
      flex: 1,
      valueGetter: (_, row) => formatDate(row.fechaEmision),
    },
    {
      field: "fechaPago",
      headerName: "Fecha Pago",
      flex: 1,
      valueGetter: (_, row) => formatDate(row.fechaPago),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const estado = normalizeEstado(params.row.estado);
        const canPay = estado === "PENDIENTE";
        const isLoadingPay = payingInvoiceId === params.row.id;

        return (
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
                color="info"
                size="small"
                onClick={() => handleDownloadPdf(params.row.id)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Pagar factura" arrow>
              <span>
                <IconButton
                  color="success"
                  size="small"
                  disabled={!canPay || isLoadingPay}
                  onClick={() => handlePagarFactura(params.row)}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={1} fontWeight="bold">
        Mis Facturas
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Vista unificada de tus cobros de matrícula, pagos y facturas.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Chip
          color={activeStates.includes("PENDIENTE") ? "primary" : "warning"}
          variant={activeStates.includes("PENDIENTE") ? "filled" : "outlined"}
          label={`Pendientes: ${
            rows.filter((row) => normalizeEstado(row.estado) === "PENDIENTE")
              .length
          }`}
          onClick={() => toggleStateChip("PENDIENTE")}
        />

        <Chip
          color={activeStates.includes("PAGADA") ? "primary" : "success"}
          variant={activeStates.includes("PAGADA") ? "filled" : "outlined"}
          label={`Pagadas: ${
            rows.filter((row) => normalizeEstado(row.estado) === "PAGADA")
              .length
          }`}
          onClick={() => toggleStateChip("PAGADA")}
        />

        <Chip
          color={activeStates.includes("ANULADA") ? "primary" : "error"}
          variant={activeStates.includes("ANULADA") ? "filled" : "outlined"}
          label={`Anuladas: ${
            rows.filter((row) => normalizeEstado(row.estado) === "ANULADA")
              .length
          }`}
          onClick={() => toggleStateChip("ANULADA")}
        />

        <Chip
          color={activeStates.includes("DEVUELTA") ? "primary" : "info"}
          variant={activeStates.includes("DEVUELTA") ? "filled" : "outlined"}
          label={`Devueltas: ${
            rows.filter((row) => normalizeEstado(row.estado) === "DEVUELTA")
              .length
          }`}
          onClick={() => toggleStateChip("DEVUELTA")}
        />

        <Chip
          color={activeStates.includes("PENALIZACION") ? "primary" : "error"}
          variant={
            activeStates.includes("PENALIZACION") ? "filled" : "outlined"
          }
          label={`Penalización: ${
            rows.filter((row) => normalizeEstado(row.estado) === "PENALIZACION")
              .length
          }`}
          onClick={() => toggleStateChip("PENALIZACION")}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          size="small"
          label="Buscar concepto"
          placeholder="Matrícula, tasa, examen..."
          value={searchConcepto}
          onChange={(event) => setSearchConcepto(event.target.value)}
          sx={{ minWidth: 250 }}
        />

        <TextField
          select
          size="small"
          label="Concepto"
          value={conceptoFiltro}
          onChange={(event) => setConceptoFiltro(event.target.value)}
          sx={{ minWidth: 260 }}
        >
          <MenuItem value="">Todos los conceptos</MenuItem>
          {CONCEPTO_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          type={tipoFechaDesde}
          label="Fecha desde"
          placeholder={focusFechaDesde ? "dd/mm/aaaa" : ""}
          InputLabelProps={{
            shrink: focusFechaDesde || Boolean(fechaDesde),
          }}
          value={fechaDesde}
          onChange={(event) => setFechaDesde(event.target.value)}
          onFocus={() => {
            setFocusFechaDesde(true);
            setTipoFechaDesde("date");
          }}
          onBlur={() => {
            setFocusFechaDesde(false);
            if (!fechaDesde) {
              setTipoFechaDesde("text");
            }
          }}
        />

        <TextField
          size="small"
          type={tipoFechaHasta}
          label="Fecha hasta"
          placeholder={focusFechaHasta ? "dd/mm/aaaa" : ""}
          InputLabelProps={{
            shrink: focusFechaHasta || Boolean(fechaHasta),
          }}
          value={fechaHasta}
          onChange={(event) => setFechaHasta(event.target.value)}
          onFocus={() => {
            setFocusFechaHasta(true);
            setTipoFechaHasta("date");
          }}
          onBlur={() => {
            setFocusFechaHasta(false);
            if (!fechaHasta) {
              setTipoFechaHasta("text");
            }
          }}
        />

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={openExportMenu}
        >
          Exportar
        </Button>

        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={closeExportMenu}
        >
          <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
          <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
        </Menu>
      </Box>

      <Box sx={{ height: 730 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "fechaEmision", sort: "desc" }] },
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
                    Estado: {normalizeEstado(selectedFactura.estado)}
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
                    {formatCurrency(getBaseAmount(selectedFactura))}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(getDiscountAmount(selectedFactura))}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(getFinalAmount(selectedFactura))}
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
