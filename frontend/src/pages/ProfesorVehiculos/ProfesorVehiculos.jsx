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
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { profesorPortalService } from "../../services/profesorPortalService";

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

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadVehicles = async () => {
    setLoading(true);
    setError("");

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
      renderCell: (params) => (
        <Chip label={params.value || "-"} color="info" size="small" />
      ),
    },
  ];

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

      <Paper sx={{ p: 2, height: 560 }}>
        <DataGrid
          loading={loading}
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
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
    </Box>
  );
}
