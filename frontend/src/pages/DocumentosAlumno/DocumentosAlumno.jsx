import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { documentosAlumnoService } from "../../services/documentosAlumnoService";
import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

const TIPOS_DOCUMENTO = [
  "DNI",
  "CERTIFICADO_PSICOTECNICO",
  "FOTOGRAFIA",
  "PERMISO_RESIDENCIA",
  "JUSTIFICANTE",
  "OTRO",
];

const ESTADOS = {
  PENDIENTE_VALIDACION: "Pendiente de validar",
  VALIDADO: "Validado",
  RECHAZADO: "Rechazado",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES");
};

const buildFileUrl = (ruta) => {
  if (!ruta) return "";
  return ruta.startsWith("http") ? ruta : `${window.location.origin}${ruta}`;
};

const isImageFile = (mimeType = "") => mimeType.startsWith("image/");

export default function DocumentosAlumno() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tipo, setTipo] = useState("DNI");
  const [observaciones, setObservaciones] = useState("");
  const [files, setFiles] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadDocuments = async () => {
    try {
      const data = await documentosAlumnoService.getMine();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar tus documentos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const resetForm = () => {
    setTipo("DNI");
    setObservaciones("");
    setFiles([]);
    setEditingId(null);
  };

  const handleCreateOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleEditRow = (row) => {
    if (row.estado !== "PENDIENTE_VALIDACION") {
      setNotification({
        open: true,
        message: "Este documento ya está validado y no puede modificarse.",
        severity: "warning",
      });
      return;
    }

    setEditingId(row.id);
    setTipo(row.tipo);
    setObservaciones(row.observaciones || "");
    setFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const submitDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("tipo", tipo);
      if (observaciones) {
        formData.append("observaciones", observaciones);
      }

      files.forEach((file) => {
        formData.append("archivos", file);
      });

      if (editingId) {
        await documentosAlumnoService.update(editingId, formData);
      } else {
        await documentosAlumnoService.create(formData);
      }

      setNotification({
        open: true,
        message: editingId
          ? "Documento actualizado correctamente"
          : "Documento registrado correctamente",
        severity: "success",
      });
      handleClose();
      loadDocuments();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo guardar el documento",
        severity: "error",
      });
    }
  };

  const handleDelete = async (row) => {
    if (row.estado !== "PENDIENTE_VALIDACION") {
      setNotification({
        open: true,
        message: "Solo se pueden eliminar documentos pendientes de validación.",
        severity: "warning",
      });
      return;
    }

    try {
      await documentosAlumnoService.remove(row.id);
      setNotification({
        open: true,
        message: "Documento eliminado correctamente",
        severity: "success",
      });
      loadDocuments();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo eliminar el documento",
        severity: "error",
      });
    }
  };

  const removeSelectedFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const columns = useMemo(
    () => [
      { field: "tipo", headerName: "Tipo", flex: 1.4 },
      {
        field: "estado",
        headerName: "Estado",
        flex: 1.2,
        renderCell: (params) => (
          <Chip
            label={ESTADOS[params.value] || params.value}
            color={
              params.value === "VALIDADO"
                ? "success"
                : params.value === "RECHAZADO"
                  ? "error"
                  : "warning"
            }
            size="small"
          />
        ),
      },

      {
        field: "createdAt",
        headerName: "Fecha alta",
        flex: 1,
        valueGetter: (_, row) => formatDate(row.createdAt),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        flex: 1.2,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            {(params.row.archivos || []).length > 0 && (
              <Tooltip title="Ver archivo" arrow>
                <span>
                  <IconButton
                    color="primary"
                    size="small"
                    aria-label="Ver archivo"
                    onClick={() =>
                      window.open(
                        buildFileUrl(params.row.archivos[0]?.ruta),
                        "_blank",
                      )
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip title="Editar documento" arrow>
              <span>
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="Editar documento"
                  disabled={params.row.estado !== "PENDIENTE_VALIDACION"}
                  onClick={() => handleEditRow(params.row)}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Eliminar documento" arrow>
              <span>
                <IconButton
                  color="error"
                  size="small"
                  aria-label="Eliminar documento"
                  disabled={params.row.estado !== "PENDIENTE_VALIDACION"}
                  onClick={() => handleDelete(params.row)}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [rows],
  );

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
          <Typography variant="h4">Mis documentos</Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona tus documentos oficiales con estado de validación.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",
            transform: "translateY(8px)",
            border: "1px solid",
            borderColor: "#1e3a8a !important",
            color: "#1e3a8a",
            backgroundColor: "transparent",
            boxShadow: `
        0px 4px 0px #172554, 
        0px 8px 16px rgba(30, 58, 138, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
            transition: "all 0.15s ease-in-out",
            "&:hover": {
              color: "#2563eb",
              borderColor: "#2563eb !important",
              backgroundColor: "rgba(30, 58, 138, 0.04)",
              boxShadow: `
          0px 4px 0px #172554, 
          0px 12px 20px rgba(37, 99, 235, 0.25),
          inset 0px 1px 0px rgba(255, 255, 255, 0.2)
        `,
              transform: "translateY(-1px)",
            },
            "&:active": {
              borderColor: "#1e3a8a !important",
              boxShadow: `
          0px 1px 0px #172554, 
          0px 2px 4px rgba(30, 58, 138, 0.2),
          inset 0px 2px 4px rgba(0, 0, 0, 0.05)
        `,
              transform: "translateY(3px)",
            },
          }}
        >
          Nuevo documento
        </Button>
      </Box>

      {rows.length === 0 ? (
        <Alert severity="info">Todavía no has subido ningún documento.</Alert>
      ) : (
        <Box sx={{ height: 700 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "tipo", sort: "asc" }] },
            }}
          />
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Editar documento" : "Nuevo documento"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="tipo-documento-label">Tipo de documento</InputLabel>
            <Select
              labelId="tipo-documento-label"
              value={tipo}
              label="Tipo de documento"
              onChange={(event) => setTipo(event.target.value)}
            >
              {TIPOS_DOCUMENTO.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Observaciones"
            multiline
            minRows={3}
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
          />

          <Alert severity="info" sx={{ mb: 0 }}>
            Formatos aceptados: PDF, JPG, PNG, WEBP.
          </Alert>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "6px 24px",
              border: "1px solid",

              // Texto y bordes en color azul oscuro profundo
              color: "#1e3a8a",
              borderColor: "#1e3a8a !important",
              backgroundColor: "transparent",

              // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              // Triple sombra adaptada para relieve azul oscuro (borde inferior sólido + brillo sutil)
              boxShadow: `
      0px 4px 0px #172554, 
      0px 8px 16px rgba(30, 58, 138, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,

              // Suavizado de todas las animaciones físicas
              transition: "all 0.15s ease-in-out",

              "&:hover": {
                // Al pasar el ratón, se activa un azul más vivo con un fondo sutilmente iluminado
                color: "#2563eb",
                borderColor: "#2563eb !important",
                backgroundColor: "rgba(30, 58, 138, 0.04)",
                boxShadow: `
        0px 4px 0px #172554, 
        0px 12px 20px rgba(37, 99, 235, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                transform: "translateY(-1px)", // Se eleva ligeramente
              },

              "&:active": {
                // Efecto mecánico físico de hundimiento al hacer clic (Relieve presionado)
                borderColor: "#1e3a8a !important",
                boxShadow: `
        0px 1px 0px #172554, 
        0px 2px 4px rgba(30, 58, 138, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                transform: "translateY(3px)", // Se desplaza hacia abajo exactamente el grosor del relieve anterior
              },
            }}
          >
            Adjuntar archivos
            <input
              hidden
              type="file"
              multiple
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={(event) =>
                setFiles(Array.from(event.target.files || []))
              }
            />
          </Button>

          {files.length > 0 && (
            <Stack spacing={1}>
              {files.map((file, index) => (
                <Box
                  key={`${file.name}-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isImageFile(file.type) ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          backgroundColor: "#e2e8f0",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                      </Box>
                    )}
                    <Typography variant="body2" noWrap sx={{ maxWidth: 260 }}>
                      {file.name}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => removeSelectedFile(index)}
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderRadius: "8px",
                      padding: "4px 16px", // Padding optimizado para botones pequeños (size="small")
                      border: "1px solid",
                      color: "#dc2626",
                      borderColor: "#dc2626 !important",
                      backgroundColor: "transparent",
                      boxShadow: `
      0px 3px 0px #991b1b, 
      0px 6px 12px rgba(220, 38, 38, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        color: "#ef4444",
                        borderColor: "#ef4444 !important",
                        backgroundColor: "rgba(220, 38, 38, 0.04)",
                        boxShadow: `
        0px 3px 0px #991b1b, 
        0px 10px 16px rgba(239, 68, 68, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                        transform: "translateY(-1px)",
                      },
                      "&:active": {
                        borderColor: "#dc2626 !important",
                        boxShadow: `
        0px 1px 0px #991b1b, 
        0px 2px 4px rgba(220, 38, 38, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                        transform: "translateY(2px)", // Hundimiento táctil adaptado al relieve pequeño
                      },
                    }}
                  >
                    Quitar
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-end", // Alineación estricta a la derecha
            mb: 3, // Separación exacta de la parte baja del modal (24px)
            px: 3, // Colchón lateral para el relieve
            gap: 2, // Espaciado uniforme entre botones
          }}
        >
          {/* Botón Cancelar - Rojo Carmesí */}
          <Button
            onClick={handleClose}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "6px 24px",
              border: "1px solid",
              color: "#dc2626",
              borderColor: "#dc2626 !important",
              backgroundColor: "transparent",
              boxShadow: `
        0px 4px 0px #991b1b, 
        0px 8px 16px rgba(220, 38, 38, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#ef4444",
                borderColor: "#ef4444 !important",
                backgroundColor: "rgba(220, 38, 38, 0.04)",
                boxShadow: `
          0px 4px 0px #991b1b, 
          0px 12px 20px rgba(239, 68, 68, 0.25),
          inset 0px 1px 0px rgba(255, 255, 255, 0.2)
        `,
                transform: "translateY(-1px)",
              },
              "&:active": {
                borderColor: "#dc2626 !important",
                boxShadow: `
          0px 1px 0px #991b1b, 
          0px 2px 4px rgba(220, 38, 38, 0.2),
          inset 0px 2px 4px rgba(0, 0, 0, 0.05)
        `,
                transform: "translateY(3px)",
              },
            }}
          >
            Cancelar
          </Button>

          {/* Botón Confirmar (Guardar cambios / Crear documento) - Verde Esmeralda */}
          <Button
            variant="outlined"
            onClick={submitDocument}
            disabled={!files.length && !editingId}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "6px 24px",
              border: "1px solid",
              color: "#15803d",
              borderColor: "#15803d !important",
              backgroundColor: "transparent",
              boxShadow: `
        0px 4px 0px #166534, 
        0px 8px 16px rgba(21, 128, 61, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#22c55e",
                borderColor: "#22c55e !important",
                backgroundColor: "rgba(21, 128, 61, 0.04)",
                boxShadow: `
          0px 4px 0px #166534, 
          0px 12px 20px rgba(34, 197, 94, 0.25),
          inset 0px 1px 0px rgba(255, 255, 255, 0.2)
        `,
                transform: "translateY(-1px)",
              },
              "&:active": {
                borderColor: "#15803d !important",
                boxShadow: `
          0px 1px 0px #166534, 
          0px 2px 4px rgba(21, 128, 61, 0.2),
          inset 0px 2px 4px rgba(0, 0, 0, 0.05)
        `,
                transform: "translateY(3px)",
              },
              "&:disabled": {
                color: "#86efac",
                borderColor: "#e5e7eb !important",
                boxShadow: "none",
                transform: "none",
                opacity: 0.6,
              },
            }}
          >
            {editingId ? "Guardar cambios" : "Enviar Documento"}
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
