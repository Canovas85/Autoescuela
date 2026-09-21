import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";

import { matriculasService } from "../../services/matriculasService";
import { LicenseChip } from "../../components/common/LicenseChip";

export default function Matriculas() {
  const [rows, setRows] = useState([]);
  const [activeStates, setActiveStates] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadMatriculas = async () => {
    const data = await matriculasService.getAll();
    setRows(data);
  };

  useEffect(() => {
    loadMatriculas();
  }, []);

  const filteredRows = useMemo(() => {
    if (activeStates.length === 0) {
      return rows;
    }

    return rows.filter((row) => activeStates.includes(row.estado));
  }, [rows, activeStates]);

  const toggleStateChip = (state) => {
    setActiveStates((prev) =>
      prev.includes(state)
        ? prev.filter((item) => item !== state)
        : [...prev, state],
    );
  };

  const getBaseAmount = (row) => {
    if (
      row.promocion?.precioOriginal !== undefined &&
      row.promocion?.precioOriginal !== null
    ) {
      return Number(row.promocion.precioOriginal);
    }

    return Number(row.precioBase || 0);
  };

  const getDiscountAmount = (row) => {
    const base = getBaseAmount(row);
    const final = Number(row.precioFinal || 0);
    const discount = base - final;

    return discount > 0 ? Number(discount.toFixed(2)) : 0;
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
      renderCell: (params) => <LicenseChip value={params.value} />,
    },

    {
      field: "precioBase",
      headerName: "Precio Base",
      flex: 0.8,
      valueGetter: (_, row) => getBaseAmount(row),
      valueFormatter: (value) => `${Number(value || 0).toFixed(2)} €`,
    },
    {
      field: "precioFinal",
      headerName: "Precio Final",
      flex: 0.8,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography
            fontWeight={700}
            color={
              params.row.precioFinal < params.row.precioBase
                ? "success.main"
                : "text.primary"
            }
          >
            {Number(params.row.precioFinal || 0).toFixed(2)} €
          </Typography>
        </div>
      ),
    },

    {
      field: "promocion",
      headerName: "Promoción",
      flex: 1.5,

      renderCell: (params) =>
        params.row.promocion ? (
          <Chip
            label={params.row.promocion.nombre}
            color="success"
            size="small"
          />
        ) : (
          <Chip label="Sin promoción" size="small" />
        ),
    },

    {
      field: "descuento",
      headerName: "Descuento",
      flex: 0.8,
      valueGetter: (_, row) => getDiscountAmount(row),
      valueFormatter: (value) => `${Number(value || 0).toFixed(2)} €`,
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
          <Tooltip title="Pagar matrícula" arrow>
            <IconButton
              color="success"
              size="small"
              onClick={() => handlePagar(params.row)}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Anular matrícula" arrow>
            <IconButton
              color="error"
              size="small"
              onClick={() => handleAnular(params.row)}
            >
              <CancelIcon />
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
            Matrículas
          </Typography>

          <Typography color="text.secondary">
            Gestión administrativa de matrículas y estado de pago.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 760 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip
            color={activeStates.includes("PENDIENTE") ? "primary" : "warning"}
            variant={activeStates.includes("PENDIENTE") ? "filled" : "outlined"}
            label={`Pendientes: ${
              rows.filter((m) => m.estado === "PENDIENTE").length
            }`}
            onClick={() => toggleStateChip("PENDIENTE")}
          />

          <Chip
            color={activeStates.includes("PAGADA") ? "primary" : "success"}
            variant={activeStates.includes("PAGADA") ? "filled" : "outlined"}
            label={`Pagadas: ${
              rows.filter((m) => m.estado === "PAGADA").length
            }`}
            onClick={() => toggleStateChip("PAGADA")}
          />

          <Chip
            color={activeStates.includes("ANULADA") ? "primary" : "error"}
            variant={activeStates.includes("ANULADA") ? "filled" : "outlined"}
            label={`Anuladas: ${
              rows.filter((m) => m.estado === "ANULADA").length
            }`}
            onClick={() => toggleStateChip("ANULADA")}
          />
        </Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
          }}
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
