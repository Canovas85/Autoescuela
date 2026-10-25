import { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  Paper,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

import { tarifasConceptoService } from "../../services/tarifasConceptoService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { StatusChip } from "../../components/common/StatusChip";
import { exportTarifasConceptoExcel } from "../../utils/exportTarifasConceptoExcel";
import { exportTarifasConceptoPdf } from "../../utils/exportTarifasConceptoPdf";
import { exportTarifasConceptoTemplateExcel } from "../../utils/exportTarifasConceptoTemplateExcel";
import {
  findMissingColumns,
  parseBooleanCell,
  readExcelRows,
} from "../../utils/excelImportUtils";

const PERMISOS = ["A", "A1", "A2", "B", "C", "D", "E"];
const TIPOS = ["FIJO", "VARIABLE", "POR_CLASE", "POR_EXAMEN"];

const emptyForm = {
  permisos: ["B"],
  concepto: "",
  precio: "",
  tipo: "FIJO",
  descripcion: "",
  activa: true,
};

export default function TarifasConcepto() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [permisoFiltro, setPermisoFiltro] = useState("all");
  const [tipoFiltro, setTipoFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("all");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    tarifaId: null,
    title: "",
    message: "",
  });
  const [importingExcel, setImportingExcel] = useState(false);
  const importInputRef = useRef(null);

  const loadTarifas = async () => {
    try {
      const data = await tarifasConceptoService.getAll({
        permiso: permisoFiltro === "all" ? undefined : permisoFiltro,
        tipo: tipoFiltro === "all" ? undefined : tipoFiltro,
        activa:
          estadoFiltro === "all"
            ? undefined
            : estadoFiltro === "activos"
              ? true
              : false,
      });

      setRows(data);
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "No se pudieron cargar los precios por permiso",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTarifas();
  }, [permisoFiltro, tipoFiltro, estadoFiltro]);

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
      permisos: [row.permiso || "B"],
      concepto: row.concepto || "",
      precio: row.precio ?? "",
      tipo: row.tipo || "FIJO",
      descripcion: row.descripcion || "",
      activa: Boolean(row.activa),
    });
    setOpen(true);
  };

  const buildConfirm = ({ action, tarifaId, title, message }) => {
    setConfirmDialog({ open: true, action, tarifaId, title, message });
  };

  const handleDelete = (row) => {
    buildConfirm({
      action: "delete",
      tarifaId: row.id,
      title: "Confirmar eliminación",
      message: `Vas a desactivar la tarifa "${row.concepto}" para el permiso ${row.permiso}. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    buildConfirm({
      action: row.activa ? "deactivate" : "activate",
      tarifaId: row.id,
      title: row.activa ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activa
        ? `Vas a desactivar la tarifa "${row.concepto}" del permiso ${row.permiso}.`
        : `Vas a reactivar la tarifa "${row.concepto}" del permiso ${row.permiso}.`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      tarifaId: null,
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
        await tarifasConceptoService.delete(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "deactivate") {
        await tarifasConceptoService.deactivate(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "activate") {
        await tarifasConceptoService.activate(confirmDialog.tarifaId);
      }

      await loadTarifas();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Tarifa desactivada correctamente"
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
      const permisos = Array.isArray(form.permisos) ? form.permisos : [];

      const payload = {
        ...form,
        permiso: editingId ? permisos[0] : permisos,
        precio: Number(form.precio),
      };

      delete payload.permisos;

      if (editingId) {
        await tarifasConceptoService.update(editingId, payload);
      } else {
        await tarifasConceptoService.create(payload);
      }

      await loadTarifas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Precio actualizado correctamente"
          : permisos.length > 1
            ? "Precios creados correctamente"
            : "Precio creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando precio",
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
        "PERMISO",
        "CONCEPTO",
        "PRECIO",
        "TIPO",
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
          const permiso = String(row.PERMISO || "")
            .trim()
            .toUpperCase();
          const concepto = String(row.CONCEPTO || "").trim();

          const payload = {
            permiso,
            concepto,
            precio: Number(row.PRECIO),
            tipo: String(row.TIPO || "")
              .trim()
              .toUpperCase(),
            descripcion: String(row.DESCRIPCION || "").trim(),
            activa: parseBooleanCell(row.ACTIVA, true),
          };

          const existente = filteredRows.find(
            (item) =>
              String(item?.permiso || "")
                .trim()
                .toUpperCase() === permiso &&
              String(item?.concepto || "")
                .trim()
                .toUpperCase() === concepto.toUpperCase(),
          );

          if (existente) {
            await tarifasConceptoService.update(existente.id, payload);
          } else {
            await tarifasConceptoService.create(payload);
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
      field: "permiso",
      headerName: "Permiso",
      flex: 1,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 2,
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      valueFormatter: (value) => `${value} €`,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 2,
      valueGetter: (value, row) => row.descripcion || "-",
    },
    {
      field: "activa",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => (
        <StatusChip label={params.value ? "Activo" : "Inactivo"} />
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

  const exportMenuOpen = Boolean(exportAnchorEl);

  const handleExportExcel = () => {
    exportTarifasConceptoExcel(filteredRows);
    setExportAnchorEl(null);
  };

  const handleExportPdf = () => {
    exportTarifasConceptoPdf(filteredRows);
    setExportAnchorEl(null);
  };

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
            Tarifas Concepto
          </Typography>
          <Typography color="text.secondary">
            Gestiona los precios de cada licencia.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
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
          Nuevo precio
        </Button>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            {/* Selector de Permiso original */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Permiso</InputLabel>
              <Select
                label="Permiso"
                value={permisoFiltro}
                onChange={(event) => setPermisoFiltro(event.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {PERMISOS.map((permiso) => (
                  <MenuItem key={permiso} value={permiso}>
                    {permiso}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selector de Tipo original */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={tipoFiltro}
                onChange={(event) => setTipoFiltro(event.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {TIPOS.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selector de Estado original */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={estadoFiltro}
                onChange={(event) => setEstadoFiltro(event.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="activos">Activos</MenuItem>
                <MenuItem value="inactivos">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={(event) => setExportAnchorEl(event.currentTarget)}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",

            // FUERZA EL BORDE: Define grosor, estilo y color explícitamente en todas las direcciones
            border: "1px solid",
            borderColor: "#ea580c !important",
            color: "#ea580c",
            backgroundColor: "transparent",

            // Sombra de capas adaptada para relieve naranja (borde inferior sólido + brillo ambiental)
            boxShadow: `
    0px 4px 0px #c2410c, 
    0px 8px 16px rgba(234, 88, 12, 0.15),
    inset 0px 1px 0px rgba(255, 255, 255, 0.1)
  `,

            // Transición suave para las animaciones físicas
            transition: "all 0.15s ease-in-out",

            // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
            "& .MuiButton-startIcon": {
              color: "inherit",
            },

            "&:hover": {
              // Pasa a un tono naranja más vivo con un fondo sutilmente iluminado
              color: "#f97316",
              borderColor: "#f97316 !important", // Fuerza el cambio de color de todos los bordes en el hover
              backgroundColor: "rgba(234, 88, 12, 0.04)",
              boxShadow: `
      0px 4px 0px #c2410c, 
      0px 12px 20px rgba(249, 115, 22, 0.25),
      inset 0px 1px 0px rgba(255, 255, 255, 0.2)
    `,
              transform: "translateY(-1px)", // Se eleva ligeramente
            },

            "&:active": {
              // Mecanismo físico de hundimiento real al hacer clic
              borderColor: "#ea580c !important",
              boxShadow: `
      0px 1px 0px #c2410c, 
      0px 2px 4px rgba(234, 88, 12, 0.2),
      inset 0px 2px 4px rgba(0, 0, 0, 0.05)
    `,
              transform: "translateY(3px)", // Se desplaza hacia abajo el grosor exacto del relieve
            },
          }}
        >
          Exportar
        </Button>

        <Button
          variant="outlined"
          onClick={exportTarifasConceptoTemplateExcel}
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
          variant="outlined"
          component="label"
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

        <Menu
          anchorEl={exportAnchorEl}
          open={exportMenuOpen}
          onClose={() => setExportAnchorEl(null)}
        >
          <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
          <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
        </Menu>
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
            sorting: { sortModel: [{ field: "permiso", sort: "asc" }] },
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
          {editingId ? "Editar precio" : "Nuevo precio"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Permiso</InputLabel>
            <Select
              multiple={!editingId}
              label="Permiso"
              value={form.permisos}
              renderValue={(selected) =>
                Array.isArray(selected) ? selected.join(", ") : ""
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  permisos:
                    typeof event.target.value === "string"
                      ? event.target.value.split(",")
                      : event.target.value,
                }))
              }
            >
              {PERMISOS.map((permiso) => (
                <MenuItem key={permiso} value={permiso}>
                  {!editingId ? (
                    <>
                      <Checkbox checked={form.permisos.includes(permiso)} />
                      <ListItemText primary={permiso} />
                    </>
                  ) : (
                    permiso
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Concepto"
            fullWidth
            value={form.concepto}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, concepto: event.target.value }))
            }
          />

          <TextField
            label="Precio"
            type="number"
            fullWidth
            value={form.precio}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, precio: event.target.value }))
            }
          />

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

          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={2}
            value={form.descripcion}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, descripcion: event.target.value }))
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
              <MenuItem value="true">Activo</MenuItem>
              <MenuItem value="false">Inactivo</MenuItem>
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
