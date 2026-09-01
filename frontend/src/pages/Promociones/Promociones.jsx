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
  IconButton,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import { promocionesService } from "../../services/promocionesService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

const TIPOS_IMAGEN_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];

const emptyForm = {
  nombre: "",
  descripcion: "",
  precioOriginal: "",
  precioPromocional: "",
  licenciasAplicables: [],
  fechaInicio: "",
  fechaFin: "",
  activa: true,
};

export default function Promociones() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

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
    promocionId: null,
    nombrePromocion: "",
    title: "",
    message: "",
  });

  const loadPromociones = async () => {
    try {
      const data = await promocionesService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "No se pudieron cargar las promociones",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadPromociones();
  }, []);

  const filteredRows = useMemo(() => rows, [rows]);

  const resetForm = () => {
    setForm(emptyForm);

    setEditingId(null);

    setImagenFile(null);

    setPreviewImage("");

    setEliminarImagenActual(false);
  };

  const buildImageSrc = (ruta) => {
    if (!ruta) {
      return "";
    }

    if (ruta.startsWith("http://") || ruta.startsWith("https://")) {
      return ruta;
    }

    return ruta;
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.type)) {
      setNotification({
        open: true,
        message: "Formato no permitido. Usa PNG, JPG/JPEG o WEBP.",
        severity: "error",
      });

      event.target.value = "";
      return;
    }

    if (file.size > TAMANO_MAXIMO_IMAGEN) {
      setNotification({
        open: true,
        message: "La imagen supera 5 MB.",
        severity: "error",
      });

      event.target.value = "";
      return;
    }

    setImagenFile(file);

    setPreviewImage(URL.createObjectURL(file));

    setEliminarImagenActual(false);
  };

  const handleToggleEliminarImagen = () => {
    if (eliminarImagenActual) {
      setEliminarImagenActual(false);

      setPreviewImage(buildImageSrc(form.imagenRuta));

      return;
    }

    setImagenFile(null);

    setPreviewImage("");

    setForm((prev) => ({
      ...prev,
      imagenRuta: "",
    }));

    setEliminarImagenActual(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      nombre: row.nombre || "",
      descripcion: row.descripcion || "",
      precioOriginal: row.precioOriginal || "",
      precioPromocional: row.precioPromocional || "",
      licenciasAplicables: row.licenciasAplicables || [],
      fechaInicio: row.fechaInicio ? row.fechaInicio.split("T")[0] : "",

      fechaFin: row.fechaFin ? row.fechaFin.split("T")[0] : "",
      activa: Boolean(row.activa),
      imagenRuta: row.imagenRuta || "",
    });
    setImagenFile(null);

    setEliminarImagenActual(false);

    setPreviewImage(buildImageSrc(row.imagenRuta));
    setOpen(true);
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      promocionId: row.id,
      nombrePromocion: row.nombre,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente la promoción "${row.nombre}" de Autoescuela Eguzkilore. Toda la información asociada será eliminada de forma permanente. Esta acción no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activa ? "deactivate" : "activate",
      promocionId: row.id,
      nombrePromocion: row.nombre,
      title: row.activa ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activa
        ? `Vas a desactivar la promoción "${row.nombre}" en Autoescuela Eguzkilore. No podrá utilizarse hasta su reactivación. ¿Deseas continuar?`
        : `Vas a reactivar la promoción "${row.nombre}" en Autoescuela Eguzkilore. Volverá a estar disponible de inmediato. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      promocionId: null,
      nombrePromocion: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.promocionId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await promocionesService.delete(confirmDialog.promocionId);
      }

      if (confirmDialog.action === "deactivate") {
        await promocionesService.deactivate(confirmDialog.promocionId);
      }

      if (confirmDialog.action === "activate") {
        await promocionesService.activate(confirmDialog.promocionId);
      }

      await loadPromociones();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Promoción eliminada correctamente"
            : confirmDialog.action === "deactivate"
              ? "Promoción desactivada correctamente"
              : "Promoción activada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: error.response?.data?.message || "Error procesando la acción",
        severity: "error",
      });
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        precioOriginal: Number(form.precioOriginal),
        precioPromocional: Number(form.precioPromocional),
      };

      if (editingId) {
        await promocionesService.update(
          editingId,
          payload,
          imagenFile,
          eliminarImagenActual,
        );
      } else {
        await promocionesService.create(payload, imagenFile);
      }

      await loadPromociones();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Promoción actualizada correctamente"
          : "Promoción creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando promoción",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1.5,
    },

    {
      field: "precioOriginal",
      headerName: "Precio Original",
      flex: 0.8,
      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "precioPromocional",
      headerName: "Precio Oferta",
      flex: 0.8,
      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "descuento",
      headerName: "Descuento",
      flex: 0.8,

      valueGetter: (_, row) => {
        const original = Number(row.precioOriginal);
        const promo = Number(row.precioPromocional);

        if (!original || !promo) {
          return "0%";
        }

        const descuento = ((original - promo) / original) * 100;

        return `${Math.round(descuento)}%`;
      },
    },

    {
      field: "licenciasAplicables",
      headerName: "Licencias",
      flex: 1.3,

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            alignItems: "center",
            height: "100%",
          }}
        >
          {(params.row.licenciasAplicables || []).map((licencia) => (
            <Chip
              key={licencia}
              label={licencia}
              size="small"
              color="primary"
            />
          ))}
        </Box>
      ),
    },

    {
      field: "vigencia",
      headerName: "Vigencia",
      flex: 1.3,

      valueGetter: (_, row) => {
        const inicio = row.fechaInicio
          ? new Date(row.fechaInicio).toLocaleDateString("es-ES")
          : "-";

        const fin = row.fechaFin
          ? new Date(row.fechaFin).toLocaleDateString("es-ES")
          : "-";

        return `${inicio} - ${fin}`;
      },
    },

    {
      field: "activa",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.row.activa ? "Activa" : "Inactiva"}
          color={params.row.activa ? "success" : "default"}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
          }}
        >
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton
            color={params.row.activa ? "warning" : "success"}
            onClick={() => handleToggleActivo(params.row)}
          >
            {params.row.activa ? <ToggleOffIcon /> : <ToggleOnIcon />}
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(params.row)}>
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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Promociones</Typography>
          <Typography color="text.secondary">
            Gestión de promociones comerciales aplicables a licencias.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nueva promoción
        </Button>
      </Box>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          {editingId ? "Editar promoción" : "Nueva promoción"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
              gap: 3,
              alignItems: "start",
              mt: 1,
            }}
          >
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="Nombre"
                fullWidth
                value={form.nombre}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nombre: event.target.value }))
                }
              />
              <TextField
                label="Descripción"
                fullWidth
                multiline
                minRows={3}
                value={form.descripcion}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    descripcion: event.target.value,
                  }))
                }
              />
              <TextField
                label="Precio Original"
                type="number"
                fullWidth
                value={form.precioOriginal}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    precioOriginal: event.target.value,
                  }))
                }
              />
              <TextField
                label="Precio Promocional"
                type="number"
                fullWidth
                value={form.precioPromocional}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    precioPromocional: event.target.value,
                  }))
                }
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  fullWidth
                  value={form.fechaInicio}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      fechaInicio: event.target.value,
                    }))
                  }
                  sx={{
                    "& input::-webkit-datetime-edit": {
                      color: form.fechaInicio ? "inherit" : "transparent",
                    },
                  }}
                />

                <TextField
                  label="Fecha Fin"
                  type="date"
                  fullWidth
                  value={form.fechaFin}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      fechaFin: event.target.value,
                    }))
                  }
                  sx={{
                    "& input::-webkit-datetime-edit": {
                      color: form.fechaFin ? "inherit" : "transparent",
                    },
                  }}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Licencias</InputLabel>

                <Select
                  multiple
                  label="Licencias"
                  value={form.licenciasAplicables}
                  renderValue={(selected) => selected.join(", ")}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      licenciasAplicables:
                        typeof event.target.value === "string"
                          ? event.target.value.split(",")
                          : event.target.value,
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
            </Box>
            <Box
              sx={{
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                backgroundColor: "#f6f6f6",
                p: 2,
                gap: 2,
              }}
            >
              {previewImage && !eliminarImagenActual ? (
                <img
                  src={previewImage}
                  alt="Vista previa promoción"
                  style={{
                    width: "90%",
                    maxHeight: "320px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Typography color="text.secondary">
                  No hay imagen seleccionada
                </Typography>
              )}

              <Button component="label" variant="outlined">
                {previewImage ? "Cambiar imagen" : "Añadir imagen"}

                <input
                  hidden
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                />
              </Button>

              {(previewImage || form.imagenRuta) && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleToggleEliminarImagen}
                >
                  {eliminarImagenActual ? "Deshacer" : "Eliminar imagen"}
                </Button>
              )}
              <Typography variant="caption">
                Formatos: PNG, JPG/JPEG, WEBP. Tamaño máximo: 5 MB.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>

        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancelar</Button>

          <Button
            variant="contained"
            color={confirmDialog.action === "activate" ? "success" : "error"}
            onClick={handleConfirmAction}
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
