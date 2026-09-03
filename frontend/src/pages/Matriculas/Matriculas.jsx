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

import { matriculasService } from "../../services/matriculasService";

const emptyForm = {
  nombre: "",
  descripcion: "",
  clasesIncluidas: 10,
  validezDias: 90,
  activo: true,
};

export default function Matriculas() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    matriculaId: null,
    nombreMatricula: "",
    title: "",
    message: "",
  });

  const loadMatriculas = async () => {
    const data = await matriculasService.getAll();
    setRows(data);
  };

  useEffect(() => {
    loadMatriculas();
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
      nombre: row.nombre || "",
      descripcion: row.descripcion || "",
      clasesIncluidas: row.clasesIncluidas ?? 10,
      validezDias: row.validezDias ?? 90,
      activo: Boolean(row.activo),
    });
    setOpen(true);
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      matriculaId: row.id,
      nombreMatricula: row.nombre,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente la matrícula "${row.nombre}" de Autoescuela Eguzkilore. Toda la información asociada será eliminada de forma permanente. Esta acción no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activo ? "deactivate" : "activate",
      matriculaId: row.id,
      nombreMatricula: row.nombre,
      title: row.activo ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activo
        ? `Vas a desactivar la matrícula "${row.nombre}" en Autoescuela Eguzkilore. No podrá utilizarse hasta su reactivación. ¿Deseas continuar?`
        : `Vas a reactivar la matrícula "${row.nombre}" en Autoescuela Eguzkilore. Volverá a estar disponible de inmediato. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      matriculaId: null,
      nombreMatricula: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.matriculaId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await matriculasService.delete(confirmDialog.matriculaId);
      }

      if (confirmDialog.action === "deactivate") {
        await matriculasService.deactivate(confirmDialog.matriculaId);
      }

      if (confirmDialog.action === "activate") {
        await matriculasService.activate(confirmDialog.matriculaId);
      }

      await loadMatriculas();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Matrícula eliminada correctamente"
            : confirmDialog.action === "deactivate"
              ? "Matrícula desactivada correctamente"
              : "Matrícula activada correctamente",
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
        clasesIncluidas: Number(form.clasesIncluidas),
        validezDias: Number(form.validezDias),
      };

      if (editingId) {
        await matriculasService.update(editingId, payload);
      } else {
        await matriculasService.create(payload);
      }

      await loadMatriculas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Matrícula actualizada correctamente"
          : "Matrícula creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando matrícula",
        severity: "error",
      });
    }
  };

  const handlePagar = async (row) => {
    try {
      await matriculasService.pagar(row.id);

      await loadMatriculas();

      setNotification({
        open: true,
        message: "Matrícula marcada como pagada",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error actualizando matrícula",
        severity: "error",
      });
    }
  };

  const handleAnular = async (row) => {
    try {
      await matriculasService.anular(row.id);

      await loadMatriculas();

      setNotification({
        open: true,
        message: "Matrícula anulada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error anulando matrícula",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.5,

      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "Sin alumno",
    },

    {
      field: "licencia",
      headerName: "Licencia",
      flex: 0.7,
    },

    {
      field: "precioBase",
      headerName: "Precio Base",
      flex: 0.8,

      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "precioFinal",
      headerName: "Precio Final",
      flex: 0.8,

      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "estado",
      headerName: "Estado",
      flex: 0.8,

      renderCell: (params) => (
        <Chip
          label={params.row.estado}
          color={
            params.row.estado === "PAGADA"
              ? "success"
              : params.row.estado === "ANULADA"
                ? "error"
                : "warning"
          }
          size="small"
        />
      ),
    },

    {
      field: "fechaPago",
      headerName: "Fecha Pago",
      flex: 1,

      valueGetter: (_, row) =>
        row.fechaPago
          ? new Date(row.fechaPago).toLocaleDateString("es-ES")
          : "-",
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
            gap: 1,
          }}
        >
          {params.row.estado === "PENDIENTE" && (
            <>
              <Button
                size="small"
                color="success"
                variant="contained"
                onClick={() => handlePagar(params.row)}
              >
                Pagar
              </Button>

              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleAnular(params.row)}
              >
                Anular
              </Button>
            </>
          )}
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
            Matrículas
          </Typography>

          <Typography color="text.secondary">
            Gestión administrativa de matrículas y estado de pago.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Box>

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
