import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { documentosAlumnoService } from "../../services/documentosAlumnoService";

const ESTADOS = {
  PENDIENTE_VALIDACION: "Pendiente de validar",
  VALIDADO: "Validado",
  RECHAZADO: "Rechazado",
};

const buildFileUrl = (ruta) => {
  if (!ruta) return "";
  return ruta.startsWith("http") ? ruta : `${window.location.origin}${ruta}`;
};

export default function DocumentosAlumnoAdmin() {
  const [rows, setRows] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadDocuments = async () => {
    try {
      const data = await documentosAlumnoService.getAllAdmin();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los documentos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleValidate = async (id) => {
    try {
      await documentosAlumnoService.validate(id, "VALIDADO");
      setNotification({
        open: true,
        message: "Documento validado correctamente",
        severity: "success",
      });
      loadDocuments();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo validar el documento",
        severity: "error",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await documentosAlumnoService.validate(id, "RECHAZADO");
      setNotification({
        open: true,
        message: "Documento rechazado correctamente",
        severity: "warning",
      });
      loadDocuments();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo rechazar el documento",
        severity: "error",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "alumno",
        headerName: "Alumno",
        flex: 1.5,
        valueGetter: (_, row) => row.alumno?.usuario?.nombre || "-",
      },
      { field: "tipo", headerName: "Tipo", flex: 1.1 },
      {
        field: "estado",
        headerName: "Estado",
        flex: 1,
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
        field: "observaciones",
        headerName: "Observaciones",
        flex: 1.2,
        valueGetter: (_, row) => row.observaciones || "-",
      },
      {
        field: "archivos",
        headerName: "Archivos",
        flex: 1.4,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {(params.row.archivos || []).map((archivo) => (
              <Button
                key={archivo.id}
                size="small"
                variant="outlined"
                onClick={() =>
                  window.open(buildFileUrl(archivo.ruta), "_blank")
                }
              >
                {archivo.nombreOriginal}
              </Button>
            ))}
          </Stack>
        ),
      },
      {
        field: "createdAt",
        headerName: "Fecha alta",
        flex: 0.9,
        valueGetter: (_, row) =>
          new Date(row.createdAt).toLocaleDateString("es-ES"),
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
            <IconButton
              color="success"
              size="small"
              aria-label="Validar documento"
              disabled={params.row.estado === "VALIDADO"}
              onClick={() => handleValidate(params.row.id)}
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              aria-label="Rechazar documento"
              disabled={params.row.estado === "RECHAZADO"}
              onClick={() => handleReject(params.row.id)}
            >
              <CancelIcon />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Documentos de alumnos
      </Typography>

      {rows.length === 0 ? (
        <Alert severity="info">No hay documentos pendientes de validar.</Alert>
      ) : (
        <Box sx={{ height: 620 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      )}

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
