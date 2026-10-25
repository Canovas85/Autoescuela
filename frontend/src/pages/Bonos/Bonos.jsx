import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  Paper,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Tooltip from "@mui/material/Tooltip";
import { jwtDecode } from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import { bonosService } from "../../services/bonosService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { StatusChip } from "../../components/common/StatusChip";
import { exportBonosTemplateExcel } from "../../utils/exportBonosTemplateExcel";
import {
  findMissingColumns,
  parseBooleanCell,
  readExcelRows,
} from "../../utils/excelImportUtils";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const emptyForm = {
  nombre: "",
  descripcion: "",
  licencia: "B",
  clasesIncluidas: 10,
  precio: "",
  validezDias: 90,
  activo: true,
};

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} EUR`;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("es-ES") : "-";
}

const getOwnedBonoStyle = (estado) => {
  if (estado === "AGOTADO") {
    return {
      background: "linear-gradient(145deg, #f3f4f6 0%, #e5e7eb 100%)",
      borderColor: "#d1d5db",
    };
  }

  if (estado === "CADUCADO") {
    return {
      background: "linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)",
      borderColor: "#fecaca",
    };
  }

  return {
    background: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    borderColor: "#93c5fd",
  };
};

const getOwnedBonoChip = (item) => {
  const compradas = Number(item.clasesCompradas || 0);
  const consumidas = Number(item.clasesConsumidas || 0);
  const disponibles = Math.max(compradas - consumidas, 0);

  if (disponibles <= 0 || item.estado === "AGOTADO") {
    return { label: "GASTADO", color: "default" };
  }

  return { label: "COMPRADO", color: "success" };
};

function StudentBonosView({ rows, loading, onBuy }) {
  if (loading) {
    return <Typography>Cargando bonos...</Typography>;
  }

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay bonos activos disponibles en este momento.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {rows.map((row) => (
        <Grid item xs={12} md={6} lg={4} key={row.id}>
          <Card
            sx={{
              height: "100%",
              minHeight: 320,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.14)",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: "#0f4c81",
                  lineHeight: 1.1,
                }}
              >
                {row.nombre}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {row.clasesIncluidas} clases
                </Typography>
                <Typography sx={{ fontWeight: 700 }} color="text.secondary">
                  Validez: {row.validezDias} dias
                </Typography>
              </Box>

              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                {row.descripcion || "Bono de clases practicas"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {formatPrice(row.precio)}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => onBuy(row)}
                >
                  Comprar bono
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Bonos() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [myBonos, setMyBonos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [licenciaFiltro, setLicenciaFiltro] = useState("all");
  const [importingExcel, setImportingExcel] = useState(false);
  const importInputRef = useRef(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    bonoId: null,
    nombreBono: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    try {
      const decoded = jwtDecode(token);
      setRole(decoded?.rol ?? "ALUMNO");
    } catch {
      setRole("ALUMNO");
    }
  }, []);

  const loadBonos = async () => {
    if (!role) {
      return;
    }

    try {
      setLoading(true);
      const data =
        role === "ADMIN" || role === "ADMINISTRATIVO"
          ? await bonosService.getAll({
              licencia: licenciaFiltro === "all" ? undefined : licenciaFiltro,
            })
          : await bonosService.getAvailable();
      setRows(data);

      if (role !== "ADMIN" && role !== "ADMINISTRATIVO") {
        const bonosAlumno = await bonosService.getMine();
        setMyBonos(Array.isArray(bonosAlumno) ? bonosAlumno : []);
      }
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          role === "ADMIN" || role === "ADMINISTRATIVO"
            ? "No se pudieron cargar los bonos"
            : "No se pudieron cargar los bonos disponibles",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBonos();
  }, [role, licenciaFiltro]);

  const filteredRows = useMemo(() => rows, [rows]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
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
        "NOMBRE",
        "CLASES_INCLUIDAS",
        "PRECIO",
        "VALIDEZ_DIAS",
      ]);

      if (missingColumns.length > 0) {
        throw new Error(
          `Faltan columnas obligatorias: ${missingColumns.join(", ")}.`,
        );
      }

      const errores = [];
      let procesados = 0;

      for (let idx = 0; idx < rowsExcel.length; idx += 1) {
        const row = rowsExcel[idx];
        const rowIndex = idx + 2;

        try {
          const payload = {
            nombre: String(row.NOMBRE || "").trim(),
            descripcion: String(row.DESCRIPCION || "").trim(),
            licencia: String(row.LICENCIA || "")
              .trim()
              .toUpperCase(),
            clasesIncluidas: Number(row.CLASES_INCLUIDAS),
            precio: Number(row.PRECIO),
            validezDias: Number(row.VALIDEZ_DIAS),
            activo: parseBooleanCell(row.ACTIVO, true),
          };

          const existente = filteredRows.find(
            (item) =>
              String(item?.nombre || "")
                .trim()
                .toUpperCase() === payload.nombre.toUpperCase() &&
              Number(item?.clasesIncluidas || 0) === payload.clasesIncluidas,
          );

          if (existente) {
            await bonosService.update(existente.id, payload);
          } else {
            await bonosService.create(payload);
          }

          procesados += 1;
        } catch (error) {
          errores.push(`Fila ${rowIndex}: ${error.message}`);
        }
      }

      await loadBonos();

      setNotification({
        open: true,
        severity: errores.length > 0 ? "warning" : "success",
        message:
          errores.length > 0
            ? `Importación parcial: ${procesados} procesados, ${errores.length} con error. Primer error: ${errores[0]}`
            : `Importación completada: ${procesados} bono(s) procesado(s).`,
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

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      nombre: row.nombre || "",
      descripcion: row.descripcion || "",
      licencia: row.licencia || "B",
      clasesIncluidas: row.clasesIncluidas ?? 10,
      precio: row.precio ?? "",
      validezDias: row.validezDias ?? 90,
      activo: Boolean(row.activo),
    });
    setOpen(true);
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      bonoId: row.id,
      nombreBono: row.nombre,
      title: "Confirmar eliminacion",
      message: `Vas a eliminar definitivamente el bono "${row.nombre}" de Autoescuela Eguzkilore. Toda la informacion asociada sera eliminada de forma permanente. Esta accion no podra deshacerse. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activo ? "deactivate" : "activate",
      bonoId: row.id,
      nombreBono: row.nombre,
      title: row.activo ? "Confirmar desactivacion" : "Confirmar activacion",
      message: row.activo
        ? `Vas a desactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. No podra utilizarse hasta su reactivacion. Deseas continuar?`
        : `Vas a reactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. Volvera a estar disponible de inmediato. Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      bonoId: null,
      nombreBono: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.bonoId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await bonosService.delete(confirmDialog.bonoId);
      }

      if (confirmDialog.action === "deactivate") {
        await bonosService.deactivate(confirmDialog.bonoId);
      }

      if (confirmDialog.action === "activate") {
        await bonosService.activate(confirmDialog.bonoId);
      }

      await loadBonos();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Bono eliminado correctamente"
            : confirmDialog.action === "deactivate"
              ? "Bono desactivado correctamente"
              : "Bono activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: error.response?.data?.message || "Error procesando la accion",
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
        precio: Number(form.precio),
        validezDias: Number(form.validezDias),
      };

      if (editingId) {
        await bonosService.update(editingId, payload);
      } else {
        await bonosService.create(payload);
      }

      await loadBonos();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Bono actualizado correctamente"
          : "Bono creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando bono",
        severity: "error",
      });
    }
  };

  const handleBuy = async (row) => {
    try {
      const result = await bonosService.buy(row.id);
      const pagoId = result?.pago?.id;

      if (!pagoId) {
        throw new Error("No se pudo generar el pago pendiente del bono");
      }

      navigate(`/pago-matricula?pagoId=${pagoId}`);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "No se pudo iniciar la compra del bono",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 0.6,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    { field: "nombre", headerName: "Nombre", flex: 1.1 },

    { field: "clasesIncluidas", headerName: "Clases", flex: 0.6 },
    {
      field: "precio",
      headerName: "Precio",
      flex: 0.7,
      valueFormatter: (value) => formatPrice(value),
    },
    { field: "validezDias", headerName: "Validez (dias)", flex: 0.8 },
    /*{
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1.4,
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
            {params.row.descripcion || "Sin descripcion"}
          </Typography>
        </Box>
      ),
    },*/
    {
      field: "activo",
      headerName: "Estado",
      flex: 0.7,
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
          }}
        >
          <Tooltip title="Editar" arrow>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activo ? "Desactivar" : "Activar"} arrow>
            <IconButton
              color={params.row.activo ? "warning" : "success"}
              onClick={() => handleToggleActivo(params.row)}
            >
              {params.row.activo ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <IconButton color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (!role) {
    return <Typography>Cargando bonos...</Typography>;
  }

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
            {role === "ADMIN" || role === "ADMINISTRATIVO"
              ? "Bonos"
              : "Compra de Bonos"}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {role === "ADMIN" || role === "ADMINISTRATIVO"
              ? "Gestiona los bonos disponibles, asignaciones de alumnos y el historial de créditos de la autoescuela."
              : "Adquiere paquetes de clases y bonos de prácticas directamente para tu formación."}
          </Typography>
        </Box>
      </Box>
      <Typography color="text.secondary"></Typography>
      <Box sx={{ mb: 2 }}>
        {role === "ADMIN" || role === "ADMINISTRATIVO" ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
              Nuevo bono
            </Button>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                {/* Selector de Licencia original */}
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Licencia</InputLabel>
                  <Select
                    label="Licencia"
                    value={licenciaFiltro}
                    onChange={(event) => setLicenciaFiltro(event.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {LICENCIAS.map((licencia) => (
                      <MenuItem key={licencia} value={licencia}>
                        {licencia}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Paper>

            <Button
              variant="outlined"
              onClick={exportBonosTemplateExcel}
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
          </Box>
        ) : null}
      </Box>

      {role === "ADMIN" || role === "ADMINISTRATIVO" ? (
        <Box sx={{ height: 700 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "nombre", sort: "asc" }] },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          <StudentBonosView rows={rows} loading={loading} onBuy={handleBuy} />

          {myBonos.length > 0 ? (
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Bono(s) que ya tienes
              </Typography>
              <Grid container spacing={1.5}>
                {myBonos.map((item) => {
                  const disponibles = Math.max(
                    Number(item.clasesCompradas || 0) -
                      Number(item.clasesConsumidas || 0),
                    0,
                  );
                  const bonoStyle = getOwnedBonoStyle(item.estado);
                  const chip = getOwnedBonoChip(item);

                  return (
                    <Grid item xs={12} md={6} key={`my-bono-${item.id}`}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          borderColor: bonoStyle.borderColor,
                          background: bonoStyle.background,
                        }}
                      >
                        <CardContent sx={{ display: "grid", gap: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Typography fontWeight={800}>
                              {item.nombre || "Bono"}
                            </Typography>
                            <Chip
                              size="small"
                              label={chip.label}
                              color={chip.color}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {item.descripcion || "Bono de clases practicas"}
                          </Typography>

                          <Typography variant="body2" fontWeight={700}>
                            {item.clasesCompradas} compradas |{" "}
                            {item.clasesConsumidas} consumidas | {disponibles}{" "}
                            disponibles
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Válido hasta: {formatDate(item.fechaValidezHasta)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : null}
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingId ? "Editar bono" : "Nuevo bono"}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <TextField
            sx={{ mt: 2 }}
            label="Nombre"
            fullWidth
            value={form.nombre}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, nombre: event.target.value }))
            }
          />
          <TextField
            label="Descripcion"
            fullWidth
            multiline
            minRows={3}
            value={form.descripcion}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, descripcion: event.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Licencia</InputLabel>
            <Select
              label="Licencia"
              value={form.licencia}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, licencia: event.target.value }))
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
            label="Clases incluidas"
            type="number"
            fullWidth
            value={form.clasesIncluidas}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                clasesIncluidas: event.target.value,
              }))
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
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            label="Validez en dias"
            type="number"
            fullWidth
            value={form.validezDias}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, validezDias: event.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={form.activo ? "true" : "false"}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activo: event.target.value === "true",
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
