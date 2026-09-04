export class PreguntasDGTRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.preguntaDGT.create({
      data,
      include: {
        respuestas: true,
      },
    });
  }

  async findAll() {
    return this.prisma.preguntaDGT.findMany({
      include: {
        respuestas: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.preguntaDGT.findUnique({
      where: {
        id,
      },
      include: {
        respuestas: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.preguntaDGT.update({
      where: {
        id,
      },
      data,
      include: {
        respuestas: true,
      },
    });
  }

  async delete(id) {
    return this.prisma.preguntaDGT.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.preguntaDGT.update({
      where: {
        id,
      },
      data: {
        activa: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.preguntaDGT.update({
      where: {
        id,
      },
      data: {
        activa: false,
      },
    });
  }

  async getRandomQuestions(licencia, cantidad) {
    const preguntas = await this.prisma.preguntaDGT.findMany({
      where: {
        activa: true,

        licencia: {
          has: licencia,
        },
      },

      include: {
        respuestas: true,
      },
    });

    return preguntas.sort(() => Math.random() - 0.5).slice(0, cantidad);
  }

  async saveExamResult(data) {
    return this.prisma.examenDGTAlumno.create({
      data,
    });
  }

  async getHistorialAlumno(alumnoId) {
    return this.prisma.examenDGTAlumno.findMany({
      where: {
        alumnoId,
      },

      orderBy: {
        fecha: "desc",
      },
    });
  }
}
