import { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { tarifasMatriculaService } from "../../services/tarifasMatriculaService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { StatusChip } from "../../components/common/StatusChip";
import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente
import { exportTarifasMatriculaTemplateExcel } from "../../utils/exportTarifasMatriculaTemplateExcel";
import {
  findMissingColumns,
  parseBooleanCell,
  readExcelRows,
} from "../../utils/excelImportUtils";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const emptyForm = {
  licencia: "B",
  precio: "",
  activa: true,
};

export default function TarifasMatricula() {
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
    tarifaId: null,
    licenciaTarifa: "",
    title: "",
    message: "",
  });
  const [importingExcel, setImportingExcel] = useState(false);
  const importInputRef = useRef(null);

  const loadTarifas = async () => {
    try {
      const data = await tarifasMatriculaService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar las tarifas de matricula",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTarifas();
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
      licencia: row.licencia || "B",
      precio: row.precio ?? "",
      activa: Boolean(row.activa),
    });
    setOpen(true);
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      tarifaId: row.id,
      licenciaTarifa: row.licencia,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente la tarifa de la licencia "${row.licencia}" de Autoescuela Eguzkilore. Esta accion no podra deshacerse. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activa ? "deactivate" : "activate",
      tarifaId: row.id,
      licenciaTarifa: row.licencia,
      title: row.activa ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activa
        ? `Vas a desactivar la tarifa de la licencia "${row.licencia}" en Autoescuela Eguzkilore. No podra utilizarse hasta su reactivacion. Deseas continuar?`
        : `Vas a reactivar la tarifa de la licencia "${row.licencia}" en Autoescuela Eguzkilore. Volvera a estar disponible de inmediato. Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      tarifaId: null,
      licenciaTarifa: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.tarifaId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await tarifasMatriculaService.delete(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "deactivate") {
        await tarifasMatriculaService.deactivate(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "activate") {
        await tarifasMatriculaService.activate(confirmDialog.tarifaId);
      }

      await loadTarifas();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Tarifa eliminada correctamente"
            : confirmDialog.action === "deactivate"
              ? "Tarifa desactivada correctamente"
              : "Tarifa activada correctamente",
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
        precio: Number(form.precio),
      };

      if (editingId) {
        await tarifasMatriculaService.update(editingId, payload);
      } else {
        await tarifasMatriculaService.create(payload);
      }

      await loadTarifas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Tarifa actualizada correctamente"
          : "Tarifa creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando tarifa",
        severity: "error",
      });
    }
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setImportingExcel(true);

      const rowsExcel = await readExcelRows(file);
      const missingColumns = findMissingColumns(rowsExcel[0] || {}, [
        "LICENCIA",
        "PRECIO",
      ]);

      if (missingColumns.length > 0) {
        throw new Error(
          `Faltan columnas obligatorias: ${missingColumns.join(", ")}.`,
        );
      }

      const errores = [];
      let procesadas = 0;

      for (let idx = 0; idx < rowsExcel.length; idx += 1) {
        const row = rowsExcel[idx];
        const rowIndex = idx + 2;

        try {
          const licencia = String(row.LICENCIA || "")
            .trim()
            .toUpperCase();

          const payload = {
            licencia,
            precio: Number(row.PRECIO),
            activa: parseBooleanCell(row.ACTIVA, true),
          };

          const existente = filteredRows.find(
            (item) =>
              String(item?.licencia || "")
                .trim()
                .toUpperCase() === licencia,
          );

          if (existente) {
            await tarifasMatriculaService.update(existente.id, payload);
          } else {
            await tarifasMatriculaService.create(payload);
          }

          procesadas += 1;
        } catch (error) {
          errores.push(`Fila ${rowIndex}: ${error.message}`);
        }
      }

      await loadTarifas();

      setNotification({
        open: true,
        severity: errores.length > 0 ? "warning" : "success",
        message:
          errores.length > 0
            ? `Importación parcial: ${procesadas} procesadas, ${errores.length} con error. Primer error: ${errores[0]}`
            : `Importación completada: ${procesadas} tarifa(s) procesada(s).`,
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error?.message || "No se pudo importar el Excel.",
      });
    } finally {
      setImportingExcel(false);

      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const columns = [
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 1,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },

    {
      field: "precio",
      headerName: "Precio",
      flex: 1,

      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "activa",
      headerName: "Estado",
      flex: 1,

      renderCell: (params) => (
        <StatusChip label={params.value ? "Activa" : "Inactiva"} />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Tooltip title="Editar" arrow>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activa ? "Desactivar" : "Activar"} arrow>
            <IconButton
              onClick={() => handleToggleActivo(params.row)}
              color={params.row.activa ? "warning" : "success"}
            >
              {params.row.activa ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <IconButton onClick={() => handleDelete(params.row)} color="error">
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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Tarifas de Matrícula
          </Typography>
          <Typography color="text.secondary">
            Gestiona los precios base aplicados al alta de licencias y
            matriculas.
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",

              // FUERZA EL BORDE: Define grosor, estilo y color explícitamente en todas las direcciones
              border: "1px solid",
              borderColor: "#1e3a8a !important",
              color: "#1e3a8a",
              backgroundColor: "transparent",

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
                borderColor: "#2563eb !important", // Fuerza el cambio de color de todos los bordes en el hover
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
            Nueva tarifa
          </Button>
          <Button
            variant="outlined"
            onClick={exportTarifasMatriculaTemplateExcel}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",

              // FUERZA EL BORDE: Contorno completo en color morado vibrante
              border: "1px solid",
              borderColor: "#6d28d9 !important", // Morado principal
              color: "#6d28d9",
              backgroundColor: "transparent",

              // Sombra de capas adaptada para relieve morado (borde inferior sólido + brillo ambiental)
              boxShadow: `
    0px 4px 0px #5b21b6, 
    0px 8px 16px rgba(109, 40, 217, 0.15),
    inset 0px 1px 0px rgba(255, 255, 255, 0.1)
  `,

              // Transición suave para las animaciones físicas
              transition: "all 0.15s ease-in-out",

              // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              "&:hover": {
                // Pasa a un tono morado más vivo con un fondo sutilmente iluminado
                color: "#8b5cf6",
                borderColor: "#8b5cf6 !important",
                backgroundColor: "rgba(109, 40, 217, 0.04)",
                boxShadow: `
      0px 4px 0px #5b21b6, 
      0px 12px 20px rgba(139, 92, 246, 0.25),
      inset 0px 1px 0px rgba(255, 255, 255, 0.2)
    `,
                transform: "translateY(-1px)", // Se eleva ligeramente
              },

              "&:active": {
                // Mecanismo físico de hundimiento real al hacer clic
                borderColor: "#6d28d9 !important",
                boxShadow: `
      0px 1px 0px #5b21b6, 
      0px 2px 4px rgba(109, 40, 217, 0.2),
      inset 0px 2px 4px rgba(0, 0, 0, 0.05)
    `,
                transform: "translateY(3px)", // Se desplaza hacia abajo el grosor exacto del relieve
              },
            }}
          >
            Descargar plantilla
          </Button>

          <Button
            variant="outlined" // Cambiado a outlined para mantener la coherencia del estilo transparente con bordes y letras de color
            startIcon={<CloudUploadIcon />}
            disabled={importingExcel}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: "pointer",

              // Texto, borde e icono base en color verde
              color: "#16a34a", // Tailwind green-600
              borderColor: "#16a34a",
              backgroundColor: "transparent",

              // Sombra de capas adaptada para relieve verde (borde inferior sólido + brillo ambiental)
              boxShadow: `
              0px 4px 0px #15803d, 
              0px 8px 16px rgba(22, 163, 74, 0.15),
              inset 0px 1px 0px rgba(255, 255, 255, 0.1)
              `,

              // Transición suave para las animaciones físicas
              transition: "all 0.15s ease-in-out",

              // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              "&:hover": {
                // Pasa a un tono verde más vivo con un fondo sutilmente iluminado
                color: "#15803d", // Tailwind green-700
                borderColor: "#15803d",
                backgroundColor: "rgba(22, 163, 74, 0.04)",
                boxShadow: `
                0px 4px 0px #15803d, 
                0px 12px 20px rgba(21, 128, 61, 0.25),
                inset 0px 1px 0px rgba(255, 255, 255, 0.2)
                `,
                transform: "translateY(-1px)", // Se eleva ligeramente
              },

              "&:active": {
                // Mecanismo físico de hundimiento real al hacer clic
                boxShadow: `
                0px 1px 0px #15803d, 
                0px 2px 4px rgba(22, 163, 74, 0.2),
                inset 0px 2px 4px rgba(0, 0, 0, 0.05)
                `,
                transform: "translateY(3px)", // Se desplaza hacia abajo el grosor exacto del relieve
              },

              // Estilos cuando el botón está deshabilitado (importingExcel === true)
              "&.Mui-disabled": {
                boxShadow: "none",
                transform: "none",
                color: "#9ca3af",
                borderColor: "#d1d5db",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            {importingExcel ? "Importando..." : "Importar Excel"}
            <input
              ref={importInputRef}
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
            />
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "licencia", sort: "asc" }] },
          }}
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar tarifa" : "Nueva tarifa"}
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 1,
            display: "grid",
            gap: 2,
          }}
        >
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Licencia</InputLabel>

            <Select
              label="Licencia"
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
            label="Precio"
            type="number"
            fullWidth
            value={form.precio}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                precio: event.target.value,
              }))
            }
          />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>

            <Select
              label="Estado"
              value={form.activa ? "true" : "false"}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activa: event.target.value === "true",
                }))
              }
            >
              <MenuItem value="true">Activa</MenuItem>

              <MenuItem value="false">Inactiva</MenuItem>
            </Select>
          </FormControl>
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
