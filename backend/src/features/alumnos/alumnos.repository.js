//  CÓDIGO CORREGIDO (Una única clase con todo dentro)
//  import prisma from "/src/config/prisma.js";

export class AlumnosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        dni: data.dni || null,
        email: data.email,
        telefono: data.telefono,
        passwordHash: data.passwordHash,
        requiereCambioPassword: true,
        rol: data.rol || "ALUMNO",
      },
    });

    return this.prisma.alumno.create({
      data: {
        id: usuario.id,
        tipoLicenciaObjetivo: data.tipoLicenciaObjetivo ?? data.tipoLicencia,
        fechaNacimiento: data.fechaNacimiento ?? null,
        activo: data.activo ?? true,
        horasPracticasCompletadas: 0,
        profesorAsignadoId: data.profesorAsignadoId || null,
      },

      include: {
        usuario: true,
      },
    });
  }

  async findByEmail(email) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return this.prisma.alumno.findMany({
      include: {
        usuario: true,

        matriculas: {
          include: {
            promocion: true,
          },
          orderBy: {
            fechaCreacion: "desc",
          },
          take: 1,
        },

        profesorAsignado: {
          include: {
            usuario: true,
          },
        },
        solicitudesExamen: {
          select: {
            id: true,
            tipo: true,
            estado: true,
            fechaSolicitud: true,
            fechaProgramada: true,
          },
          orderBy: {
            fechaSolicitud: "desc",
          },
        },
        clases: {
          select: {
            id: true,
            duracion: true,
            estado: true,
            hojaRuta: {
              select: {
                estado: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id) {
    return this.prisma.alumno.findUnique({
      where: {
        id,
      },

      include: {
        usuario: true,

        profesorAsignado: {
          include: {
            usuario: true,
          },
        },
        matriculas: {
          include: {
            promocion: true,
          },
          orderBy: {
            fechaCreacion: "desc",
          },
        },
      },
    });
  }

  async findExtendedSummaryById(id) {
    const alumno = await this.prisma.alumno.findUnique({
      where: {
        id,
      },
      include: {
        usuario: true,
        matriculas: {
          include: {
            promocion: true,
          },
          orderBy: {
            fechaCreacion: "desc",
          },
        },
        solicitudesExamen: {
          orderBy: {
            fechaSolicitud: "desc",
          },
          include: {
            pagoGastoPractico: true,
          },
        },
        clases: {
          orderBy: {
            fecha: "desc",
          },
          include: {
            profesor: {
              include: {
                usuario: true,
              },
            },
            vehiculo: true,
          },
        },
      },
    });

    if (!alumno) {
      return null;
    }

    const [pagos, documentos, bonos, testsTemario, examenesDgt] =
      await Promise.all([
        this.prisma.pago.findMany({
          where: {
            alumnoId: id,
          },
          orderBy: {
            fechaCreacion: "desc",
          },
        }),
        this.prisma.documentoAlumno.findMany({
          where: {
            alumnoId: id,
            tipo: "CERTIFICADO_PSICOTECNICO",
            activo: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        this.prisma.compraBono.findMany({
          where: {
            alumnoId: id,
          },
          include: {
            bono: true,
          },
          orderBy: {
            fechaCompra: "desc",
          },
        }),
        this.prisma.testPractica.findMany({
          where: {
            alumnoId: id,
          },
          orderBy: {
            fecha: "desc",
          },
        }),
        this.prisma.examenDGTAlumno.findMany({
          where: {
            alumnoId: id,
          },
          orderBy: {
            fecha: "desc",
          },
        }),
      ]);

    return {
      ...alumno,
      pagos,
      documentos,
      bonos,
      testsTemario,
      examenesDgt,
    };
  }

  async update(id, data) {
    await this.prisma.usuario.update({
      where: {
        id,
      },

      data: {
        nombre: data.nombre,
        dni: data.dni ?? undefined,
        email: data.email,
        telefono: data.telefono,

        ...(data.passwordHash && {
          passwordHash: data.passwordHash,
        }),
      },
    });

    return this.prisma.alumno.update({
      where: {
        id,
      },

      data: {
        tipoLicenciaObjetivo: data.tipoLicenciaObjetivo ?? data.tipoLicencia,
        fechaNacimiento: data.fechaNacimiento ?? undefined,
        profesorAsignadoId:
          data.profesorAsignadoId !== undefined
            ? data.profesorAsignadoId || null
            : undefined,
      },

      include: {
        usuario: true,
        profesorAsignado: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async findActiveProfesoresByLicencia(licencia) {
    return this.prisma.profesor.findMany({
      where: {
        activo: true,
        permisosLicencias: {
          has: licencia,
        },
      },
      include: {
        usuario: true,
      },
      orderBy: {
        usuario: {
          nombre: "asc",
        },
      },
    });
  }

  async findProfesorById(id) {
    return this.prisma.profesor.findUnique({
      where: {
        id,
      },
      include: {
        usuario: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.alumno.update({
      where: {
        id,
      },

      data: {
        activo: false,
      },
    });
  }

  async activate(id) {
    return this.prisma.alumno.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }

  async findFutureScheduledClassesByAlumno(alumnoId, fromDate) {
    return this.prisma.clasePractica.findMany({
      where: {
        alumnoId,
        fecha: {
          gt: fromDate,
        },
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        profesor: {
          include: {
            usuario: true,
          },
        },
        vehiculo: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async findProfessorOccupiedAtDate(profesorId, fecha, excludeClassId = null) {
    return this.prisma.clasePractica.findFirst({
      where: {
        profesorId,
        fecha,
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
        ...(excludeClassId
          ? {
              id: {
                not: excludeClassId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });
  }

  async reassignClassProfessor(claseId, nuevoProfesorId) {
    return this.prisma.clasePractica.update({
      where: {
        id: claseId,
      },
      data: {
        profesorId: nuevoProfesorId,
      },
    });
  }

  async cancelClassByAdmin(claseId, motivo) {
    return this.prisma.clasePractica.update({
      where: {
        id: claseId,
      },
      data: {
        estado: "CANCELADA_ADMIN",
        canceladaPor: "ADMIN",
        canceladaConPenalizacion: false,
        observaciones: motivo,
      },
    });
  }

  async revertConsumedBonusClass(compraBonoId) {
    if (!compraBonoId) {
      return null;
    }

    return this.prisma.compraBono.updateMany({
      where: {
        id: compraBonoId,
        clasesConsumidas: {
          gt: 0,
        },
      },
      data: {
        clasesConsumidas: {
          decrement: 1,
        },
      },
    });
  }

  async cancelPendingClassPayment(claseId, motivo) {
    return this.prisma.pago.updateMany({
      where: {
        clasePracticaId: claseId,
        estado: "PENDIENTE",
      },
      data: {
        estado: "CANCELADO",
        observaciones: motivo,
      },
    });
  }

  async hasApprovedHistoryByDni(dni) {
    if (!dni) {
      return false;
    }

    const examenAprobado = await this.prisma.examen.findFirst({
      where: {
        estado: "APROBADO",
        alumno: {
          usuario: {
            dni,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(examenAprobado);
  }
}
