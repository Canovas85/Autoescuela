import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControlLabel,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UndoIcon from "@mui/icons-material/Undo";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { vehiculosService } from "../../services/vehiculosService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { StatusChip } from "../../components/common/StatusChip";

import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";

import { exportVehiculosExcel } from "../../utils/exportVehiculosExcel";
import AddIcon from "@mui/icons-material/Add";
import { exportVehiculosPdf } from "../../utils/exportVehiculosPdf";
import { exportVehiculosTemplateExcel } from "../../utils/exportVehiculosTemplateExcel";
import {
  findMissingColumns,
  parseBooleanCell,
  parseDateCellToIso,
  readExcelRows,
} from "../../utils/excelImportUtils";

const PERMISOS = ["B", "A1", "A2", "A", "C", "D", "E"];
const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
const TIPOS_IMAGEN_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const formatDateLabel = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-ES");
};

const formDataVehiculo = (vehiculo, imagenFile, eliminarImagen) => {
  const data = new FormData();

  data.append("matricula", vehiculo.matricula?.trim().toUpperCase() || "");
  data.append("marca", vehiculo.marca?.trim() || "");
  data.append("modelo", vehiculo.modelo?.trim() || "");
  data.append("tipoPermiso", vehiculo.tipoPermiso || "");
  data.append("fechaUltimaItv", vehiculo.fechaUltimaItv || "");

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
  const [permisoFiltro, setPermisoFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [exportAnchor, setExportAnchor] = useState(null);
  const [importingExcel, setImportingExcel] = useState(false);
  const importInputRef = useRef(null);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    matricula: "",
    marca: "",
    modelo: "",
    tipoPermiso: "B",
    fechaUltimaItv: "",
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

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    vehiculoId: null,
    matricula: "",
    title: "",
    message: "",
  });

  const [deactivateModal, setDeactivateModal] = useState({
    open: false,
    loading: false,
    vehiculo: null,
    clasesAfectadas: [],
  });
  const [reasignacionesDeactivacion, setReasignacionesDeactivacion] = useState(
    {},
  );

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
    return rows.filter((row) => {
      const matchesPermiso =
        !permisoFiltro || permisoFiltro === "all"
          ? true
          : row.tipoPermiso === permisoFiltro;

      const isActive = row.activo !== false;
      const matchesEstado =
        estadoFiltro === "todos"
          ? true
          : estadoFiltro === "activos"
            ? isActive
            : !isActive;

      return matchesPermiso && matchesEstado;
    });
  }, [rows, permisoFiltro, estadoFiltro]);

  const resetForm = () => {
    setNuevoVehiculo({
      matricula: "",
      marca: "",
      modelo: "",
      tipoPermiso: "B",
      fechaUltimaItv: "",
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
      fechaUltimaItv: formatDateForInput(row.fechaUltimaItv),
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

  const handleDeactivate = async (row) => {
    try {
      const impacto = await vehiculosService.getDeactivationImpact(row.id);

      if (!impacto?.clasesAfectadas?.length) {
        setConfirmDialog({
          open: true,
          action: "deactivate",
          vehiculoId: row.id,
          matricula: row.matricula,
          title: "Confirmar desactivación",
          message: `Vas a desactivar el vehículo ${row.matricula} en la plataforma Autoescuela Eguzkilore. No podrá ser utilizado hasta su reactivación. ¿Deseas continuar?`,
        });
        return;
      }

      const valoresIniciales = {};
      impacto.clasesAfectadas.forEach((item) => {
        valoresIniciales[item.claseId] = {
          nuevoVehiculoId: "",
          kmActualesNuevoVehiculo: "",
          combustibleActualPctNuevoVehiculo: "",
          enCurso: Boolean(item.enCurso),
        };
      });

      setReasignacionesDeactivacion(valoresIniciales);
      setDeactivateModal({
        open: true,
        loading: false,
        vehiculo: impacto.vehiculo,
        clasesAfectadas: impacto.clasesAfectadas,
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar el impacto de desactivación del vehículo",
        severity: "error",
      });
    }
  };

  const closeDeactivateModal = () => {
    setDeactivateModal({
      open: false,
      loading: false,
      vehiculo: null,
      clasesAfectadas: [],
    });
    setReasignacionesDeactivacion({});
  };

  const handleConfirmDeactivateWithReassignment = async () => {
    if (!deactivateModal.vehiculo?.id) {
      return;
    }

    const reasignaciones = [];

    for (const clase of deactivateModal.clasesAfectadas) {
      const item = reasignacionesDeactivacion[clase.claseId] || {};

      if (!item.nuevoVehiculoId) {
        setNotification({
          open: true,
          message: "Debes reasignar todas las clases antes de desactivar",
          severity: "error",
        });
        return;
      }

      if (clase.enCurso) {
        const km = Number(item.kmActualesNuevoVehiculo);
        const combustible = Number(item.combustibleActualPctNuevoVehiculo);

        if (!Number.isInteger(km) || km < 0) {
          setNotification({
            open: true,
            message:
              "Debes informar un kilometraje válido para todas las clases en curso",
            severity: "error",
          });
          return;
        }

        if (
          !Number.isInteger(combustible) ||
          combustible < 0 ||
          combustible > 100
        ) {
          setNotification({
            open: true,
            message:
              "Debes informar un combustible válido (0-100) para todas las clases en curso",
            severity: "error",
          });
          return;
        }
      }

      reasignaciones.push({
        claseId: clase.claseId,
        nuevoVehiculoId: item.nuevoVehiculoId,
        kmActualesNuevoVehiculo: item.kmActualesNuevoVehiculo,
        combustibleActualPctNuevoVehiculo:
          item.combustibleActualPctNuevoVehiculo,
      });
    }

    try {
      setDeactivateModal((prev) => ({ ...prev, loading: true }));
      await vehiculosService.deactivateWithReassignment(
        deactivateModal.vehiculo.id,
        reasignaciones,
      );
      await loadVehiculos();
      closeDeactivateModal();
      setNotification({
        open: true,
        message:
          "Vehículo desactivado correctamente con reasignación de clases obligatoria",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo completar la desactivación con reasignación",
        severity: "error",
      });
    } finally {
      setDeactivateModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleActivate = async (row) => {
    setConfirmDialog({
      open: true,
      action: "activate",
      vehiculoId: row.id,
      matricula: row.matricula,
      title: "Confirmar activación",
      message: `Vas a reactivar el vehículo ${row.matricula} en la plataforma Autoescuela Eguzkilore. Volverá a estar disponible de inmediato. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      vehiculoId: null,
      matricula: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.vehiculoId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "deactivate") {
        await vehiculosService.deactivate(confirmDialog.vehiculoId);
      }

      if (confirmDialog.action === "activate") {
        await vehiculosService.activate(confirmDialog.vehiculoId);
      }

      await loadVehiculos();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Vehículo desactivado correctamente"
            : "Vehículo activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Error desactivando vehículo"
            : "Error activando vehículo",
        severity: "error",
      });
    } finally {
      closeConfirmDialog();
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

  const handlePayItv = async (row) => {
    try {
      const result = await vehiculosService.payItv(row.id);
      await loadVehiculos();
      setNotification({
        open: true,
        message: result?.message || "Pago de revisión ITV registrado",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo registrar el pago de revisión ITV",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "matricula", headerName: "Matrícula", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
    {
      field: "tipoPermiso",
      headerName: "Permiso",
      flex: 0.7,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    {
      field: "numeroClasesRealizadas",
      headerName: "Nº Clases",
      width: 120,
      valueGetter: (_, row) => Number(row.numeroClasesRealizadas || 0),
    },
    {
      field: "kmActuales",
      headerName: "KMs actuales",
      width: 140,
      valueGetter: (_, row) => row.kmActuales ?? 0,
    },
    {
      field: "fechaUltimaItv",
      headerName: "Fecha última ITV",
      width: 160,
      valueGetter: (_, row) => formatDateLabel(row.fechaUltimaItv),
    },
    {
      field: "itvPendiente",
      headerName: "Revisión ITV",
      width: 160,
      renderCell: (params) =>
        params.row.itvPendiente ? (
          <StatusChip label="Pendiente" />
        ) : (
          <StatusChip label="Vigente" />
        ),
    },
    {
      field: "combustibleActualPct",
      headerName: "Combustible",
      width: 170,
      renderCell: (params) => {
        const value = Number(params.row.combustibleActualPct ?? 0);

        return (
          <Stack sx={{ width: "100%", py: 1 }} spacing={0.4}>
            <Typography variant="caption" fontWeight={700}>
              {Math.max(0, Math.min(100, value))}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, value))}
              color={value < 20 ? "error" : value < 40 ? "warning" : "success"}
              sx={{ height: 7, borderRadius: 999 }}
            />
          </Stack>
        );
      },
    },

    {
      field: "activo",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => (
        <StatusChip
          label={(params.row.activo ?? true) ? "Activo" : "Inactivo"}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar" arrow>
            <IconButton
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activo ? "Desactivar" : "Activar"} arrow>
            {params.row.activo ? (
              <IconButton
                color="warning"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeactivate(params.row);
                }}
              >
                <ToggleOffIcon />
              </IconButton>
            ) : (
              <IconButton
                color="success"
                onClick={(event) => {
                  event.stopPropagation();
                  handleActivate(params.row);
                }}
              >
                <ToggleOnIcon />
              </IconButton>
            )}
          </Tooltip>

          {params.row.itvPendiente ? (
            <Tooltip title="Registrar pago revisión ITV" arrow>
              <IconButton
                color="info"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePayItv(params.row);
                }}
              >
                <FactCheckIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </>
      ),
    },
  ];

  const openExportMenu = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchor(null);
  };

  const handleExportExcel = () => {
    exportVehiculosExcel(filteredRows);

    closeExportMenu();
  };

  const handleExportPdf = () => {
    exportVehiculosPdf(filteredRows);

    closeExportMenu();
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
        "MATRICULA",
        "MARCA",
        "MODELO",
        "TIPO_PERMISO",
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
          const matricula = String(row.MATRICULA || "")
            .trim()
            .toUpperCase();
          const payload = {
            matricula,
            marca: String(row.MARCA || "").trim(),
            modelo: String(row.MODELO || "").trim(),
            tipoPermiso: String(row.TIPO_PERMISO || "")
              .trim()
              .toUpperCase(),
            fechaUltimaItv: parseDateCellToIso(row.FECHA_ULTIMA_ITV),
            activo: parseBooleanCell(row.ACTIVO, true),
          };

          const existente = rows.find(
            (item) =>
              String(item?.matricula || "")
                .trim()
                .toUpperCase() === matricula,
          );

          const formData = formDataVehiculo(payload, null, false);

          if (existente) {
            await vehiculosService.update(existente.id, formData);
          } else {
            await vehiculosService.create(formData);
          }

          procesados += 1;
        } catch (error) {
          errores.push(`Fila ${rowIndex}: ${error.message}`);
        }
      }

      await loadVehiculos();

      setNotification({
        open: true,
        severity: errores.length > 0 ? "warning" : "success",
        message:
          errores.length > 0
            ? `Importación parcial: ${procesados} procesados, ${errores.length} con error. Primer error: ${errores[0]}`
            : `Importación completada: ${procesados} vehículo(s) procesado(s).`,
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

  const readOnlyFieldSx = {
    "& .MuiInputBase-input": {
      cursor: "default",
      caretColor: "transparent",
      userSelect: "none",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "action.hover",
    },
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Vehículos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Administra la flota de vehículosde la Autoescuela Eguskilore, el estado
        de los automóviles, las revisiones periódicas de la ITV y el
        mantenimiento.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="outlined" // Cambiado a outlined para mantener la coherencia del estilo transparente con bordes y letras de color
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null);
            resetForm();
            setOpen(true);
          }}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",
            mt: 1.5,

            // Texto y bordes en color azul oscuro profundo
            color: "#1e3a8a",
            borderColor: "#1e3a8a",
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
              borderColor: "#2563eb",
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
              boxShadow: `
        0px 1px 0px #172554, 
        0px 2px 4px rgba(30, 58, 138, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
              transform: "translateY(3px)", // Se desplaza hacia abajo exactamente el grosor del relieve anterior
            },
          }}
        >
          Nuevo Vehículo
        </Button>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            {/* Selector de Estado en RadioGroup original */}
            <RadioGroup
              row
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              sx={{ alignItems: "center" }}
            >
              <FormControlLabel
                value="activos"
                control={<Radio />}
                label="Activos"
              />
              <FormControlLabel
                value="inactivos"
                control={<Radio />}
                label="Inactivos"
              />
              <FormControlLabel
                value="todos"
                control={<Radio />}
                label="Todos"
              />
            </RadioGroup>

            {/* Selector de Permiso original */}
            <FormControl size="small" sx={{ minWidth: 220 }}>
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
          </Stack>
        </Paper>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={openExportMenu}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",
            mt: 1.5,

            // Texto, borde e icono base en color naranja oscuro
            color: "#ea580c",
            borderColor: "#ea580c",
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
              borderColor: "#f97316",
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
          onClick={exportVehiculosTemplateExcel}
          sx={{
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "8px",
            padding: "10px 24px",
            mt: 1.5,

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
            mt: 1.5,

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
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={closeExportMenu}
        >
          <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>

          <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
        </Menu>
      </Box>

      <Paper sx={{ height: 700, p: 2 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "matricula", sort: "asc" }] },
          }}
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
            <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
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
                  shrink: true,
                  sx: {
                    fontSize: "0.9rem",
                  },
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

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha última ITV"
                value={nuevoVehiculo.fechaUltimaItv}
                onChange={(e) =>
                  setNuevoVehiculo({
                    ...nuevoVehiculo,
                    fechaUltimaItv: e.target.value,
                  })
                }
                helperText="Formato: dd/mm/aaaa"
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
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
              <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
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
                    shrink: true,
                    sx: {
                      fontSize: "0.9rem",
                    },
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Marca"
                  value={selectedVehiculo?.marca || ""}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Modelo"
                  value={selectedVehiculo?.modelo || ""}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Permiso"
                  value={selectedVehiculo?.tipoPermiso || ""}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Combustible"
                  value={`${Math.max(Number(selectedVehiculo?.combustibleActualPct || 0), 0)}%`}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Número de clases realizadas"
                  value={Number(selectedVehiculo?.numeroClasesRealizadas || 0)}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Fecha última ITV"
                  value={formatDateLabel(selectedVehiculo?.fechaUltimaItv)}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
                  fullWidth
                />

                <TextField
                  label="Estado"
                  value={selectedVehiculo?.activo ? "Activo" : "Inactivo"}
                  InputProps={{
                    readOnly: true,
                    tabIndex: -1,
                  }}
                  sx={readOnlyFieldSx}
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
            color={confirmDialog.action === "deactivate" ? "error" : "success"}
            onClick={handleConfirmAction}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deactivateModal.open}
        onClose={deactivateModal.loading ? () => {} : closeDeactivateModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Reasignación obligatoria para desactivar vehículo
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <DialogContentText>
            Debes reasignar todas las clases futuras/en curso antes de finalizar
            la desactivación del vehículo
            {` ${deactivateModal.vehiculo?.matricula || ""}`}. Para clases en
            curso también debes informar kilometraje y combustible del vehículo
            de reemplazo.
          </DialogContentText>

          {deactivateModal.clasesAfectadas.map((clase) => {
            const item = reasignacionesDeactivacion[clase.claseId] || {};

            return (
              <Box
                key={clase.claseId}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                  display: "grid",
                  gap: 1.5,
                }}
              >
                <Typography variant="body2" fontWeight={700}>
                  Clase {new Date(clase.fecha).toLocaleString("es-ES")} |
                  Alumno: {clase.alumnoNombre} | Permiso: {clase.permiso}
                  {clase.enCurso ? " | EN CURSO" : ""}
                </Typography>

                <FormControl fullWidth size="small">
                  <InputLabel>Nuevo vehículo</InputLabel>
                  <Select
                    label="Nuevo vehículo"
                    value={item.nuevoVehiculoId || ""}
                    onChange={(event) =>
                      setReasignacionesDeactivacion((prev) => ({
                        ...prev,
                        [clase.claseId]: {
                          ...prev[clase.claseId],
                          nuevoVehiculoId: event.target.value,
                        },
                      }))
                    }
                  >
                    {clase.opciones.map((opcion) => (
                      <MenuItem key={opcion.id} value={opcion.id}>
                        {opcion.matricula} - {opcion.marca || ""}{" "}
                        {opcion.modelo || ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {clase.enCurso ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                    }}
                  >
                    <TextField
                      size="small"
                      label="Km nuevo vehículo"
                      type="number"
                      value={item.kmActualesNuevoVehiculo || ""}
                      onChange={(event) =>
                        setReasignacionesDeactivacion((prev) => ({
                          ...prev,
                          [clase.claseId]: {
                            ...prev[clase.claseId],
                            kmActualesNuevoVehiculo: event.target.value,
                          },
                        }))
                      }
                    />
                    <TextField
                      size="small"
                      label="Combustible nuevo vehículo (%)"
                      type="number"
                      value={item.combustibleActualPctNuevoVehiculo || ""}
                      onChange={(event) =>
                        setReasignacionesDeactivacion((prev) => ({
                          ...prev,
                          [clase.claseId]: {
                            ...prev[clase.claseId],
                            combustibleActualPctNuevoVehiculo:
                              event.target.value,
                          },
                        }))
                      }
                    />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeactivateModal}
            disabled={deactivateModal.loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeactivateWithReassignment}
            disabled={deactivateModal.loading}
          >
            {deactivateModal.loading ? "Guardando..." : "Guardar y desactivar"}
          </Button>
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
