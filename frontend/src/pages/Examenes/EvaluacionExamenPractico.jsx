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
  Snackbar,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { evaluacionExamenesService } from "../../services/evaluacionExamenesService";

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const stateToColor = (estado) => {
  if (estado === "APROBADO") return "success";
  if (estado === "SUSPENSO") return "error";
  return "warning";
};

export default function EvaluacionExamenPractico() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    try {
      const data = await evaluacionExamenesService.getPractico();
      setRows(data || []);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar la evaluación de examen práctico",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (row) => {
    setSelectedRow(row);
    setOpenDetail(true);
  };

  const columns = useMemo(
    () => [
      {
        field: "fechaConvocatoria",
        headerName: "Fecha convocatoria",
        flex: 1,
        valueGetter: (_, row) => formatDate(row.fechaConvocatoria),
      },
      {
        field: "alumnoNombre",
        headerName: "Alumno",
        flex: 1.4,
      },
      {
        field: "permisoLicencia",
        headerName: "Permiso/Licencia",
        flex: 0.9,
      },
      {
        field: "estado",
        headerName: "Estado / Resultado",
        flex: 1,
        renderCell: (params) => (
          <Chip
            size="small"
            color={stateToColor(params.row.estado)}
            label={params.row.estado}
          />
        ),
      },
      {
        field: "acciones",
        headerName: "Acción",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 0.5,
              mt: 1,
              ml: -2,
            }}
          >
            <Tooltip title="Ver detalle" arrow>
              <IconButton
                color="primary"
                onClick={(event) => {
                  event.stopPropagation(); // Evita que se seleccione la fila al hacer clic
                  handleOpenDetail(params.row); // Abre tu modal original con los datos de la fila
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Evaluación - Examen Práctico
        </Typography>
        <Typography color="text.secondary">
          Seguimiento de solicitudes programadas y resultados cerrados del
          examen práctico.
        </Typography>
      </Box>

      <Box sx={{ height: 680 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          onRowClick={(params) => handleOpenDetail(params.row)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: "fechaConvocatoria", sort: "desc" }],
            },
          }}
        />
      </Box>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de examen práctico</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.25, pt: 1 }}>
          <Typography>
            <strong>Fecha de convocatoria:</strong>{" "}
            {formatDate(selectedRow?.fechaConvocatoria)}
          </Typography>
          <Typography>
            <strong>Alumno:</strong> {selectedRow?.alumnoNombre || "-"}
          </Typography>
          <Typography>
            <strong>Permiso/Licencia:</strong>{" "}
            {selectedRow?.permisoLicencia || "-"}
          </Typography>
          <Typography>
            <strong>Estado / Resultado:</strong> {selectedRow?.estado || "-"}
          </Typography>
          <Typography>
            <strong>Número de convocatoria (intento):</strong>{" "}
            {selectedRow?.numeroIntento ?? "-"}
          </Typography>
          <Typography>
            <strong>Convocatorias restantes:</strong>{" "}
            {selectedRow?.convocatoriasRestantes ?? "-"}
          </Typography>
          <Typography>
            <strong>Profesor asignado:</strong>{" "}
            {selectedRow?.profesorAsignado || "Sin asignar"}
          </Typography>
          <Typography>
            <strong>Observaciones:</strong>{" "}
            {selectedRow?.observaciones || "Sin observaciones"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
