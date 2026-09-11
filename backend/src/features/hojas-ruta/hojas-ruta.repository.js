export class HojasRutaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findProfessorClasses(profesorId, whereExtras = {}) {
    return this.prisma.clasePractica.findMany({
      where: {
        profesorId,
        ...whereExtras,
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        vehiculo: true,
        hojaRuta: {
          include: {
            faltas: {
              orderBy: {
                orden: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });
  }

  async findClassById(id) {
    return this.prisma.clasePractica.findUnique({
      where: { id },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        vehiculo: true,
        hojaRuta: {
          include: {
            faltas: {
              orderBy: {
                orden: "asc",
              },
            },
          },
        },
      },
    });
  }

  async upsertRoadmapByClass(clase, payload) {
    return this.prisma.hojaRuta.upsert({
      where: {
        clasePracticaId: clase.id,
      },
      update: {
        ...payload,
      },
      create: {
        clasePracticaId: clase.id,
        profesorId: clase.profesorId,
        alumnoId: clase.alumnoId,
        ...payload,
      },
      include: {
        faltas: {
          orderBy: {
            orden: "asc",
          },
        },
      },
    });
  }

  async replaceRoadmapFaults(hojaRutaId, faults) {
    await this.prisma.hojaRutaFalta.deleteMany({
      where: {
        hojaRutaId,
      },
    });

    if (!faults.length) {
      return;
    }

    await this.prisma.hojaRutaFalta.createMany({
      data: faults.map((fault) => ({
        hojaRutaId,
        hora: fault.hora,
        tipo: fault.tipo,
        categoria: fault.categoria,
        descripcion: fault.descripcion,
        orden: fault.orden,
        catalogoId: fault.catalogoId || null,
      })),
    });
  }

  async findFaultCatalog() {
    return this.prisma.hojaRutaFaltaCatalogo.findMany({
      where: {
        activo: true,
      },
      orderBy: [{ tipo: "asc" }, { orden: "asc" }],
    });
  }

  async findAdminClasses(whereExtras = {}) {
    return this.prisma.clasePractica.findMany({
      where: {
        ...whereExtras,
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        vehiculo: true,
        hojaRuta: true,
      },
      orderBy: [{ profesorId: "asc" }, { alumnoId: "asc" }, { fecha: "desc" }],
    });
  }

  async findRegisteredRoadmapsByProfessorAndStudent(profesorId, alumnoId) {
    return this.prisma.hojaRuta.findMany({
      where: {
        profesorId,
        alumnoId,
        estado: "REGISTRADA",
      },
      include: {
        clasePractica: {
          include: {
            vehiculo: true,
          },
        },
        faltas: {
          orderBy: {
            orden: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findRoadmapById(id) {
    return this.prisma.hojaRuta.findUnique({
      where: {
        id,
      },
      include: {
        clasePractica: {
          include: {
            alumno: {
              include: {
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
            profesor: {
              include: {
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
            vehiculo: true,
          },
        },
        faltas: {
          orderBy: {
            orden: "asc",
          },
        },
      },
    });
  }

  async findStudentRegisteredRoadmaps(alumnoId, whereExtras = {}) {
    return this.prisma.hojaRuta.findMany({
      where: {
        alumnoId,
        estado: "REGISTRADA",
        ...whereExtras,
      },
      include: {
        clasePractica: {
          include: {
            profesor: {
              include: {
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
            vehiculo: true,
          },
        },
        faltas: {
          orderBy: {
            orden: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
}
