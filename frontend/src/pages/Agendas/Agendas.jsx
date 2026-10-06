import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ReadOnlyWeeklyAgendaBoard from "../../components/agenda/ReadOnlyWeeklyAgendaBoard";
import { profesoresService } from "../../services/profesoresService";

export default function Agendas() {
  const [profesores, setProfesores] = useState([]);
  const [selectedProfesorId, setSelectedProfesorId] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [agendaData, setAgendaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedProfesor = useMemo(
    () => profesores.find((item) => item.id === selectedProfesorId) || null,
    [profesores, selectedProfesorId],
  );

  const loadProfesores = async () => {
    try {
      const data = await profesoresService.getAll();
      const activos = (data || []).filter((item) => item.activo !== false);
      setProfesores(activos);

      if (!selectedProfesorId && activos.length > 0) {
        setSelectedProfesorId(activos[0].id);
      }
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudo cargar el listado de profesores",
      );
    }
  };

  const loadAgenda = async (profesorId, offset = weekOffset) => {
    if (!profesorId) {
      setAgendaData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await profesoresService.getAdminAgenda(profesorId, {
        weekOffset: offset,
      });

      setAgendaData(response);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudo cargar la agenda del profesor",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfesores();
  }, []);

  useEffect(() => {
    loadAgenda(selectedProfesorId, weekOffset);
  }, [selectedProfesorId, weekOffset]);

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Agendas
        </Typography>
        <Typography color="text.secondary">
          Visualiza la agenda semanal de cada profesor con seguimiento de cargas
          por estado.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2 }}
      >
        <TextField
          select
          size="small"
          label="Profesor"
          value={selectedProfesorId}
          onChange={(event) => {
            setSelectedProfesorId(event.target.value);
            setWeekOffset(0);
          }}
          sx={{ minWidth: 320 }}
        >
          {(profesores || []).map((profesor) => (
            <MenuItem key={profesor.id} value={profesor.id}>
              {profesor.usuario?.nombre || "Profesor"}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {!selectedProfesorId && !loading ? (
        <Alert severity="info">No hay profesores activos para mostrar.</Alert>
      ) : (
        <ReadOnlyWeeklyAgendaBoard
          title={`Agenda semanal${selectedProfesor ? ` · ${selectedProfesor.usuario?.nombre || "Profesor"}` : ""}`}
          data={agendaData}
          loading={loading}
          error={error}
          onPrevWeek={() => setWeekOffset((prev) => prev - 1)}
          onNextWeek={() => setWeekOffset((prev) => prev + 1)}
          showStudentName
          emptyMessage="No hay clases programadas para este profesor en la semana seleccionada."
        />
      )}
    </Box>
  );
}
