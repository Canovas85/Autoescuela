import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { profesorPortalService } from "../../services/profesorPortalService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { gastosCombustibleService } from "../../services/gastosCombustibleService";

const TITULAR_TARJETA = "Autoescuela Eguzkilore";
const NUMERO_TARJETA = "5102 1234 4321 5015";

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

export default function ProfesorVehiculos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [openRefuel, setOpenRefuel] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [reciboFile, setReciboFile] = useState(null);
  const [loadingRefuel, setLoadingRefuel] = useState(false);

  const loadVehicles = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await profesorPortalService.getVehicles();
      setRows(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar los vehículos compatibles",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const q = search.trim().toLowerCase();

    return rows.filter(
      (row) =>
        row.matricula?.toLowerCase().includes(q) ||
        row.marca?.toLowerCase().includes(q) ||
        row.modelo?.toLowerCase().includes(q) ||
        row.tipoPermiso?.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columns = [
    {
      field: "matricula",
      headerName: "Matrícula",
      flex: 1,
    },
    {
      field: "marca",
      headerName: "Marca",
      flex: 1,
      valueGetter: (_, row) => row.marca || "-",
    },
    {
      field: "modelo",
      headerName: "Modelo",
      flex: 1,
      valueGetter: (_, row) => row.modelo || "-",
    },
    {
      field: "tipoPermiso",
      headerName: "Permiso",
      width: 110,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    {
      field: "kmActuales",
      headerName: "KMs actuales",
      width: 140,
      valueGetter: (_, row) => row.kmActuales ?? 0,
    },
    {
      field: "combustibleActualPct",
      headerName: "Combustible",
      width: 170,
      renderCell: (params) => {
        const value = Number(params.row.combustibleActualPct ?? 0);

        return (
          <Stack sx={{ width: "100%", py: 1 }} spacing={0.4}>
            <Typography variant="caption" fontWeight={700}>
              {value}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, value))}
              color={value < 20 ? "error" : value < 40 ? "warning" : "success"}
              sx={{ height: 7, borderRadius: 999 }}
            />
          </Stack>
        );
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const combustibleActual = Number(params.row.combustibleActualPct ?? 0);
        const canRefuel = combustibleActual < 20;

        return canRefuel ? (
          <Button
            size="small"
            color="warning"
            variant="contained"
            startIcon={<LocalGasStationIcon />}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedVehicle(params.row);
              setReciboFile(null);
              setOpenRefuel(true);
            }}
          >
            Repostar
          </Button>
        ) : (
          <Chip label="Sin acciones" size="small" />
        );
      },
    },
  ];

  const buildRepostajeResumen = (vehiculo) => {
    const capacidad = Number(vehiculo?.capacidadCombustibleLitros ?? 0);
    const pct = Number(vehiculo?.combustibleActualPct ?? 0);
    const litrosActuales = (capacidad * pct) / 100;
    const litrosRepostados = Math.max(0, capacidad - litrosActuales);
    const precioLitro = 1.83;
    const total = litrosRepostados * precioLitro;

    return {
      capacidad,
      litrosActuales,
      litrosRepostados,
      precioLitro,
      total,
    };
  };

  const openVehicleDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setDetail(null);

    try {
      const response = await profesorPortalService.getVehicleSchedule(row.id);
      setDetail(response);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudo cargar la agenda del vehículo",
      );
      setOpenDetail(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const submitRefuel = async () => {
    if (!selectedVehicle?.id) {
      return;
    }

    setLoadingRefuel(true);
    setError("");

    try {
      const result = await gastosCombustibleService.repostar(
        selectedVehicle.id,
        reciboFile,
      );

      setSuccess(result.message || "Repostaje realizado correctamente");
      setOpenRefuel(false);
      setSelectedVehicle(null);
      setReciboFile(null);
      await loadVehicles();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message ||
          "No se pudo registrar el repostaje",
      );
    } finally {
      setLoadingRefuel(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Vehículos Disponibles
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Selecciona un vehículo para ver las reservas programadas, incluyendo si
        la clase la impartes tú u otro profesor.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Buscar vehículo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 340 } }}
        />

        <Button variant="outlined" onClick={loadVehicles}>
          Recargar
        </Button>
      </Stack>

      <Paper sx={{ p: 2, height: 700 }}>
        <DataGrid
          loading={loading}
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "matricula", sort: "asc" }] },
          }}
          onRowClick={(params) => openVehicleDetail(params.row)}
          localeText={{ noRowsLabel: "No hay vehículos compatibles" }}
        />
      </Paper>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Reservas del vehículo</DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Vehículo
                </Typography>
                <Typography fontWeight={700}>
                  {detail?.vehiculo?.matricula || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(detail?.vehiculo?.marca || "Marca") +
                    " " +
                    (detail?.vehiculo?.modelo || "Modelo")}
                </Typography>
                <Chip
                  sx={{ mt: 1 }}
                  label={`Permiso ${detail?.vehiculo?.tipoPermiso || "-"}`}
                  color="info"
                  size="small"
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Clases reservadas
                </Typography>

                {detail?.reservas?.length ? (
                  <Stack spacing={1}>
                    {detail.reservas.map((reserva) => (
                      <Box
                        key={reserva.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {formatDateTime(reserva.fecha)} ({reserva.duracion}{" "}
                          min)
                        </Typography>
                        <Typography variant="body2">
                          Alumno: {reserva.alumno?.nombre || "Alumno"}
                        </Typography>
                        <Typography variant="body2">
                          Profesor: {reserva.profesorNombre || "Profesor"}
                        </Typography>
                        <Chip
                          sx={{ mt: 1 }}
                          size="small"
                          label={
                            reserva.esMiClase
                              ? "La imparto yo"
                              : "La imparte otro profesor"
                          }
                          color={reserva.esMiClase ? "success" : "default"}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">
                    No hay clases reservadas para este vehículo.
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRefuel}
        onClose={() => !loadingRefuel && setOpenRefuel(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Pago de combustible</DialogTitle>
        <DialogContent>
          {selectedVehicle ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Titular de la tarjeta"
                value={TITULAR_TARJETA}
                disabled
                fullWidth
              />
              <TextField
                label="Número de tarjeta"
                value={NUMERO_TARJETA}
                disabled
                fullWidth
              />

              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight={700}>
                  {selectedVehicle.matricula} - {selectedVehicle.marca || ""}{" "}
                  {selectedVehicle.modelo || ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  KMs actuales: {selectedVehicle.kmActuales ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Combustible actual:{" "}
                  {selectedVehicle.combustibleActualPct ?? 0}%
                </Typography>
              </Box>

              <Box>
                {(() => {
                  const resumen = buildRepostajeResumen(selectedVehicle);

                  return (
                    <Stack spacing={0.6}>
                      <Typography variant="body2">
                        Capacidad máxima: {resumen.capacidad.toFixed(2)} L
                      </Typography>
                      <Typography variant="body2">
                        Litros actuales estimados:{" "}
                        {resumen.litrosActuales.toFixed(2)} L
                      </Typography>
                      <Typography variant="body2">
                        Litros a repostar: {resumen.litrosRepostados.toFixed(2)}{" "}
                        L
                      </Typography>
                      <Typography variant="body2">
                        Precio litro: {resumen.precioLitro.toFixed(2)} EUR
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Total: {resumen.total.toFixed(2)} EUR
                      </Typography>
                    </Stack>
                  );
                })()}
              </Box>

              <Button variant="outlined" component="label">
                {reciboFile ? "Cambiar recibo" : "Subir recibo (opcional)"}
                <input
                  hidden
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    setReciboFile(event.target.files?.[0] || null)
                  }
                />
              </Button>

              {reciboFile ? (
                <Typography variant="caption" color="text.secondary">
                  Archivo: {reciboFile.name}
                </Typography>
              ) : null}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefuel(false)} disabled={loadingRefuel}>
            Cancelar
          </Button>
          <Button
            onClick={submitRefuel}
            variant="contained"
            color="warning"
            disabled={loadingRefuel || !selectedVehicle}
          >
            {loadingRefuel ? "Procesando..." : "Pagar y repostar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
