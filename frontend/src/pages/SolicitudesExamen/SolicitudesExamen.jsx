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
  IconButton,
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

import { solicitudesExamenService } from "../../services/solicitudesExamenService";
import { alumnosService } from "../../services/alumnosService";

const TIPOS = ["TEORICO", "PRACTICO"];
const ESTADOS = [
  "PENDIENTE",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "CANCELADO",
];

const emptyForm = {
  alumnoId: "",
  tipo: "TEORICO",
  estado: "PENDIENTE",
  fechaSolicitud: new Date().toISOString().slice(0, 10),
  fechaProgramada: "",
  observaciones: "",
};

const formatDate = (value) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function SolicitudesExamen() {
  const [rows, setRows] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    solicitudId: null,
    alumnoNombre: "",
    title: "",
    message: "",
  });

  const loadData = async () => {
    try {
      const [solicitudes, alumnosData] = await Promise.all([
        solicitudesExamenService.getAll(),
        alumnosService.getAll(),
      ]);

      setRows(solicitudes);
      setAlumnos(alumnosData);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar las solicitudes de examen",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => rows, [rows]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      alumnoId: row.alumnoId || row.alumno?.id || "",
      tipo: row.tipo || "TEORICO",
      estado: row.estado || "PENDIENTE",
      fechaSolicitud: row.fechaSolicitud
        ? new Date(row.fechaSolicitud).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      fechaProgramada: row.fechaProgramada
        ? new Date(row.fechaProgramada).toISOString().slice(0, 10)
        : "",
      observaciones: row.observaciones || "",
    });
    setOpen(true);
  };

  const handleDelete = (row) => {
    const nombreAlumno = row.alumno?.usuario?.nombre || "este alumno";

    setConfirmDialog({
      open: true,
      action: "delete",
      solicitudId: row.id,
      alumnoNombre: nombreAlumno,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente la solicitud de examen de ${nombreAlumno}. Esta acción eliminará toda la información asociada a la solicitud y no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      solicitudId: null,
      alumnoNombre: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    try {
      await solicitudesExamenService.delete(confirmDialog.solicitudId);

      await loadData();

      setNotification({
        open: true,
        message: "Solicitud eliminada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: error.response?.data?.message || "Error eliminando solicitud",
        severity: "error",
      });
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSave = async () => {
    try {
      const alumnoSeleccionado = alumnos.find(
        (alumno) => alumno.id === form.alumnoId,
      );

      const payload = {
        ...form,
        licenciaObjetivo: alumnoSeleccionado?.tipoLicenciaObjetivo || "B",
        fechaProgramada: form.fechaProgramada || null,
      };

      if (editingId) {
        await solicitudesExamenService.update(editingId, payload);
      } else {
        await solicitudesExamenService.create(payload);
      }

      await loadData();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Solicitud actualizada correctamente"
          : "Solicitud creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando solicitud",
        severity: "error",
      });
    }
  };

  const handleOpenDetail = (row) => {
    setSelectedRequest(row);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedRequest(null);
  };

  const columns = [
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.2,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "Sin alumno",
    },
    { field: "tipo", headerName: "Tipo", flex: 0.7 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => <Chip label={params.row.estado} size="small" />,
    },
    {
      field: "fechaSolicitud",
      headerName: "Solicitud",
      flex: 0.8,
      valueGetter: (_, row) => formatDate(row.fechaSolicitud),
    },
    {
      field: "fechaProgramada",
      headerName: "Programada",
      flex: 0.8,
      valueGetter: (_, row) => formatDate(row.fechaProgramada),
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1.3,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="body2" noWrap>
            {params.row.observaciones || "Sin observaciones"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
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
          <Typography variant="h4" fontWeight="bold">
            Solicitudes de examen
          </Typography>
          <Typography color="text.secondary">
            Gestión administrativa de solicitudes teóricas y prácticas.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",
            mt: 1.5,
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
          Nueva solicitud
        </Button>
      </Box>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          onRowClick={(params) => handleOpenDetail(params.row)}
        />
      </Box>

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de solicitud de examen</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1, pt: 1 }}>
          <Typography>
            <strong>Alumno:</strong>{" "}
            {selectedRequest?.alumno?.usuario?.nombre || "-"}
          </Typography>
          <Typography>
            <strong>Tipo:</strong> {selectedRequest?.tipo || "-"}
          </Typography>
          <Typography>
            <strong>Estado:</strong> {selectedRequest?.estado || "-"}
          </Typography>
          <Typography>
            <strong>Fecha solicitud:</strong>{" "}
            {formatDate(selectedRequest?.fechaSolicitud)}
          </Typography>
          <Typography>
            <strong>Fecha programada:</strong>{" "}
            {formatDate(selectedRequest?.fechaProgramada)}
          </Typography>
          {selectedRequest?.tipo === "TEORICO" ? (
            <>
              <Typography>
                <strong>Errores:</strong>{" "}
                {selectedRequest?.erroresExamen ?? "-"}
              </Typography>
              <Typography>
                <strong>Aciertos:</strong>{" "}
                {selectedRequest?.aciertosExamen ?? "-"}
              </Typography>
            </>
          ) : (
            <>
              <Typography>
                <strong>Faltas leves:</strong>{" "}
                {selectedRequest?.faltasLeves ?? 0}
              </Typography>
              <Typography>
                <strong>Faltas deficientes:</strong>{" "}
                {selectedRequest?.faltasDeficientes ?? 0}
              </Typography>
              <Typography>
                <strong>Faltas eliminatorias:</strong>{" "}
                {selectedRequest?.faltasEliminatorias ?? 0}
              </Typography>
              <Typography>
                <strong>Motivo no apto:</strong>{" "}
                {selectedRequest?.motivoNoApto || "-"}
              </Typography>
            </>
          )}
          <Typography>
            <strong>Observaciones:</strong>{" "}
            {selectedRequest?.observaciones || "-"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar solicitud" : "Nueva solicitud"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Alumno</InputLabel>
            <Select
              label="Alumno"
              value={form.alumnoId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, alumnoId: event.target.value }))
              }
            >
              {alumnos.map((alumno) => (
                <MenuItem key={alumno.id} value={alumno.id}>
                  {alumno.usuario?.nombre || alumno.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipo: event.target.value }))
              }
            >
              {TIPOS.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={form.estado}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, estado: event.target.value }))
              }
            >
              {ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Fecha de solicitud"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.fechaSolicitud}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                fechaSolicitud: event.target.value,
              }))
            }
          />
          <TextField
            label="Fecha programada"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.fechaProgramada}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                fechaProgramada: event.target.value,
              }))
            }
            sx={{
              "& input::-webkit-datetime-edit": {
                color: form.fechaProgramada ? "inherit" : "transparent",
              },
            }}
          />
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            minRows={3}
            value={form.observaciones}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                observaciones: event.target.value,
              }))
            }
          />
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
            onClick={() => setOpen(false)}
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

          {/* Botón Confirmar (Guardar) - Verde Esmeralda */}
          <Button
            variant="outlined"
            onClick={handleSave}
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
            }}
          >
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
            onClick={closeConfirmDialog}
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

          {/* Botón Confirmar - Verde Esmeralda */}
          <Button
            variant="outlined"
            onClick={handleConfirmAction}
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
            }}
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
