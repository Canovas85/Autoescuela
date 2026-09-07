import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DeleteIcon from "@mui/icons-material/Delete";

import { preguntasDGTService } from "../../services/preguntasDGTService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const createEmptyForm = () => ({
  licencia: "B",
  enunciado: "",
  explicacion: "",
  activa: true,
  respuestas: [
    { texto: "", correcta: true },
    { texto: "", correcta: false },
    { texto: "", correcta: false },
    { texto: "", correcta: false },
  ],
});

const normalizeRows = (rows = []) => {
  return rows.map((row) => ({
    ...row,
    respuestas: Array.isArray(row.respuestas)
      ? [...row.respuestas].sort((a, b) => (a.orden || 0) - (b.orden || 0))
      : [],
  }));
};

export default function TestDGTAdmin() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm());

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    id: null,
    title: "",
    message: "",
  });

  const loadPreguntas = async () => {
    try {
      const data = await preguntasDGTService.getAll();
      setRows(normalizeRows(data));
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudo cargar el banco de preguntas DGT",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadPreguntas();
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const text = search.trim().toLowerCase();

    return rows.filter((row) => {
      const enunciado = row.enunciado?.toLowerCase() || "";
      const licencias = (row.licencia || []).join(" ").toLowerCase();

      return enunciado.includes(text) || licencias.includes(text);
    });
  }, [rows, search]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (row) => {
    const respuestas = (row.respuestas || []).slice(0, 4);

    while (respuestas.length < 4) {
      respuestas.push({ texto: "", correcta: false });
    }

    setForm({
      licencia: row.licencia?.[0] || "B",
      enunciado: row.enunciado || "",
      explicacion: row.explicacion || "",
      activa: Boolean(row.activa),
      respuestas: respuestas.map((item, index) => ({
        texto: item.texto || "",
        correcta: index === respuestas.findIndex((r) => r.correcta),
      })),
    });
    setEditingId(row.id);
    setOpen(true);
  };

  const handleSetRespuestaText = (index, value) => {
    setForm((prev) => ({
      ...prev,
      respuestas: prev.respuestas.map((respuesta, i) =>
        i === index ? { ...respuesta, texto: value } : respuesta,
      ),
    }));
  };

  const handleSetCorrecta = (index) => {
    setForm((prev) => ({
      ...prev,
      respuestas: prev.respuestas.map((respuesta, i) => ({
        ...respuesta,
        correcta: i === index,
      })),
    }));
  };

  const openConfirm = (action, row) => {
    const byAction = {
      activate: {
        title: "Confirmar activación",
        message:
          "Vas a activar esta pregunta para que pueda entrar en los exámenes DGT. ¿Deseas continuar?",
      },
      deactivate: {
        title: "Confirmar desactivación",
        message:
          "Vas a desactivar esta pregunta y dejará de aparecer en la generación de exámenes. ¿Deseas continuar?",
      },
      delete: {
        title: "Confirmar baja lógica",
        message:
          "Esta acción desactivará la pregunta. Podrás reactivarla más adelante desde el listado. ¿Deseas continuar?",
      },
    };

    setConfirmDialog({
      open: true,
      action,
      id: row.id,
      title: byAction[action].title,
      message: byAction[action].message,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog({
      open: false,
      action: null,
      id: null,
      title: "",
      message: "",
    });
  };

  const validateForm = () => {
    if (!form.enunciado.trim()) {
      return "El enunciado es obligatorio";
    }

    const respuestasVacias = form.respuestas.some((item) => !item.texto.trim());

    if (respuestasVacias) {
      return "Debes completar las 4 respuestas";
    }

    const correctas = form.respuestas.filter((item) => item.correcta).length;

    if (correctas !== 1) {
      return "Debe haber exactamente una respuesta correcta";
    }

    return "";
  };

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      setNotification({
        open: true,
        message: validationError,
        severity: "error",
      });
      return;
    }

    const payload = {
      licencia: [form.licencia],
      enunciado: form.enunciado.trim(),
      explicacion: form.explicacion.trim(),
      activa: form.activa,
      respuestas: form.respuestas.map((respuesta, index) => ({
        texto: respuesta.texto.trim(),
        correcta: respuesta.correcta,
        orden: index + 1,
      })),
    };

    try {
      if (editingId) {
        await preguntasDGTService.update(editingId, payload);
      } else {
        await preguntasDGTService.create(payload);
      }

      await loadPreguntas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Pregunta actualizada correctamente"
          : "Pregunta creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo guardar la pregunta",
        severity: "error",
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.id || !confirmDialog.action) {
      closeConfirm();
      return;
    }

    try {
      if (confirmDialog.action === "activate") {
        await preguntasDGTService.activate(confirmDialog.id);
      }

      if (confirmDialog.action === "deactivate") {
        await preguntasDGTService.deactivate(confirmDialog.id);
      }

      if (confirmDialog.action === "delete") {
        await preguntasDGTService.delete(confirmDialog.id);
      }

      await loadPreguntas();

      setNotification({
        open: true,
        message: "Operación realizada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo completar la operación",
        severity: "error",
      });
    } finally {
      closeConfirm();
    }
  };

  const columns = [
    {
      field: "enunciado",
      headerName: "Enunciado",
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            height: "100%",
            pt: 1.5,
          }}
        >
          <Typography variant="body2" noWrap title={params.row.enunciado}>
            {params.row.enunciado}
          </Typography>
        </Box>
      ),
    },
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 0.7,
      renderCell: (params) => (params.row.licencia || []).join(", "),
    },
    {
      field: "respuestas",
      headerName: "Respuestas",
      flex: 0.8,
      renderCell: (params) => params.row.respuestas?.length || 0,
    },
    {
      field: "activa",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.activa ? "Activa" : "Inactiva"}
          color={params.row.activa ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          {params.row.activa ? (
            <IconButton
              color="warning"
              onClick={() => openConfirm("deactivate", params.row)}
            >
              <ToggleOffIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={() => openConfirm("activate", params.row)}
            >
              <ToggleOnIcon />
            </IconButton>
          )}

          <IconButton
            color="error"
            onClick={() => openConfirm("delete", params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Banco de preguntas DGT
          </Typography>
          <Typography color="text.secondary">
            Crea, edita y gestiona la activación de preguntas para los exámenes
            DGT.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <TextField
            size="small"
            label="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Nueva pregunta
          </Button>
        </Stack>
      </Box>

      <Box sx={{ height: 640 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Editar pregunta" : "Nueva pregunta"}
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={form.licencia}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  licencia: event.target.value,
                }))
              }
            >
              {LICENCIAS.map((licencia) => (
                <MenuItem key={licencia} value={licencia}>
                  {licencia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Enunciado"
            value={form.enunciado}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                enunciado: event.target.value,
              }))
            }
            multiline
            minRows={2}
            fullWidth
          />

          <TextField
            label="Explicación (opcional)"
            value={form.explicacion}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                explicacion: event.target.value,
              }))
            }
            multiline
            minRows={2}
            fullWidth
          />

          <FormControl>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selecciona la respuesta correcta
            </Typography>

            <RadioGroup
              value={String(form.respuestas.findIndex((item) => item.correcta))}
              onChange={(event) =>
                handleSetCorrecta(Number(event.target.value))
              }
            >
              {form.respuestas.map((respuesta, index) => (
                <Box key={`respuesta-${index}`} sx={{ mb: 1.25 }}>
                  <FormControlLabel
                    value={String(index)}
                    control={<Radio />}
                    label={`Respuesta ${index + 1}`}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    value={respuesta.texto}
                    onChange={(event) =>
                      handleSetRespuestaText(index, event.target.value)
                    }
                    placeholder={`Texto de la respuesta ${index + 1}`}
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingId ? "Guardar cambios" : "Crear pregunta"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog.open} onClose={closeConfirm}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancelar</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color="error"
          >
            Confirmar
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
