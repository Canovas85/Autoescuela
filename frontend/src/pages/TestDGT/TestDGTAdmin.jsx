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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UndoIcon from "@mui/icons-material/Undo";
import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

import { preguntasDGTService } from "../../services/preguntasDGTService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];
const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
const TIPOS_IMAGEN_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];

const createEmptyForm = () => ({
  licencia: ["B"],
  enunciado: "",
  explicacion: "",
  activa: true,
  imagenRuta: "",
  respuestas: [
    { texto: "", correcta: true },
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
  const [imagenFile, setImagenFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [eliminarImagenActual, setEliminarImagenActual] = useState(false);

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
    setImagenFile(null);
    setPreviewImage("");
    setEliminarImagenActual(false);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (row) => {
    const respuestas = (row.respuestas || []).slice(0, 4);

    while (respuestas.length < 3) {
      respuestas.push({ texto: "", correcta: false });
    }

    const indiceCorrecta = respuestas.findIndex(
      (respuesta) => respuesta.correcta,
    );

    setForm({
      licencia:
        Array.isArray(row.licencia) && row.licencia.length > 0
          ? row.licencia
          : ["B"],
      enunciado: row.enunciado || "",
      explicacion: row.explicacion || "",
      activa: Boolean(row.activa),
      imagenRuta: row.imagenRuta || "",
      respuestas: respuestas.map((item, index) => ({
        texto: item.texto || "",
        correcta: index === (indiceCorrecta >= 0 ? indiceCorrecta : 0),
      })),
    });
    setImagenFile(null);
    setPreviewImage(row.imagenRuta || "");
    setEliminarImagenActual(false);
    setEditingId(row.id);
    setOpen(true);
  };

  const handleLicenciasChange = (value) => {
    const licencias = typeof value === "string" ? value.split(",") : value;

    setForm((prev) => ({
      ...prev,
      licencia: licencias,
    }));
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

  const handleAddRespuesta = () => {
    setForm((prev) => {
      if (prev.respuestas.length >= 4) {
        return prev;
      }

      return {
        ...prev,
        respuestas: [...prev.respuestas, { texto: "", correcta: false }],
      };
    });
  };

  const handleRemoveRespuesta = (index) => {
    setForm((prev) => {
      if (prev.respuestas.length <= 3) {
        return prev;
      }

      const nuevasRespuestas = prev.respuestas.filter((_, i) => i !== index);

      if (!nuevasRespuestas.some((respuesta) => respuesta.correcta)) {
        nuevasRespuestas[0] = {
          ...nuevasRespuestas[0],
          correcta: true,
        };
      }

      return {
        ...prev,
        respuestas: nuevasRespuestas,
      };
    });
  };

  const handleImagenChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.type)) {
      setNotification({
        open: true,
        message: "Formato de imagen no permitido. Usa png, jpg o webp.",
        severity: "error",
      });
      return;
    }

    if (file.size > TAMANO_MAXIMO_IMAGEN) {
      setNotification({
        open: true,
        message: "La imagen supera 5 MB.",
        severity: "error",
      });
      return;
    }

    setImagenFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setEliminarImagenActual(false);
  };

  const handleToggleEliminarImagen = () => {
    if (eliminarImagenActual) {
      setEliminarImagenActual(false);
      setPreviewImage(form.imagenRuta || "");
      return;
    }

    setImagenFile(null);
    setPreviewImage("");
    setEliminarImagenActual(true);
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
    if (!Array.isArray(form.licencia) || form.licencia.length === 0) {
      return "Debes seleccionar al menos una licencia";
    }

    if (!form.enunciado.trim()) {
      return "El enunciado es obligatorio";
    }

    if (form.respuestas.length < 3 || form.respuestas.length > 4) {
      return "Debes informar entre 3 y 4 respuestas";
    }

    const respuestasVacias = form.respuestas.some((item) => !item.texto.trim());

    if (respuestasVacias) {
      return "Debes completar todas las respuestas";
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
      licencia: form.licencia,
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
        await preguntasDGTService.update(
          editingId,
          payload,
          imagenFile,
          eliminarImagenActual,
        );
      } else {
        await preguntasDGTService.create(payload, imagenFile);
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
          <Tooltip title="Editar" arrow>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          {params.row.activa ? (
            <Tooltip title="Desactivar" arrow>
              <IconButton
                color="warning"
                onClick={() => openConfirm("deactivate", params.row)}
              >
                <ToggleOffIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar" arrow>
              <IconButton
                color="success"
                onClick={() => openConfirm("activate", params.row)}
              >
                <ToggleOnIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Eliminar" arrow>
            <IconButton
              color="error"
              onClick={() => openConfirm("delete", params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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

      <Box sx={{ height: 700 }}>
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
            sorting: {
              sortModel: [{ field: "enunciado", sort: "asc" }],
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
              multiple
              value={form.licencia}
              onChange={(event) => handleLicenciasChange(event.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {LICENCIAS.map((licencia) => (
                <MenuItem key={licencia} value={licencia}>
                  Permiso {licencia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack spacing={1}>
            {previewImage && !eliminarImagenActual ? (
              <Box
                component="img"
                src={previewImage}
                alt="Vista previa de la imagen"
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay imagen seleccionada.
              </Typography>
            )}

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                {previewImage ? "Cambiar imagen" : "Añadir imagen"}
                <input
                  hidden
                  accept="image/png,image/jpeg,image/webp"
                  type="file"
                  onChange={handleImagenChange}
                />
              </Button>

              {(previewImage || form.imagenRuta) && editingId ? (
                <Button
                  variant="contained"
                  color={eliminarImagenActual ? "warning" : "error"}
                  startIcon={
                    eliminarImagenActual ? <UndoIcon /> : <DeleteIcon />
                  }
                  onClick={handleToggleEliminarImagen}
                >
                  {eliminarImagenActual ? "Deshacer" : "Eliminar imagen"}
                </Button>
              ) : null}
            </Stack>
          </Stack>

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
              Selecciona la respuesta correcta (3 o 4 respuestas)
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

                  {form.respuestas.length > 3 ? (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveRespuesta(index)}
                      >
                        Eliminar respuesta
                      </Button>
                    </Box>
                  ) : null}
                </Box>
              ))}
            </RadioGroup>

            <Button
              sx={{ mt: 1 }}
              size="small"
              onClick={handleAddRespuesta}
              disabled={form.respuestas.length >= 4}
            >
              Añadir cuarta respuesta
            </Button>
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
