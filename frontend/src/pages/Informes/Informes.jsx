import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { informesService } from "../../services/informesService";
import { exportInformesExcel } from "../../utils/exportInformesExcel";
import { exportInformesPdf } from "../../utils/exportInformesPdf";
import { facturasService } from "../../services/facturasService";

const PERIOD_OPTIONS = [
  { value: "MONTH", label: "Mes" },
  { value: "QUARTER", label: "Trimestre" },
  { value: "YEAR", label: "Año" },
  { value: "CUSTOM", label: "Rango" },
];

const QUARTERS = [
  { value: "1", label: "Q1" },
  { value: "2", label: "Q2" },
  { value: "3", label: "Q3" },
  { value: "4", label: "Q4" },
];

const MONTHS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const PIE_COLORS = [
  "#1d4ed8",
  "#0891b2",
  "#ea580c",
  "#16a34a",
  "#9333ea",
  "#0f172a",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

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

function KpiCard({ title, value, subtitle, icon, color }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ mt: 0.4 }}>
              {value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.4, display: "block" }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              backgroundColor: color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Informes() {
  const now = new Date();
  const [period, setPeriod] = useState("MONTH");
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [quarter, setQuarter] = useState("1");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [focusDateFrom, setFocusDateFrom] = useState(false);
  const [focusDateTo, setFocusDateTo] = useState(false);
  const [dateFromInputType, setDateFromInputType] = useState("text");
  const [dateToInputType, setDateToInputType] = useState("text");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [conceptoFiltro, setConceptoFiltro] = useState("TODOS");
  const [searchConcepto, setSearchConcepto] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        period,
        year,
      };

      if (period === "MONTH") {
        params.month = month;
      }

      if (period === "QUARTER") {
        params.quarter = quarter;
      }

      if (period === "CUSTOM") {
        params.dateFrom = dateFrom;
        params.dateTo = dateTo;
      }

      const response = await informesService.getAccountingReport(params);
      setReport(response);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar los datos del informe",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const movementRows = report?.movimientos || [];

  const conceptoOptions = useMemo(() => {
    const values = new Set();

    movementRows.forEach((row) => {
      if (row?.concepto) {
        values.add(row.concepto);
      }
    });

    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [movementRows]);

  const filteredMovementRows = useMemo(() => {
    const text = searchConcepto.trim().toLowerCase();

    return movementRows.filter((row) => {
      if (conceptoFiltro !== "TODOS" && row.concepto !== conceptoFiltro) {
        return false;
      }

      if (!text) {
        return true;
      }

      return String(row.concepto || "")
        .toLowerCase()
        .includes(text);
    });
  }, [movementRows, conceptoFiltro, searchConcepto]);

  const handleOpenFacturaModal = async (movement) => {
    const movementId = String(movement?.id || "");

    if (!movementId.startsWith("factura-")) {
      return;
    }

    const facturaId = movementId.replace("factura-", "");

    try {
      setPreviewOpen(true);
      setPreviewLoading(true);
      const preview = await facturasService.getPreview(facturaId);
      setSelectedFactura(preview);
    } catch (error) {
      setPreviewOpen(false);
      setSelectedFactura(null);
      setError(
        error.response?.data?.message ||
          "No se pudo cargar el detalle de la factura",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadFacturaModalPdf = async () => {
    if (!selectedFactura?.id) {
      return;
    }

    try {
      const { blob, fileName } = await facturasService.downloadPdf(
        selectedFactura.id,
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.response?.data?.message || "No se pudo descargar el PDF");
    }
  };

  const movementColumns = useMemo(
    () => [
      { field: "tipo", headerName: "Tipo", width: 110 },
      { field: "concepto", headerName: "Concepto", flex: 1.2, minWidth: 180 },
      { field: "categoria", headerName: "Categoria", flex: 1, minWidth: 160 },
      {
        field: "fecha",
        headerName: "Fecha",
        minWidth: 170,
        valueGetter: (_, row) => formatDateTime(row.fecha),
      },
      { field: "estado", headerName: "Estado", minWidth: 130 },
      {
        field: "importe",
        headerName: "Importe",
        minWidth: 140,
        valueGetter: (_, row) => formatCurrency(row.importe),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (params.row.tipo !== "FACTURA") {
            return <Typography variant="caption">-</Typography>;
          }

          return (
            <Stack direction="row" spacing={0.25}>
              <Tooltip title="Ver factura" arrow>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleOpenFacturaModal(params.row)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [],
  );

  const pendingRatio = useMemo(() => {
    const totalIngresos = Number(report?.kpis?.ingresosTotales || 0);
    const pending = Number(report?.kpis?.cobrosPendientesMatricula || 0);

    if (totalIngresos <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((pending / totalIngresos) * 100));
  }, [report?.kpis?.cobrosPendientesMatricula, report?.kpis?.ingresosTotales]);

  const cashFlowRows = report?.flujoCaja || [];
  const distributionRows = report?.distribucionIngresos || [];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Stack spacing={0.6}>
        <Typography variant="h4" fontWeight={900}>
          Informes de contabilidad
        </Typography>
        <Typography color="text.secondary">
          Controla ingresos, gastos, beneficio neto y cobros pendientes en una
          vista unificada.
        </Typography>
      </Stack>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(90deg, rgba(255,247,237,0.95) 0%, rgba(239,246,255,0.9) 48%, rgba(240,253,250,0.95) 100%)",
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", xl: "center" }}
          >
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <TextField
                select
                label="Periodo"
                size="small"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                sx={{ minWidth: 140 }}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {period !== "CUSTOM" ? (
                <TextField
                  size="small"
                  label="Año"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  sx={{ width: 120 }}
                />
              ) : null}

              {period === "MONTH" ? (
                <TextField
                  select
                  size="small"
                  label="Mes"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {MONTHS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {period === "QUARTER" ? (
                <TextField
                  select
                  size="small"
                  label="Trimestre"
                  value={quarter}
                  onChange={(event) => setQuarter(event.target.value)}
                  sx={{ minWidth: 140 }}
                >
                  {QUARTERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {period === "CUSTOM" ? (
                <>
                  <TextField
                    size="small"
                    type={dateFromInputType}
                    label="Desde"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    placeholder={focusDateFrom ? "dd/mm/aaaa" : ""}
                    InputLabelProps={{
                      shrink: focusDateFrom || Boolean(dateFrom),
                    }}
                    onFocus={() => {
                      setFocusDateFrom(true);
                      setDateFromInputType("date");
                    }}
                    onBlur={() => {
                      setFocusDateFrom(false);
                      if (!dateFrom) {
                        setDateFromInputType("text");
                      }
                    }}
                    sx={{ minWidth: 170 }}
                  />
                  <TextField
                    size="small"
                    type={dateToInputType}
                    label="Hasta"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    placeholder={focusDateTo ? "dd/mm/aaaa" : ""}
                    InputLabelProps={{ shrink: focusDateTo || Boolean(dateTo) }}
                    onFocus={() => {
                      setFocusDateTo(true);
                      setDateToInputType("date");
                    }}
                    onBlur={() => {
                      setFocusDateTo(false);
                      if (!dateTo) {
                        setDateToInputType("text");
                      }
                    }}
                    sx={{ minWidth: 170 }}
                  />
                </>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadReport}
                disabled={loading}
              >
                Actualizar
              </Button>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={(event) => setExportAnchor(event.currentTarget)}
                disabled={!report}
              >
                Exportar
              </Button>

              <Menu
                anchorEl={exportAnchor}
                open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    exportInformesExcel({
                      rows: movementRows,
                      kpis: report?.kpis,
                    });
                    setExportAnchor(null);
                  }}
                >
                  Exportar a Excel
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportInformesPdf({
                      rows: movementRows,
                      kpis: report?.kpis,
                    });
                    setExportAnchor(null);
                  }}
                >
                  Exportar a PDF
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box
        sx={{
          display: "grid",
          gap: 1.2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <KpiCard
          title="Ingresos totales"
          value={formatCurrency(report?.kpis?.ingresosTotales)}
          subtitle="Matrículas, bonos, clases y otros conceptos"
          icon={<PaymentsIcon fontSize="small" />}
          color="#16a34a"
        />

        <KpiCard
          title="Gastos"
          value={formatCurrency(report?.kpis?.gastosTotales)}
          subtitle="Combustible y gastos operativos registrados"
          icon={<ReceiptLongIcon fontSize="small" />}
          color="#dc2626"
        />

        <KpiCard
          title="Beneficio neto"
          value={formatCurrency(report?.kpis?.beneficioNeto)}
          subtitle="Diferencia entre ingresos y gastos"
          icon={<SavingsIcon fontSize="small" />}
          color="#0f172a"
        />

        <KpiCard
          title="Cobros pendientes matrícula"
          value={formatCurrency(report?.kpis?.cobrosPendientesMatricula)}
          subtitle="Facturas de matrícula pendientes de pago"
          icon={<WarningAmberIcon fontSize="small" />}
          color="#f59e0b"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 1.2,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "2fr 1.2fr 1fr",
          },
        }}
      >
        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800}>
              Flujo de caja
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ingresos y gastos diarios en el periodo seleccionado.
            </Typography>
            <Box sx={{ mt: 1.2, width: "100%", height: 270 }}>
              <ResponsiveContainer>
                <LineChart data={cashFlowRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 10 }}
                    tickMargin={6}
                  />
                  <YAxis tick={{ fontSize: 10 }} width={58} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    name="Ingresos"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="gastos"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    name="Gastos"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoAcumulado"
                    stroke="#1d4ed8"
                    strokeWidth={2.5}
                    name="Saldo acumulado"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800}>
              Ingresos por actividad
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Distribución de facturación pagada por categoría.
            </Typography>
            <Box sx={{ mt: 1.2, width: "100%", height: 270 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={distributionRows}
                    dataKey="total"
                    nameKey="categoria"
                    outerRadius={86}
                    label
                  >
                    {distributionRows.map((entry, index) => (
                      <Cell
                        key={entry.categoria}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800}>
              Cobros pendientes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Prioridad de cobro sobre matrículas sin liquidar.
            </Typography>

            <Typography variant="h4" fontWeight={900} sx={{ mt: 1.2 }}>
              {formatCurrency(report?.cobrosPendientes?.total)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              Facturas pendientes:{" "}
              {report?.cobrosPendientes?.totalFacturas || 0}
            </Typography>

            <Divider sx={{ my: 1.3 }} />

            <Chip
              icon={<AssessmentIcon fontSize="small" />}
              label={`Peso sobre ingresos: ${pendingRatio}%`}
              color="warning"
            />
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              Últimos movimientos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fuente combinada: facturas, pagos y gastos de combustible.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            sx={{ mb: 1.5 }}
          >
            <TextField
              select
              size="small"
              label="Concepto"
              value={conceptoFiltro}
              onChange={(event) => setConceptoFiltro(event.target.value)}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              {conceptoOptions.map((concepto) => (
                <MenuItem key={concepto} value={concepto}>
                  {concepto}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Buscar por concepto"
              value={searchConcepto}
              onChange={(event) => setSearchConcepto(event.target.value)}
              sx={{ minWidth: 260 }}
            />
          </Stack>

          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={filteredMovementRows}
              columns={movementColumns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedFactura(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Factura</DialogTitle>
        <DialogContent>
          {previewLoading ? (
            <Typography>Cargando factura...</Typography>
          ) : selectedFactura ? (
            <Stack spacing={1} sx={{ pt: 0.5 }}>
              <Typography fontWeight={700}>
                Nº {selectedFactura.numero || "-"}
              </Typography>
              <Typography variant="body2">
                Alumno: {selectedFactura.alumno?.nombre || "-"}
              </Typography>
              <Typography variant="body2">
                Concepto: {selectedFactura.concepto || "-"}
              </Typography>
              <Typography variant="body2">
                Estado: {selectedFactura.estado || "-"}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                Total: {formatCurrency(selectedFactura.total || 0)}
              </Typography>
            </Stack>
          ) : (
            <Alert severity="warning">No hay factura para mostrar</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPreviewOpen(false);
              setSelectedFactura(null);
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadFacturaModalPdf}
            disabled={!selectedFactura?.id}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
