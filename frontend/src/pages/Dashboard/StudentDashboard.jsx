import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import VerifiedIcon from "@mui/icons-material/Verified";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import TimelineIcon from "@mui/icons-material/Timeline";
import BookIcon from "@mui/icons-material/Book";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EventNoteIcon from "@mui/icons-material/EventNote";

const statusStyles = {
  PAGADA: {
    label: "Pagada",
    color: "success",
    background: "#dcfce7",
    foreground: "#166534",
  },
  PENDIENTE: {
    label: "Pendiente",
    color: "warning",
    background: "#fef3c7",
    foreground: "#92400e",
  },
  APLICABLE: {
    label: "Aplicable",
    color: "success",
    background: "#dcfce7",
    foreground: "#166534",
  },
  AGOTADO: {
    label: "Agotado",
    color: "default",
    background: "#e2e8f0",
    foreground: "#334155",
  },
  CADUCADO: {
    label: "Caducado",
    color: "error",
    background: "#fee2e2",
    foreground: "#991b1b",
  },
  PENDIENTE_PAGO: {
    label: "Pendiente de pago",
    color: "warning",
    background: "#fef3c7",
    foreground: "#92400e",
  },
};

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatPercentage(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function DashboardStatCard({ icon, title, value, subtitle, color }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            {subtitle ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              backgroundColor: color,
              color: "#fff",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function statusChip(status, fallbackLabel) {
  const config = statusStyles[status] ?? {
    label: fallbackLabel ?? status,
    color: "default",
    background: "#e2e8f0",
    foreground: "#334155",
  };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.background,
        color: config.foreground,
        fontWeight: 700,
      }}
    />
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
      </Box>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function StudentDashboard({ data }) {
  if (!data) {
    return <p>Cargando dashboard...</p>;
  }

  const {
    perfil,
    teoria,
    temarios,
    practica,
    bonos,
    examenes,
    reservas,
    evolucion,
    resumen,
  } = data;

  const totalBonoDisponible = bonos.reduce(
    (acumulado, bono) => acumulado + bono.clasesDisponibles,
    0,
  );

  const periodoMaximo = Math.max(
    1,
    ...evolucion.map((periodo) => Math.max(periodo.tests, periodo.clases)),
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 100%)",
          color: "#fff",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Mi panel
            </Typography>
            <Typography
              sx={{ mt: 1, maxWidth: 720, color: "rgba(255,255,255,0.88)" }}
            >
              Resumen personal de tu progreso, tu matrícula y tu gestión de
              teoría y prácticas.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {statusChip(resumen.matricula)}
            <Chip
              label={
                resumen.preparadoParaTeorico
                  ? "Preparado para examen"
                  : "Aún no preparado"
              }
              size="small"
              sx={{
                backgroundColor: resumen.preparadoParaTeorico
                  ? "#dcfce7"
                  : "#fef3c7",
                color: resumen.preparadoParaTeorico ? "#166534" : "#92400e",
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${teoria.testsTotales} tests realizados`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <SectionTitle
                icon={<PersonIcon sx={{ color: "#1d4ed8" }} />}
                title="Datos personales"
                subtitle="Información principal asociada a tu cuenta y a tu expediente en la autoescuela."
              />

              <Grid container spacing={2}>
                {[
                  ["Nombre", perfil.nombre],
                  ["DNI", perfil.dni || "No informado"],
                  ["Email", perfil.email],
                  ["Teléfono", perfil.telefono || "No informado"],
                  ["Permiso objetivo", perfil.tipoLicenciaObjetivo],
                  [
                    "Profesor asignado",
                    perfil.profesorAsignado?.nombre || "Sin asignar",
                  ],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mt: 0.5 }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={perfil.activo ? "Alumno activo" : "Alumno inactivo"}
                  color={perfil.activo ? "success" : "default"}
                />
                {perfil.matriculaPagada ? (
                  <Chip
                    label={`Matrícula pagada el ${formatDate(perfil.fechaMatriculaPago)}`}
                    color="success"
                  />
                ) : (
                  <Chip label="Matrícula pendiente de pago" color="warning" />
                )}
                <Chip
                  label={`${perfil.horasPracticasCompletadas} horas prácticas completadas`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <DashboardStatCard
              icon={<CreditCardIcon />}
              title="Matrícula"
              value={perfil.matriculaPagada ? "Pagada" : "Pendiente"}
              subtitle={
                perfil.matriculaPagada
                  ? "Todo listo para seguir avanzando"
                  : "Falta completar el pago de matrícula"
              }
              color={perfil.matriculaPagada ? "#16a34a" : "#f59e0b"}
            />
            <DashboardStatCard
              icon={<AssignmentIcon />}
              title="Tests de práctica"
              value={teoria.testsTotales}
              subtitle={`${teoria.testsAprobados} aprobados y ${teoria.testsSuspendidos} suspendidos`}
              color="#2563eb"
            />
            <DashboardStatCard
              icon={<DirectionsCarIcon />}
              title="Clases compradas"
              value={practica.clasesCompradas}
              subtitle={`${practica.clasesPagadas} pagadas y ${practica.clasesReservadas} reservadas`}
              color="#0f172a"
            />
            <DashboardStatCard
              icon={<EventAvailableIcon />}
              title="Reservas activas"
              value={practica.clasesReservadas}
              subtitle="Clases programadas actualmente"
              color="#7c3aed"
            />
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <SectionTitle
                icon={<SchoolIcon sx={{ color: "#2563eb" }} />}
                title="Teoría y examen"
                subtitle="Este bloque resume tu progreso en tests, el porcentaje de acierto y la recomendación de revisión."
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#eff6ff" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Tests realizados
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {teoria.testsTotales}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#ecfdf5" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Aprobados / suspendidos
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {teoria.testsAprobados} / {teoria.testsSuspendidos}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#fff7ed" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Porcentaje aprobado
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {formatPercentage(teoria.porcentajeAprobado)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Índice de preparación teórica
                  </Typography>
                  {teoria.preparadoParaTeorico ? (
                    <Chip label="Preparado" color="success" size="small" />
                  ) : (
                    <Chip
                      label="Necesita repaso"
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(teoria.porcentajeAprobado, 100)}
                  sx={{ height: 10, borderRadius: 999 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Recomendación de temarios
                </Typography>
                {teoria.recomendacionTemarios.length > 0 ? (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {teoria.recomendacionTemarios.map((temario) => (
                      <Chip key={temario} label={temario} variant="outlined" />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No hay temarios críticos pendientes. Puedes seguir con
                    simulacros y reforzar test.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <SectionTitle
                icon={<BookIcon sx={{ color: "#7c3aed" }} />}
                title="Temarios revisados"
                subtitle="Relación de temarios asociados al permiso objetivo y su nivel de avance."
              />

              <Stack spacing={1.5}>
                {temarios.length > 0 ? (
                  temarios.map((temario) => (
                    <Box
                      key={`${temario.id}-${temario.titulo}`}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Box>
                          <Typography fontWeight={800}>
                            {temario.titulo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {temario.descripcion || "Sin descripción adicional"}
                          </Typography>
                        </Box>
                        {temario.revisado ? (
                          <Chip label="Revisado" color="success" size="small" />
                        ) : (
                          <Chip
                            label="Pendiente"
                            color="warning"
                            size="small"
                          />
                        )}
                      </Box>
                      <Box sx={{ mt: 1.5 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Dominio del tema
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {temario.dominio}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(temario.dominio, 100)}
                          sx={{ height: 8, borderRadius: 999 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Última revisión: {formatDate(temario.ultimaRevision)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Todavía no hay temarios cargados para este alumno.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <SectionTitle
                icon={<DirectionsCarIcon sx={{ color: "#0f172a" }} />}
                title="Tu formación práctica"
                subtitle="Resumen de clases compradas, pagadas, reservas actuales y evolución reciente."
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#f8fafc" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Compradas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesCompradas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#f8fafc" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Pagadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesPagadas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#f8fafc" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Reservadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesReservadas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{ p: 2, borderRadius: 3, backgroundColor: "#f8fafc" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Realizadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesRealizadas}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
                  Evolución breve
                </Typography>
                <Grid container spacing={1} alignItems="end">
                  {evolucion.map((periodo) => (
                    <Grid item xs key={periodo.key}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: 140,
                            display: "flex",
                            alignItems: "end",
                            justifyContent: "center",
                            gap: 0.5,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: `${Math.max((periodo.tests / periodoMaximo) * 120, 8)}px`,
                              borderRadius: 999,
                              backgroundColor: "#2563eb",
                            }}
                            title={`Tests: ${periodo.tests}`}
                          />
                          <Box
                            sx={{
                              width: 18,
                              height: `${Math.max((periodo.clases / periodoMaximo) * 120, 8)}px`,
                              borderRadius: 999,
                              backgroundColor: "#16a34a",
                            }}
                            title={`Clases: ${periodo.clases}`}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {periodo.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Reservas de clases
                </Typography>
                {reservas.length > 0 ? (
                  <List dense disablePadding>
                    {reservas.map((reserva) => (
                      <ListItem
                        key={reserva.id}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                        secondaryAction={statusChip(
                          reserva.estado,
                          reserva.estado,
                        )}
                      >
                        <ListItemText
                          primary={`${formatDate(reserva.fecha)} · ${reserva.vehiculo?.matricula ?? "Sin vehículo"}`}
                          secondary={
                            reserva.profesor?.usuario?.nombre
                              ? `Profesor: ${reserva.profesor.usuario.nombre}`
                              : "Profesor no asignado"
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No tienes reservas programadas en este momento.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <SectionTitle
                icon={<WorkspacePremiumIcon sx={{ color: "#d97706" }} />}
                title="Bonos disponibles"
                subtitle={`Tienes ${bonos.length} bono(s) registrados y ${totalBonoDisponible} clase(s) aplicables.`}
              />

              <Stack spacing={1.5}>
                {bonos.length > 0 ? (
                  bonos.map((bono) => (
                    <Box
                      key={bono.id}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Box>
                          <Typography fontWeight={800}>
                            {bono.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bono.descripcion || "Paquete de clases"}
                          </Typography>
                        </Box>
                        {statusChip(bono.estado, bono.estado)}
                      </Box>

                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {bono.clasesCompradas} compradas ·{" "}
                          {bono.clasesConsumidas} consumidas ·{" "}
                          {bono.clasesDisponibles} disponibles
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Válido hasta: {formatDate(bono.fechaValidezHasta)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {bono.aplicable
                            ? "Puedes aplicarlo ahora"
                            : "No aplicable en este momento"}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Todavía no tienes bonos comprados.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <SectionTitle
            icon={<EventNoteIcon sx={{ color: "#7c3aed" }} />}
            title="Solicitudes de examen"
            subtitle="Estado de tus solicitudes para examen teórico y práctico."
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Examen teórico
                </Typography>
                {examenes.teoricos.length > 0 ? (
                  <Stack spacing={1.5}>
                    {examenes.teoricos.map((examen) => (
                      <Box key={examen.id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography fontWeight={700}>
                            {formatDate(examen.fechaSolicitud)}
                          </Typography>
                          {statusChip(examen.estado, examen.estado)}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Programado: {formatDate(examen.fechaProgramada)}
                        </Typography>
                        {examen.observaciones ? (
                          <Typography variant="body2" color="text.secondary">
                            {examen.observaciones}
                          </Typography>
                        ) : null}
                        <Divider sx={{ mt: 1.5 }} />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    Todavía no has solicitado examen teórico.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Examen práctico
                </Typography>
                {examenes.practicos.length > 0 ? (
                  <Stack spacing={1.5}>
                    {examenes.practicos.map((examen) => (
                      <Box key={examen.id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography fontWeight={700}>
                            {formatDate(examen.fechaSolicitud)}
                          </Typography>
                          {statusChip(examen.estado, examen.estado)}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Programado: {formatDate(examen.fechaProgramada)}
                        </Typography>
                        {examen.observaciones ? (
                          <Typography variant="body2" color="text.secondary">
                            {examen.observaciones}
                          </Typography>
                        ) : null}
                        <Divider sx={{ mt: 1.5 }} />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    Todavía no has solicitado examen práctico.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 3, p: 2, borderRadius: 3, backgroundColor: "#f8fafc" }}
          >
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
              Estado general
            </Typography>
            <Typography color="text.secondary">
              {resumen.preparadoParaTeorico
                ? "Según tu progreso actual, ya estás preparado para el examen teórico."
                : "Aún no estás listo para examinarte del teórico; revisa los temarios recomendados y mejora el porcentaje de acierto."}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
