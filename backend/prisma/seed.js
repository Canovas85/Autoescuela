import bcrypt from "bcryptjs";

import prisma from "../src/config/prisma.js";

const PASSWORD_HASH_ROUNDS = 10;

const baseDate = new Date("2026-08-24T10:00:00.000Z");

function daysAgo(days) {
  return new Date(baseDate.getTime() - days * 24 * 60 * 60 * 1000);
}

function daysFromNow(days) {
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
}

async function upsertUsuario({
  id,
  nombre,
  dni,
  email,
  telefono,
  passwordHash,
  rol,
}) {
  return prisma.usuario.upsert({
    where: { id },
    update: {
      nombre,
      dni,
      email,
      telefono,
      passwordHash,
      rol,
      requiereCambioPassword: false,
    },
    create: {
      id,
      nombre,
      dni,
      email,
      telefono,
      passwordHash,
      rol,
      requiereCambioPassword: false,
    },
  });
}

async function main() {
  const adminPasswordHash = await bcrypt.hash(
    "Admin1234",
    PASSWORD_HASH_ROUNDS,
  );
  const profesorPasswordHash = await bcrypt.hash(
    "Profesor1234",
    PASSWORD_HASH_ROUNDS,
  );
  const alumnoPasswordHash = await bcrypt.hash(
    "Alumno1234",
    PASSWORD_HASH_ROUNDS,
  );

  const admin = await upsertUsuario({
    id: "11111111-1111-1111-1111-111111111111",
    nombre: "Admin Demo",
    dni: "00000000A",
    email: "admin@autoescuela.com",
    telefono: "600000001",
    passwordHash: adminPasswordHash,
    rol: "ADMIN",
  });

  const profesor = await upsertUsuario({
    id: "22222222-2222-2222-2222-222222222222",
    nombre: "Profesor Demo",
    dni: "11111111B",
    email: "profesor@autoescuela.com",
    telefono: "600000002",
    passwordHash: profesorPasswordHash,
    rol: "PROFESOR",
  });

  const alumno = await upsertUsuario({
    id: "33333333-3333-3333-3333-333333333333",
    nombre: "Alumno Demo",
    dni: "22222222C",
    email: "alumno@autoescuela.com",
    telefono: "600000003",
    passwordHash: alumnoPasswordHash,
    rol: "ALUMNO",
  });

  await prisma.profesor.upsert({
    where: { id: profesor.id },
    update: {
      licenciaConducir: "B",
      permisosLicencias: ["B", "A1"],
      telefono: "600000002",
      activo: true,
    },
    create: {
      id: profesor.id,
      licenciaConducir: "B",
      permisosLicencias: ["B", "A1"],
      telefono: "600000002",
      activo: true,
    },
  });

  await prisma.alumno.upsert({
    where: { id: alumno.id },
    update: {
      tipoLicenciaObjetivo: "B",
      fechaNacimiento: new Date("2002-05-18T00:00:00.000Z"),
      horasPracticasCompletadas: 6,
      matriculaPagada: true,
      fechaMatriculaPago: daysAgo(35),
      profesorAsignadoId: profesor.id,
      activo: true,
    },
    create: {
      id: alumno.id,
      tipoLicenciaObjetivo: "B",
      fechaNacimiento: new Date("2002-05-18T00:00:00.000Z"),
      horasPracticasCompletadas: 6,
      matriculaPagada: true,
      fechaMatriculaPago: daysAgo(35),
      profesorAsignadoId: profesor.id,
      activo: true,
    },
  });

  const temarios = [
    {
      id: "temario-001",
      titulo: "Señales de circulación",
      descripcion:
        "Reconocimiento de señales verticales, horizontales y de balizamiento.",
      tipoLicenciaObjetivo: "B",
      orden: 1,
      revisado: true,
      dominio: 90,
      ultimaRevision: daysAgo(12),
    },
    {
      id: "temario-002",
      titulo: "Prioridad y preferencia",
      descripcion: "Reglas de prioridad en intersecciones y glorietas.",
      tipoLicenciaObjetivo: "B",
      orden: 2,
      revisado: false,
      dominio: 45,
      ultimaRevision: daysAgo(9),
    },
    {
      id: "temario-003",
      titulo: "Velocidad y distancia de seguridad",
      descripcion:
        "Límites, adaptación de la velocidad y distancia de reacción.",
      tipoLicenciaObjetivo: "B",
      orden: 3,
      revisado: true,
      dominio: 82,
      ultimaRevision: daysAgo(8),
    },
    {
      id: "temario-004",
      titulo: "Maniobras básicas",
      descripcion: "Cambios de sentido, estacionamiento y adelantamientos.",
      tipoLicenciaObjetivo: "B",
      orden: 4,
      revisado: false,
      dominio: 55,
      ultimaRevision: daysAgo(15),
    },
    {
      id: "temario-005",
      titulo: "Sistemas de seguridad",
      descripcion: "Cinturón, airbags, frenada y ayudas electrónicas.",
      tipoLicenciaObjetivo: "B",
      orden: 5,
      revisado: true,
      dominio: 75,
      ultimaRevision: daysAgo(6),
    },
    {
      id: "temario-006",
      titulo: "Alcohol, drogas y fatiga",
      descripcion: "Efectos sobre la conducción y prevención de riesgos.",
      tipoLicenciaObjetivo: "B",
      orden: 6,
      revisado: false,
      dominio: 30,
      ultimaRevision: daysAgo(20),
    },
    {
      id: "temario-007",
      titulo: "Documentación del vehículo",
      descripcion: "Permisos, seguro, ITV y documentación obligatoria.",
      tipoLicenciaObjetivo: "B",
      orden: 7,
      revisado: false,
      dominio: 40,
      ultimaRevision: daysAgo(18),
    },
    {
      id: "temario-008",
      titulo: "Conducción eficiente",
      descripcion: "Consumo, anticipación y conducción responsable.",
      tipoLicenciaObjetivo: "B",
      orden: 8,
      revisado: true,
      dominio: 88,
      ultimaRevision: daysAgo(5),
    },
  ];

  for (const temario of temarios) {
    await prisma.temario.upsert({
      where: { id: temario.id },
      update: {
        titulo: temario.titulo,
        descripcion: temario.descripcion,
        tipoLicenciaObjetivo: temario.tipoLicenciaObjetivo,
        orden: temario.orden,
      },
      create: {
        id: temario.id,
        titulo: temario.titulo,
        descripcion: temario.descripcion,
        tipoLicenciaObjetivo: temario.tipoLicenciaObjetivo,
        orden: temario.orden,
      },
    });

    await prisma.temarioProgreso.upsert({
      where: { id: `progreso-${temario.id}` },
      update: {
        revisado: temario.revisado,
        dominio: temario.dominio,
        ultimaRevision: temario.ultimaRevision,
      },
      create: {
        id: `progreso-${temario.id}`,
        alumnoId: alumno.id,
        temarioId: temario.id,
        revisado: temario.revisado,
        dominio: temario.dominio,
        ultimaRevision: temario.ultimaRevision,
      },
    });
  }

  const tests = [
    {
      id: "test-001",
      resultado: "APROBADO",
      respuestasCorrectas: 18,
      totalPreguntas: 20,
      fecha: daysAgo(21),
      temarioId: temarios[0].id,
    },
    {
      id: "test-002",
      resultado: "APROBADO",
      respuestasCorrectas: 17,
      totalPreguntas: 20,
      fecha: daysAgo(20),
      temarioId: temarios[2].id,
    },
    {
      id: "test-003",
      resultado: "SUSPENDIDO",
      respuestasCorrectas: 11,
      totalPreguntas: 20,
      fecha: daysAgo(19),
      temarioId: temarios[1].id,
    },
    {
      id: "test-004",
      resultado: "APROBADO",
      respuestasCorrectas: 19,
      totalPreguntas: 20,
      fecha: daysAgo(18),
      temarioId: temarios[4].id,
    },
    {
      id: "test-005",
      resultado: "SUSPENDIDO",
      respuestasCorrectas: 13,
      totalPreguntas: 20,
      fecha: daysAgo(17),
      temarioId: temarios[5].id,
    },
    {
      id: "test-006",
      resultado: "APROBADO",
      respuestasCorrectas: 16,
      totalPreguntas: 20,
      fecha: daysAgo(16),
      temarioId: temarios[7].id,
    },
    {
      id: "test-007",
      resultado: "SUSPENDIDO",
      respuestasCorrectas: 12,
      totalPreguntas: 20,
      fecha: daysAgo(15),
      temarioId: temarios[3].id,
    },
    {
      id: "test-008",
      resultado: "APROBADO",
      respuestasCorrectas: 18,
      totalPreguntas: 20,
      fecha: daysAgo(14),
      temarioId: temarios[0].id,
    },
    {
      id: "test-009",
      resultado: "APROBADO",
      respuestasCorrectas: 17,
      totalPreguntas: 20,
      fecha: daysAgo(13),
      temarioId: temarios[2].id,
    },
    {
      id: "test-010",
      resultado: "SUSPENDIDO",
      respuestasCorrectas: 10,
      totalPreguntas: 20,
      fecha: daysAgo(12),
      temarioId: temarios[1].id,
    },
    {
      id: "test-011",
      resultado: "APROBADO",
      respuestasCorrectas: 19,
      totalPreguntas: 20,
      fecha: daysAgo(11),
      temarioId: temarios[4].id,
    },
    {
      id: "test-012",
      resultado: "APROBADO",
      respuestasCorrectas: 18,
      totalPreguntas: 20,
      fecha: daysAgo(10),
      temarioId: temarios[7].id,
    },
  ];

  for (const test of tests) {
    await prisma.testPractica.upsert({
      where: { id: test.id },
      update: {
        alumnoId: alumno.id,
        temarioId: test.temarioId,
        fecha: test.fecha,
        resultado: test.resultado,
        respuestasCorrectas: test.respuestasCorrectas,
        totalPreguntas: test.totalPreguntas,
      },
      create: {
        id: test.id,
        alumnoId: alumno.id,
        temarioId: test.temarioId,
        fecha: test.fecha,
        resultado: test.resultado,
        respuestasCorrectas: test.respuestasCorrectas,
        totalPreguntas: test.totalPreguntas,
      },
    });
  }

  const bonos = [
    {
      id: "bono-001",
      nombre: "Pack 10 Clases",
      descripcion: "Bono estándar con 10 clases prácticas.",
      clasesIncluidas: 10,
      validezDias: 90,
    },
    {
      id: "bono-002",
      nombre: "Pack 20 Clases",
      descripcion: "Bono ampliado con 20 clases prácticas.",
      clasesIncluidas: 20,
      validezDias: 120,
    },
    {
      id: "bono-003",
      nombre: "Pack Intensivo",
      descripcion: "Bono intensivo para refuerzo rápido antes del examen.",
      clasesIncluidas: 15,
      validezDias: 60,
    },
  ];

  for (const bono of bonos) {
    await prisma.bono.upsert({
      where: { id: bono.id },
      update: {
        nombre: bono.nombre,
        descripcion: bono.descripcion,
        clasesIncluidas: bono.clasesIncluidas,
        validezDias: bono.validezDias,
        activo: true,
      },
      create: {
        id: bono.id,
        nombre: bono.nombre,
        descripcion: bono.descripcion,
        clasesIncluidas: bono.clasesIncluidas,
        validezDias: bono.validezDias,
        activo: true,
      },
    });
  }

  await prisma.compraBono.upsert({
    where: { id: "compra-bono-001" },
    update: {
      alumnoId: alumno.id,
      bonoId: bonos[0].id,
      clasesCompradas: 10,
      clasesConsumidas: 4,
      pagado: true,
      fechaCompra: daysAgo(30),
      fechaValidezHasta: daysFromNow(60),
    },
    create: {
      id: "compra-bono-001",
      alumnoId: alumno.id,
      bonoId: bonos[0].id,
      clasesCompradas: 10,
      clasesConsumidas: 4,
      pagado: true,
      fechaCompra: daysAgo(30),
      fechaValidezHasta: daysFromNow(60),
    },
  });

  await prisma.compraBono.upsert({
    where: { id: "compra-bono-002" },
    update: {
      alumnoId: alumno.id,
      bonoId: bonos[2].id,
      clasesCompradas: 15,
      clasesConsumidas: 15,
      pagado: true,
      fechaCompra: daysAgo(75),
      fechaValidezHasta: daysAgo(2),
    },
    create: {
      id: "compra-bono-002",
      alumnoId: alumno.id,
      bonoId: bonos[2].id,
      clasesCompradas: 15,
      clasesConsumidas: 15,
      pagado: true,
      fechaCompra: daysAgo(75),
      fechaValidezHasta: daysAgo(2),
    },
  });

  const vehiculo = await prisma.vehiculo.upsert({
    where: { id: "vehiculo-001" },
    update: {
      matricula: "1234-ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      imagenRuta: null,
      activo: true,
    },
    create: {
      id: "vehiculo-001",
      matricula: "1234-ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      imagenRuta: null,
      activo: true,
    },
  });

  const clases = [
    {
      id: "clase-001",
      fecha: daysFromNow(2),
      duracion: 45,
      estado: "PROGRAMADA",
    },
    {
      id: "clase-002",
      fecha: daysFromNow(6),
      duracion: 45,
      estado: "PROGRAMADA",
    },
    {
      id: "clase-003",
      fecha: daysAgo(4),
      duracion: 45,
      estado: "CANCELADA",
    },
    {
      id: "clase-004",
      fecha: daysAgo(8),
      duracion: 45,
      estado: "PROGRAMADA",
    },
  ];

  for (const clase of clases) {
    await prisma.clasePractica.upsert({
      where: { id: clase.id },
      update: {
        alumnoId: alumno.id,
        profesorId: profesor.id,
        vehiculoId: vehiculo.id,
        fecha: clase.fecha,
        duracion: clase.duracion,
        estado: clase.estado,
      },
      create: {
        id: clase.id,
        alumnoId: alumno.id,
        profesorId: profesor.id,
        vehiculoId: vehiculo.id,
        fecha: clase.fecha,
        duracion: clase.duracion,
        estado: clase.estado,
      },
    });
  }

  await prisma.examen.upsert({
    where: { id: "examen-001" },
    update: {
      alumnoId: alumno.id,
      tipo: "TEORICO",
      fecha: daysFromNow(14),
      estado: "PROGRAMADO",
    },
    create: {
      id: "examen-001",
      alumnoId: alumno.id,
      tipo: "TEORICO",
      fecha: daysFromNow(14),
      estado: "PROGRAMADO",
    },
  });

  await prisma.examen.upsert({
    where: { id: "examen-002" },
    update: {
      alumnoId: alumno.id,
      tipo: "PRACTICO",
      fecha: daysFromNow(25),
      estado: "PROGRAMADO",
    },
    create: {
      id: "examen-002",
      alumnoId: alumno.id,
      tipo: "PRACTICO",
      fecha: daysFromNow(25),
      estado: "PROGRAMADO",
    },
  });

  await prisma.solicitudExamen.upsert({
    where: { id: "solicitud-examen-001" },
    update: {
      alumnoId: alumno.id,
      tipo: "TEORICO",
      estado: "PENDIENTE",
      fechaSolicitud: daysAgo(3),
      fechaProgramada: null,
      observaciones: "Pendiente de revisar el bloque de teoría.",
    },
    create: {
      id: "solicitud-examen-001",
      alumnoId: alumno.id,
      tipo: "TEORICO",
      estado: "PENDIENTE",
      fechaSolicitud: daysAgo(3),
      fechaProgramada: null,
      observaciones: "Pendiente de revisar el bloque de teoría.",
    },
  });

  await prisma.solicitudExamen.upsert({
    where: { id: "solicitud-examen-002" },
    update: {
      alumnoId: alumno.id,
      tipo: "PRACTICO",
      estado: "PROGRAMADO",
      fechaSolicitud: daysAgo(5),
      fechaProgramada: daysFromNow(25),
      observaciones: "En espera de realizar la práctica final.",
    },
    create: {
      id: "solicitud-examen-002",
      alumnoId: alumno.id,
      tipo: "PRACTICO",
      estado: "PROGRAMADO",
      fechaSolicitud: daysAgo(5),
      fechaProgramada: daysFromNow(25),
      observaciones: "En espera de realizar la práctica final.",
    },
  });

  console.log("Seed inicial completada correctamente", {
    admin: admin.email,
    profesor: profesor.email,
    alumno: alumno.email,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error ejecutando la seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
