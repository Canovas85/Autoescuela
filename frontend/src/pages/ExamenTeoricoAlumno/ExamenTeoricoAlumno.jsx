import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { solicitudesExamenService } from "../../services/solicitudesExamenService";
import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const pad2 = (value) => String(value).padStart(2, "0");

const toLocalDateKey = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const extractDateKey = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return toLocalDateKey(date);
};

const getDateKey = (value) => {
  return extractDateKey(value);
};

const formatDate = (value) => {
  const dateKey = extractDateKey(value);
  if (!dateKey) return "-";

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

export default function ExamenTeoricoAlumno() {
  const [eligibility, setEligibility] = useState(null);
  const [calendarDates, setCalendarDates] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [eligibilityData, calendarData, mineData] = await Promise.all([
        solicitudesExamenService.getTheoreticalEligibility(),
        solicitudesExamenService.getTheoreticalCalendar(),
        solicitudesExamenService.getMine(),
      ]);

      setEligibility(eligibilityData);
      setCalendarDates(calendarData.fechas || []);
      setMyRequests((mineData || []).filter((item) => item.tipo === "TEORICO"));
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar la convocatoria teórica",
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
      set.add(getDateKey(item.fecha));
    });
    return set;
  }, [calendarDates]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const canRequest = Boolean(eligibility?.canRequest);

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
      renderCell: (params) => {
        const color =
          params.value === "APTO"
            ? "success"
            : params.value === "NO_APTO"
              ? "error"
              : "warning";
        return <Chip size="small" label={params.value} color={color} />;
      },
    },
    {
      field: "erroresExamen",
      headerName: "Errores",
      width: 120,
      valueGetter: (_, row) =>
        row.erroresExamen === null || row.erroresExamen === undefined
          ? "-"
          : row.erroresExamen,
    },
    {
      field: "fechaSolicitud",
      headerName: "Solicitado",
      flex: 1,
      valueGetter: (_, row) => formatDate(row.fechaSolicitud),
    },
  ];

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
      await solicitudesExamenService.requestTheoreticalExam({
        fechaProgramada: selectedDate,
      });

      setNotification({
        open: true,
        message: "Convocatoria solicitada correctamente",
        severity: "success",
      });
      setSelectedDate(null);
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo registrar la solicitud de examen teórico",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Convocatoria examen teórico
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Revisa requisitos, elige una fecha oficial de la DGT y solicita tu
        convocatoria.
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
              label={
                eligibility.checks?.tasaPagada
                  ? "Tasa DGT pagada"
                  : "Tasa DGT pendiente"
              }
              color={eligibility.checks?.tasaPagada ? "success" : "warning"}
            />
            <Chip
              label={`Intentos disponibles: ${eligibility.tasa?.convocatoriasDisponibles ?? 0}`}
              color={
                eligibility.checks?.convocatoriasDisponibles
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

          {!canRequest &&
            (eligibility.bloqueos || []).map((bloqueo) => (
              <Alert key={bloqueo} severity="warning" sx={{ mb: 1 }}>
                {bloqueo}
              </Alert>
            ))}

          {canRequest && (
            <Alert severity="success">
              Cumples todos los requisitos para solicitar convocatoria teórica.
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
                disabled={!isAvailable || !canRequest || loading}
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
          Mis solicitudes teóricas
        </Typography>
        <DataGrid
          autoHeight
          rows={myRequests}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: "fechaProgramada", sort: "asc" }],
            },
          }}
        />
      </Paper>

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
