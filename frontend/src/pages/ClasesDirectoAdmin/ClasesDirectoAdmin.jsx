import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import { clasesDirectoService } from "../../services/clasesDirecto.service";
import { profesoresService } from "../../services/profesoresService";

export default function ClasesDirectoAdmin() {
  const [clases, setClases] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    videoUrl: "",
    duracionSegundos: 0,
    permiso: "B",
    profesorId: "",
  });

  const getThumbnail = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([^&?/]+)/);

    if (!match) {
      return "";
    }

    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  const guardarClase = async () => {
    try {
      if (editingId) {
        await clasesDirectoService.update(editingId, form);
      } else {
        await clasesDirectoService.create(form);
      }

      resetFormulario();

      setOpen(false);

      cargarClases();
    } catch (error) {
      console.error(error);
    }
  };

  const desactivarClase = async (id) => {
    try {
      await clasesDirectoService.deactivate(id);

      cargarClases();
    } catch (error) {
      console.error(error);
    }
  };

  const activarClase = async (id) => {
    try {
      await clasesDirectoService.activate(id);

      cargarClases();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarClases();
    cargarProfesores();
  }, []);

  const cargarClases = async () => {
    try {
      const data = await clasesDirectoService.getAll();
      console.log(data);

      setClases(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarProfesores = async () => {
    try {
      const data = await profesoresService.getAll();

      setProfesores(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [editingId, setEditingId] = useState(null);

  const resetFormulario = () => {
    setEditingId(null);

    setForm({
      titulo: "",
      descripcion: "",
      videoUrl: "",
      duracionSegundos: 0,
      permiso: "B",
      profesorId: "",
    });
  };

  return (
    <Box sx={{ mb: 4, width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Gestión Clases en Directo</Typography>

        <Button
          variant="contained"
          sx={{ ml: "auto" }}
          onClick={() => {
            resetFormulario();
            setOpen(true);
          }}
        >
          Nueva Clase
        </Button>
      </Stack>

      {clases.map((clase) => (
        <Paper
          key={clase.id}
          sx={{
            p: 3,
            mb: 3,
            display: "flex",
            gap: 3,
            alignItems: "center",
          }}
        >
          <img
            src={getThumbnail(clase.videoUrl)}
            alt={clase.titulo}
            style={{
              width: 220,
              height: 130,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />

          <Box flex={1}>
            <Typography variant="h6">{clase.titulo}</Typography>

            <Typography>Permiso: {clase.permiso}</Typography>

            <Typography>
              Profesor: {clase.profesor?.usuario?.nombre || "Sin asignar"}
            </Typography>

            <Typography>
              Duración: {Math.round(clase.duracionSegundos / 60)} min
            </Typography>

            <Typography>
              Estado: {clase.activa ? "Activa" : "Inactiva"}
            </Typography>
          </Box>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editingId ? "Editar Clase en Directo" : "Nueva Clase en Directo"}
            </DialogTitle>

            <DialogContent>
              <TextField
                label="Título"
                fullWidth
                margin="normal"
                value={form.titulo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    titulo: e.target.value,
                  })
                }
              />

              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({
                    ...form,
                    descripcion: e.target.value,
                  })
                }
              />

              <TextField
                label="URL YouTube"
                fullWidth
                margin="normal"
                value={form.videoUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    videoUrl: e.target.value,
                  })
                }
              />

              {form.videoUrl && getThumbnail(form.videoUrl) && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Vista previa del vídeo
                  </Typography>

                  <img
                    src={getThumbnail(form.videoUrl)}
                    alt="Vista previa YouTube"
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </Box>
              )}

              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                La miniatura se genera automáticamente desde YouTube
              </Typography>

              <TextField
                label="Duración (segundos)"
                type="number"
                fullWidth
                margin="normal"
                value={form.duracionSegundos}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duracionSegundos: e.target.value,
                  })
                }
              />

              <TextField
                select
                label="Permiso"
                fullWidth
                margin="normal"
                value={form.permiso}
                onChange={(e) =>
                  setForm({
                    ...form,
                    permiso: e.target.value,
                  })
                }
              >
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="A1">A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </TextField>

              <TextField
                select
                label="Profesor"
                fullWidth
                margin="normal"
                value={form.profesorId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profesorId: e.target.value,
                  })
                }
              >
                <MenuItem value="">Sin asignar</MenuItem>

                {profesores.map((profesor) => (
                  <MenuItem key={profesor.id} value={profesor.id}>
                    {profesor.usuario?.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  resetFormulario();
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>

              <Button variant="contained" onClick={guardarClase}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ mr: 2, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setEditingId(clase.id);

                setForm({
                  titulo: clase.titulo,
                  descripcion: clase.descripcion || "",
                  videoUrl: clase.videoUrl,
                  duracionSegundos: clase.duracionSegundos,
                  permiso: clase.permiso,
                  profesorId: clase.profesorId || "",
                });

                setOpen(true);
              }}
            >
              Editar
            </Button>

            {clase.activa ? (
              <Button
                color="error"
                variant="outlined"
                onClick={() => desactivarClase(clase.id)}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                color="success"
                variant="outlined"
                onClick={() => activarClase(clase.id)}
              >
                Activar
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
