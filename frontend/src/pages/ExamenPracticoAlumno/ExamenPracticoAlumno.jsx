import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { solicitudesExamenService } from "../../services/solicitudesExamenService";

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const pad2 = (value) => String(value).padStart(2, "0");

const toLocalDateKey = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const extractDateKey = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return toLocalDateKey(date);
};

const formatDate = (value) => {
  const dateKey = extractDateKey(value);
  if (!dateKey) {
    return "-";
  }

  const [year, month, day] = dateKey.split("-");
  return `${day}/${month}/${year}`;
};

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const stateToChipColor = (estado) => {
  if (estado === "APTO") {
    return "success";
  }

  if (estado === "NO_APTO" || estado === "NO_PRESENTADO") {
    return "error";
  }

  if (estado === "CANCELADO") {
    return "default";
  }

  return "warning";
};

export default function ExamenPracticoAlumno() {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState(null);
  const [calendarDates, setCalendarDates] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [eligibilityData, calendarData, mineData] = await Promise.all([
        solicitudesExamenService.getPracticalEligibility(),
        solicitudesExamenService.getPracticalCalendar(),
        solicitudesExamenService.getMine(),
      ]);

      setEligibility(eligibilityData);
      setCalendarDates(calendarData.fechas || []);
      setMyRequests(
        (mineData || []).filter((item) => item.tipo === "PRACTICO"),
      );
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar la convocatoria práctica",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableDateSet = useMemo(() => {
    const set = new Set();
    calendarDates.forEach((item) => {
      set.add(extractDateKey(item.fecha));
    });
    return set;
  }, [calendarDates]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const canPickDate = Boolean(eligibility?.canPickDate);
  const canRequest = Boolean(eligibility?.canRequest);

  const handleRequest = async () => {
    if (!selectedDate) {
      setNotification({
        open: true,
        message: "Selecciona una fecha del calendario DGT",
        severity: "warning",
      });
      return;
    }

    try {
      await solicitudesExamenService.requestPracticalExam({
        fechaProgramada: selectedDate,
      });

      setNotification({
        open: true,
        message: "Convocatoria práctica solicitada correctamente",
        severity: "success",
      });
      setSelectedDate(null);
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo registrar la solicitud de examen práctico",
        severity: "error",
      });
    }
  };

  const handleCancel = async (id) => {
    try {
      await solicitudesExamenService.cancelPracticalRequest(id);
      setNotification({
        open: true,
        message: "Solicitud cancelada correctamente",
        severity: "success",
      });
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cancelar la solicitud práctica",
        severity: "error",
      });
    }
  };

  const handleOpenExamModal = (row) => {
    setSelectedExam(row);
    setOpenExamModal(true);
  };

  const handleCloseExamModal = () => {
    setOpenExamModal(false);
    setSelectedExam(null);
  };

  const columns = [
    {
      field: "fechaProgramada",
      headerName: "Fecha examen",
      flex: 1,
      valueGetter: (_, row) => formatDate(row.fechaProgramada),
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={stateToChipColor(params.value)}
        />
      ),
    },
    {
      field: "faltas",
      headerName: "Faltas",
      flex: 1.6,
      valueGetter: (_, row) => {
        if (row.faltasLeves === null || row.faltasLeves === undefined) {
          return "-";
        }

        return `L:${row.faltasLeves} D:${row.faltasDeficientes || 0} E:${row.faltasEliminatorias || 0}`;
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 170,
      sortable: false,
      renderCell: (params) => {
        const isActive = ["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(
          params.row.estado,
        );

        return (
          <Button
            size="small"
            color="warning"
            variant="outlined"
            disabled={!isActive}
            onClick={(event) => {
              event.stopPropagation();
              handleCancel(params.row.id);
            }}
          >
            Cancelar
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Convocatoria examen práctico
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Revisa tus requisitos, paga los gastos de examen y selecciona la fecha
        disponible en el calendario de convocatorias.
      </Typography>

      {eligibility && (
        <Paper sx={{ p: 2.5, mb: 3, border: "1px solid #e2e8f0" }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Estado de requisitos
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mb: 1.5 }}
          >
            <Chip
              label={
                eligibility.checks?.matriculaPagada
                  ? "Matrícula pagada"
                  : "Matrícula pendiente"
              }
              color={
                eligibility.checks?.matriculaPagada ? "success" : "warning"
              }
            />
            <Chip
              label={
                eligibility.checks?.psicotecnicoValidado
                  ? "Psicotécnico validado"
                  : "Psicotécnico pendiente"
              }
              color={
                eligibility.checks?.psicotecnicoValidado ? "success" : "warning"
              }
            />
            <Chip
              label={`Hojas ruta: ${eligibility.hojasRuta?.registradas || 0}/${eligibility.hojasRuta?.requeridas || 5}`}
              color={
                eligibility.checks?.hojasRutaMinimas ? "success" : "warning"
              }
            />
            <Chip
              label={
                eligibility.checks?.pagoGastoPracticoPagado
                  ? "Gasto práctico pagado"
                  : "Gasto práctico pendiente"
              }
              color={
                eligibility.checks?.pagoGastoPracticoPagado
                  ? "success"
                  : "warning"
              }
            />
            <Chip
              label={`Convocatorias DGT: ${eligibility.tasa?.convocatoriasDisponibles ?? 0}`}
              color={
                eligibility.checks?.convocatoriasDisponibles
                  ? "success"
                  : "warning"
              }
            />
            <Chip
              label={`Clases post NO_APTO: ${eligibility.postNoApto?.clasesCompletadas || 0}/${eligibility.postNoApto?.clasesRequeridas || 0}`}
              color={
                eligibility.checks?.clasesPostNoAptoCompletadas
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

          {!eligibility.checks?.pagoGastoPracticoPagado &&
            eligibility.pagoGastoPractico?.id && (
              <Alert severity="info" sx={{ mb: 1.5 }}>
                Tienes un pago pendiente de gastos de examen práctico. Debes
                abonarlo antes de confirmar la fecha.
                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/pago-matricula?pagoId=${eligibility.pagoGastoPractico.id}`,
                      )
                    }
                  >
                    Ir al pago
                  </Button>
                </Box>
              </Alert>
            )}

          {(eligibility.bloqueos || []).map((bloqueo) => (
            <Alert key={bloqueo} severity="warning" sx={{ mb: 1 }}>
              {bloqueo}
            </Alert>
          ))}

          {canRequest && (
            <Alert severity="success">
              Cumples todos los requisitos para confirmar convocatoria práctica.
            </Alert>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 2.5, mb: 3, border: "1px solid #e2e8f0" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Calendario de convocatorias DGT</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const prev = new Date(viewDate);
                prev.setMonth(prev.getMonth() - 1);
                setViewDate(prev);
              }}
            >
              Mes anterior
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const next = new Date(viewDate);
                next.setMonth(next.getMonth() + 1);
                setViewDate(next);
              }}
            >
              Mes siguiente
            </Button>
          </Stack>
        </Stack>

        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
          {viewDate.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {WEEK_DAYS.map((label) => (
            <Box
              key={label}
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              {label}
            </Box>
          ))}

          {monthGrid.map((cell, index) => {
            if (!cell) {
              return <Box key={`empty-${index}`} sx={{ height: 44 }} />;
            }

            const key = toLocalDateKey(cell);
            const isAvailable = availableDateSet.has(key);
            const isSelected = selectedDate === key;

            return (
              <Button
                key={key}
                variant={isSelected ? "contained" : "outlined"}
                color={isAvailable ? "primary" : "inherit"}
                disabled={!isAvailable || !canPickDate || loading}
                onClick={() => setSelectedDate(key)}
                sx={{ minWidth: 0, height: 44 }}
              >
                {cell.getDate()}
              </Button>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Fecha seleccionada:{" "}
            {selectedDate ? formatDate(selectedDate) : "ninguna"}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRequest}
            disabled={!canRequest || loading}
          >
            Solicitar convocatoria
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, border: "1px solid #e2e8f0" }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Mis solicitudes prácticas
        </Typography>
        <DataGrid
          autoHeight
          rows={myRequests}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          onRowClick={(params) => handleOpenExamModal(params.row)}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: "fechaProgramada", sort: "asc" }],
            },
          }}
        />
      </Paper>

      <Dialog
        open={openExamModal}
        onClose={handleCloseExamModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de examen práctico</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1, pt: 1 }}>
          <Typography>
            <strong>Fecha programada:</strong>{" "}
            {formatDate(selectedExam?.fechaProgramada)}
          </Typography>
          <Typography>
            <strong>Estado:</strong> {selectedExam?.estado || "-"}
          </Typography>
          <Typography>
            <strong>Motivo no apto:</strong> {selectedExam?.motivoNoApto || "-"}
          </Typography>

          <Divider sx={{ my: 0.5 }} />

          <Typography>
            <strong>Faltas leves:</strong> {selectedExam?.faltasLeves ?? 0}
          </Typography>
          {(selectedExam?.faltasLevesDetalle || []).length > 0 ? (
            <List dense disablePadding>
              {selectedExam.faltasLevesDetalle.map((falta, index) => (
                <ListItem key={`p-leve-${index}`} sx={{ px: 0, py: 0.2 }}>
                  <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    primary={`- ${falta}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin faltas leves registradas.
            </Typography>
          )}

          <Typography>
            <strong>Faltas deficientes:</strong>{" "}
            {selectedExam?.faltasDeficientes ?? 0}
          </Typography>
          {(selectedExam?.faltasDeficientesDetalle || []).length > 0 ? (
            <List dense disablePadding>
              {selectedExam.faltasDeficientesDetalle.map((falta, index) => (
                <ListItem key={`p-def-${index}`} sx={{ px: 0, py: 0.2 }}>
                  <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    primary={`- ${falta}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin faltas deficientes registradas.
            </Typography>
          )}

          <Typography>
            <strong>Faltas eliminatorias:</strong>{" "}
            {selectedExam?.faltasEliminatorias ?? 0}
          </Typography>
          {(selectedExam?.faltasEliminatoriasDetalle || []).length > 0 ? (
            <List dense disablePadding>
              {selectedExam.faltasEliminatoriasDetalle.map((falta, index) => (
                <ListItem key={`p-eli-${index}`} sx={{ px: 0, py: 0.2 }}>
                  <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    primary={`- ${falta}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin faltas eliminatorias registradas.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExamModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
