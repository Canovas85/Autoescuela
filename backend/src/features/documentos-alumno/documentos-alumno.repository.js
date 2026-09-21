export class DocumentosAlumnoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findByAlumnoId(alumnoId) {
    return this.prisma.documentoAlumno.findMany({
      where: {
        alumnoId,
        activo: true,
      },
      include: {
        archivos: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllAdmin(filters = {}) {
    const search = String(filters.search || "").trim();
    const tipo = String(filters.tipo || "")
      .trim()
      .toUpperCase();
    const estado = String(filters.estado || "")
      .trim()
      .toUpperCase();

    const where = {
      activo: true,
    };

    if (search) {
      where.alumno = {
        usuario: {
          OR: [
            {
              nombre: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              dni: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      };
    }

    if (tipo && tipo !== "TODOS") {
      where.tipo = tipo;
    }

    if (estado && estado !== "TODOS") {
      where.estado = estado;
    }

    return this.prisma.documentoAlumno.findMany({
      where,
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        archivos: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ estado: "asc" }, { createdAt: "desc" }],
    });
  }

  async findById(id) {
    return this.prisma.documentoAlumno.findUnique({
      where: { id },
      include: {
        archivos: true,
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async createWithFiles({ alumnoId, tipo, observaciones, archivos }) {
    return this.prisma.documentoAlumno.create({
      data: {
        alumnoId,
        tipo,
        observaciones,
        archivos: {
          create: archivos.map((archivo) => ({
            nombreOriginal: archivo.originalname,
            nombreArchivo: archivo.filename,
            mimeType: archivo.mimetype,
            tamanioBytes: archivo.size,
            ruta: `/api/uploads/documentos-alumno/${archivo.filename}`,
          })),
        },
      },
      include: {
        archivos: true,
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async updateWithFiles(id, { tipo, observaciones }, archivos = []) {
    const data = {
      ...(tipo ? { tipo } : {}),
      ...(observaciones !== undefined ? { observaciones } : {}),
    };

    if (!archivos.length) {
      return this.prisma.documentoAlumno.update({
        where: { id },
        data,
        include: {
          archivos: true,
        },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const documento = await tx.documentoAlumno.update({
        where: { id },
        data,
        include: {
          archivos: true,
        },
      });

      await tx.documentoAlumnoArchivo.createMany({
        data: archivos.map((archivo) => ({
          documentoId: id,
          nombreOriginal: archivo.originalname,
          nombreArchivo: archivo.filename,
          mimeType: archivo.mimetype,
          tamanioBytes: archivo.size,
          ruta: `/api/uploads/documentos-alumno/${archivo.filename}`,
        })),
      });

      return {
        ...documento,
        archivos: [
          ...documento.archivos,
          ...archivos.map((archivo) => ({
            id: archivo.filename,
            nombreOriginal: archivo.originalname,
            nombreArchivo: archivo.filename,
            mimeType: archivo.mimetype,
            tamanioBytes: archivo.size,
            ruta: `/api/uploads/documentos-alumno/${archivo.filename}`,
            createdAt: new Date(),
            documentoId: id,
          })),
        ],
      };
    });
  }

  async softDelete(id) {
    return this.prisma.documentoAlumno.update({
      where: { id },
      data: {
        activo: false,
        estado: "RECHAZADO",
      },
      include: {
        archivos: true,
      },
    });
  }

  async updateEstado(id, estado) {
    return this.prisma.documentoAlumno.update({
      where: { id },
      data: { estado },
      include: {
        archivos: true,
      },
    });
  }
}
