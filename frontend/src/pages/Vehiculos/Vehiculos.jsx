import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UndoIcon from "@mui/icons-material/Undo";
import { vehiculosService } from "../../services/vehiculosService";

const PERMISOS = ["B", "A1", "A2", "A", "C", "D", "E"];
const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
const TIPOS_IMAGEN_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];

const formDataVehiculo = (vehiculo, imagenFile, eliminarImagen) => {
  const data = new FormData();

  data.append("matricula", vehiculo.matricula?.trim().toUpperCase() || "");
  data.append("marca", vehiculo.marca?.trim() || "");
  data.append("modelo", vehiculo.modelo?.trim() || "");
  data.append("tipoPermiso", vehiculo.tipoPermiso || "");

  if (imagenFile) {
    data.append("imagen", imagenFile);
  }

  if (eliminarImagen) {
    data.append("eliminarImagen", "true");
  }

  return data;
};

export default function Vehiculos() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [search, setSearch] = useState("");

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    matricula: "",
    marca: "",
    modelo: "",
    tipoPermiso: "B",
    imagenRuta: "",
    activo: true,
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [eliminarImagenActual, setEliminarImagenActual] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const buildImageSrc = (ruta) => {
    if (!ruta) {
      return "";
    }

    if (ruta.startsWith("http://") || ruta.startsWith("https://")) {
      return ruta;
    }

    return ruta;
  };

  const loadVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudo cargar el listado de vehículos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const texto = search.trim().toLowerCase();

    return rows.filter((row) => {
      return (
        row.matricula?.toLowerCase().includes(texto) ||
        row.marca?.toLowerCase().includes(texto) ||
        row.modelo?.toLowerCase().includes(texto) ||
        row.tipoPermiso?.toLowerCase().includes(texto)
      );
    });
  }, [rows, search]);

  const resetForm = () => {
    setNuevoVehiculo({
      matricula: "",
      marca: "",
      modelo: "",
      tipoPermiso: "B",
      imagenRuta: "",
      activo: true,
    });

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage("");
    setImagenFile(null);
    setEliminarImagenActual(false);
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
        message: "La imagen supera 5 MB. Selecciona un archivo más pequeño.",
        severity: "error",
      });
      event.target.value = "";
      return;
    }

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setImagenFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setEliminarImagenActual(false);
  };

  const handleToggleEliminarImagen = () => {
    if (eliminarImagenActual) {
      setEliminarImagenActual(false);
      setPreviewImage(buildImageSrc(nuevoVehiculo.imagenRuta));
      return;
    }

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setImagenFile(null);
    setPreviewImage("");
    setNuevoVehiculo((prev) => ({ ...prev, imagenRuta: "" }));
    setEliminarImagenActual(true);
  };

  const saveVehiculo = async () => {
    try {
      if (!nuevoVehiculo.matricula?.trim()) {
        setNotification({
          open: true,
          message: "La matrícula es obligatoria",
          severity: "error",
        });
        return;
      }

      if (!nuevoVehiculo.tipoPermiso?.trim()) {
        setNotification({
          open: true,
          message: "El tipo de permiso es obligatorio",
          severity: "error",
        });
        return;
      }

      const targetId = editingId;
      const payload = formDataVehiculo(
        nuevoVehiculo,
        imagenFile,
        Boolean(targetId) && eliminarImagenActual,
      );

      const vehiculoGuardado = targetId
        ? await vehiculosService.update(targetId, payload)
        : await vehiculosService.create(payload);

      if (targetId) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === targetId ? { ...row, ...vehiculoGuardado } : row,
          ),
        );

        if (
          selectedVehiculo &&
          String(selectedVehiculo.id) === String(targetId)
        ) {
          setSelectedVehiculo((prev) => ({
            ...prev,
            ...vehiculoGuardado,
            imagenRuta: vehiculoGuardado.imagenRuta ?? null,
          }));
        }
      }

      setOpen(false);
      setEditingId(null);
      resetForm();
      await loadVehiculos();

      if (
        targetId &&
        openDetail &&
        String(selectedVehiculo?.id || "") === String(targetId)
      ) {
        try {
          const detalleActualizado = await vehiculosService.getById(targetId);
          setSelectedVehiculo(detalleActualizado || vehiculoGuardado);
        } catch (error) {
          console.error(error);
        }
      }

      setNotification({
        open: true,
        message: editingId
          ? "Vehículo actualizado correctamente"
          : "Vehículo creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          (editingId
            ? "Error actualizando vehículo"
            : "Error creando vehículo"),
        severity: "error",
      });
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setNuevoVehiculo({
      matricula: row.matricula || "",
      marca: row.marca || "",
      modelo: row.modelo || "",
      tipoPermiso: row.tipoPermiso || "B",
      imagenRuta: row.imagenRuta || "",
      activo: row.activo,
    });

    setImagenFile(null);
    setEliminarImagenActual(false);
    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(buildImageSrc(row.imagenRuta));
    setOpen(true);
  };

  const handleDeactivate = async (id) => {
    try {
      const confirmar = window.confirm(
        "¿Seguro que deseas desactivar este vehículo?",
      );
      if (!confirmar) {
        return;
      }

      await vehiculosService.deactivate(id);
      await loadVehiculos();

      setNotification({
        open: true,
        message: "Vehículo desactivado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error desactivando vehículo",
        severity: "error",
      });
    }
  };

  const handleActivate = async (id) => {
    try {
      await vehiculosService.activate(id);
      await loadVehiculos();

      setNotification({
        open: true,
        message: "Vehículo activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error activando vehículo",
        severity: "error",
      });
    }
  };

  const handleOpenDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setSelectedVehiculo(row);

    try {
      const detalle = await vehiculosService.getById(row.id);
      setSelectedVehiculo(detalle);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudo cargar el detalle del vehículo",
        severity: "error",
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const columns = [
    { field: "matricula", headerName: "Matrícula", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
    { field: "tipoPermiso", headerName: "Permiso", flex: 0.7 },
    {
      field: "imagen",
      headerName: "Imagen",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const src = buildImageSrc(params.row.imagenRuta);

        if (!src) {
          return <Typography variant="caption">Sin imagen</Typography>;
        }

        return (
          <Box
            component="img"
            src={src}
            alt={params.row.matricula}
            sx={{ width: 56, height: 40, objectFit: "cover", borderRadius: 1 }}
          />
        );
      },
    },
    {
      field: "activo",
      headerName: "Estado",
      flex: 0.7,
      valueGetter: (_, row) => (row.activo ? "Activo" : "Inactivo"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>

          {params.row.activo ? (
            <IconButton
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleDeactivate(params.row.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={(event) => {
                event.stopPropagation();
                handleActivate(params.row.id);
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Vehículos
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={() => {
            setEditingId(null);
            resetForm();
            setOpen(true);
          }}
        >
          Nuevo Vehículo
        </Button>

        <TextField
          size="small"
          label="Buscar vehículo"
          placeholder="Matrícula, marca, modelo o permiso"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 340 }}
        />
      </Box>

      <Paper sx={{ height: 600, p: 2 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          onRowClick={(params) => handleOpenDetail(params.row)}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          {editingId ? "Editar Vehículo" : "Crear Vehículo"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Matrícula"
                placeholder="1234ABC"
                value={nuevoVehiculo.matricula}
                onChange={(e) =>
                  setNuevoVehiculo({
                    ...nuevoVehiculo,
                    matricula: e.target.value.toUpperCase(),
                  })
                }
                InputProps={{
                  sx: {
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.9rem" },
                }}
              />

              <TextField
                fullWidth
                label="Marca"
                value={nuevoVehiculo.marca}
                onChange={(e) =>
                  setNuevoVehiculo({
                    ...nuevoVehiculo,
                    marca: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Modelo"
                value={nuevoVehiculo.modelo}
                onChange={(e) =>
                  setNuevoVehiculo({
                    ...nuevoVehiculo,
                    modelo: e.target.value,
                  })
                }
              />

              <Select
                fullWidth
                value={nuevoVehiculo.tipoPermiso}
                onChange={(e) =>
                  setNuevoVehiculo({
                    ...nuevoVehiculo,
                    tipoPermiso: e.target.value,
                  })
                }
              >
                {PERMISOS.map((permiso) => (
                  <MenuItem key={permiso} value={permiso}>
                    {permiso}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box
              sx={{
                minHeight: 320,
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
                <Box
                  component="img"
                  src={previewImage}
                  alt="Vista previa del vehículo"
                  sx={{
                    width: "100%",
                    maxHeight: 360,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              ) : nuevoVehiculo.imagenRuta && !eliminarImagenActual ? (
                <Box
                  component="img"
                  src={buildImageSrc(nuevoVehiculo.imagenRuta)}
                  alt="Imagen del vehículo"
                  sx={{
                    width: "100%",
                    maxHeight: 360,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {editingId
                    ? "No hay imagen asociada actualmente."
                    : "Aún no has añadido ninguna imagen."}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    minWidth: 170,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #edf6ff 100%)",
                    borderColor: "#1e88e5",
                    color: "#1565c0",
                    boxShadow: "0 2px 8px rgba(30,136,229,0.12)",
                    px: 2,
                    py: 1,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #eef7ff 0%, #dfefff 100%)",
                      borderColor: "#1565c0",
                    },
                  }}
                >
                  {imagenFile || previewImage || nuevoVehiculo.imagenRuta
                    ? "Cambiar imagen"
                    : "Añadir imagen"}
                  <input
                    type="file"
                    hidden
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                  />
                </Button>

                {editingId && (previewImage || nuevoVehiculo.imagenRuta) ? (
                  <Button
                    variant={eliminarImagenActual ? "contained" : "contained"}
                    color={eliminarImagenActual ? "warning" : "error"}
                    startIcon={
                      eliminarImagenActual ? (
                        <UndoIcon />
                      ) : (
                        <DeleteForeverIcon />
                      )
                    }
                    onClick={handleToggleEliminarImagen}
                    sx={{
                      minWidth: 185,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 700,
                      background: eliminarImagenActual
                        ? "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)"
                        : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                      boxShadow: "0 8px 18px rgba(245, 124, 0, 0.24)",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        filter: "brightness(1.03)",
                      },
                    }}
                  >
                    {eliminarImagenActual
                      ? "Deshacer eliminación"
                      : "Eliminar imagen"}
                  </Button>
                ) : null}
              </Box>

              <Typography variant="caption" display="block">
                Formatos: PNG, JPG/JPEG, WEBP. Tamaño máximo: 5 MB.
              </Typography>

              {eliminarImagenActual ? (
                <Typography
                  variant="caption"
                  color="warning.main"
                  display="block"
                >
                  La imagen actual se eliminará al guardar.
                </Typography>
              ) : null}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveVehiculo}>
            {editingId ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detalle del Vehículo</DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
                gap: 3,
                alignItems: "start",
              }}
            >
              <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="Matrícula"
                  value={selectedVehiculo?.matricula || ""}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                    },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.9rem" },
                  }}
                  fullWidth
                />

                <TextField
                  label="Marca"
                  value={selectedVehiculo?.marca || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />

                <TextField
                  label="Modelo"
                  value={selectedVehiculo?.modelo || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />

                <TextField
                  label="Permiso"
                  value={selectedVehiculo?.tipoPermiso || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />

                <TextField
                  label="Estado"
                  value={selectedVehiculo?.activo ? "Activo" : "Inactivo"}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>

              <Box
                sx={{
                  minHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  backgroundColor: "#f6f6f6",
                  p: 1.5,
                }}
              >
                {selectedVehiculo?.imagenRuta ? (
                  <Box
                    component="img"
                    src={buildImageSrc(selectedVehiculo.imagenRuta)}
                    alt={`Vehículo ${selectedVehiculo?.matricula || ""}`}
                    sx={{
                      width: "100%",
                      maxHeight: 460,
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Este vehículo no tiene imagen asociada.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedVehiculo) {
                handleEdit(selectedVehiculo);
              }
            }}
            disabled={!selectedVehiculo || loadingDetail}
          >
            Editar vehículo
          </Button>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
