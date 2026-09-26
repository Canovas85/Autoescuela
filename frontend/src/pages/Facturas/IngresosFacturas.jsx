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
  IconButton,
  Menu,
  MenuItem,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { facturasService } from "../../services/facturasService";
import { matriculasService } from "../../services/matriculasService";
import { LicenseChip } from "../../components/common/LicenseChip";
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

  if (
    text.includes("práctic") ||
    text.includes("practic") ||
    text.includes("examen")
  ) {
    return "EXAMEN_PRACTICO";
  }

  if (text.includes("bono")) {
    return "BONO";
  }

  if (text.includes("clase")) {
    return "CLASE_PRACTICA";
  }

  return "OTROS";
};

const getRowOrigen = (row) => {
  if (classifyConcepto(row?.concepto) === "TASA_DGT") {
    return "DGT";
  }

  if (row?.matriculaId) {
    return "MATRÍCULA";
  }

  if (row?.compraBonoId || row?.clasePracticaId) {
    return "PAGO";
  }

  return "FACTURA";
};

const getBaseAmount = (row) => {
  if (classifyConcepto(row?.concepto) === "TASA_DGT") {
    return TASA_DGT_FIJA;
  }

  if (
    row.matricula?.promocion?.precioOriginal !== undefined &&
    row.matricula?.promocion?.precioOriginal !== null
  ) {
    return Number(row.matricula.promocion.precioOriginal);
  }

  return Number(row.baseImponible || 0);
};

const getDiscountAmount = (row) => {
  if (classifyConcepto(row?.concepto) === "TASA_DGT") {
    return 0;
  }

  if (row.matricula) {
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

export default function IngresosFacturas() {
  const [rows, setRows] = useState([]);
  const [searchAlumno, setSearchAlumno] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [focusFechaDesde, setFocusFechaDesde] = useState(false);
  const [focusFechaHasta, setFocusFechaHasta] = useState(false);
  const [tipoFechaDesde, setTipoFechaDesde] = useState("text");
  const [tipoFechaHasta, setTipoFechaHasta] = useState("text");
  const [activeStates, setActiveStates] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [sendFacturaId, setSendFacturaId] = useState(null);
  const [sendEmail, setSendEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [exportAnchor, setExportAnchor] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRows = async () => {
    try {
      const data = await facturasService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los ingresos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadRows();
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

      const alumnoNombre = String(
        row.alumno?.usuario?.nombre || "",
      ).toLowerCase();
      if (
        searchAlumno.trim() &&
        !alumnoNombre.includes(searchAlumno.trim().toLowerCase())
      ) {
        return false;
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
    searchAlumno,
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

  const handlePagarMatricula = async (row) => {
    if (!row.matriculaId) {
      return;
    }

    try {
      await matriculasService.pagar(row.matriculaId);
      await loadRows();
      setNotification({
        open: true,
        message: "Matrícula marcada como pagada",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo pagar la matrícula",
        severity: "error",
      });
    }
  };

  const handleAnularMatricula = async (row) => {
    if (!row.matriculaId) {
      return;
    }

    try {
      await matriculasService.anular(row.matriculaId);
      await loadRows();
      setNotification({
        open: true,
        message: "Matrícula anulada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo anular la matrícula",
        severity: "error",
      });
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
      Alumno: row.alumno?.usuario?.nombre || "-",
      Licencia: row.matricula?.licencia || "-",
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
      flex: 1.05,
    },
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.5,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "-",
    },
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <LicenseChip value={params.row.matricula?.licencia} />
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
      width: 220,
      sortable: false,
      renderCell: (params) => {
        const estado = normalizeEstado(params.row.estado);
        const isMatricula = Boolean(params.row.matriculaId);
        const disableMatriculaActions =
          !isMatricula || estado === "PAGADA" || estado === "ANULADA";

        return (
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

            <Tooltip title="Descargar PDF" arrow>
              <IconButton
                color="info"
                size="small"
                onClick={() => handleDownloadPdf(params.row.id)}
              >
                <DownloadIcon fontSize="small" />
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

            <Tooltip title="Pagar matrícula" arrow>
              <span>
                <IconButton
                  color="success"
                  size="small"
                  disabled={disableMatriculaActions}
                  onClick={() => handlePagarMatricula(params.row)}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Anular matrícula" arrow>
              <span>
                <IconButton
                  color="error"
                  size="small"
                  disabled={disableMatriculaActions}
                  onClick={() => handleAnularMatricula(params.row)}
                >
                  <CancelIcon fontSize="small" />
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
        Ingresos y Facturas
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Vista unificada de cobros de matrícula, facturas y pagos asociados.
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
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          size="small"
          label="Buscar alumno"
          placeholder="Nombre del alumno"
          value={searchAlumno}
          onChange={(event) => setSearchAlumno(event.target.value)}
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
