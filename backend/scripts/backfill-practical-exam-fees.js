import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { generateFacturaNumber } from "../src/shared/utils/factura-number.js";

const HOJAS_RUTA_REQUERIDAS = 5;

const normalizarLicencia = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase() || "B";

const generarNumeroFacturaPago = (attempt = 0) =>
  generateFacturaNumber(attempt);

const findTarifaPractica = (tx, permiso) =>
  tx.tarifaConcepto.findFirst({
    where: {
      permiso,
      activa: true,
      tipo: "POR_EXAMEN",
      OR: [
        {
          concepto: {
            contains: "practico",
            mode: "insensitive",
          },
        },
        {
          concepto: {
            contains: "práctico",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

async function run() {
  const alumnos = await prisma.alumno.findMany({
    select: {
      id: true,
      tipoLicenciaObjetivo: true,
    },
  });

  let pagosCreados = 0;
  let facturasEmitidas = 0;
  let solicitudesVinculadas = 0;

  for (const alumno of alumnos) {
    await prisma.$transaction(async (tx) => {
      const matriculaPagada = await tx.matricula.findFirst({
        where: {
          alumnoId: alumno.id,
          estado: "PAGADA",
        },
        orderBy: {
          fechaPago: "desc",
        },
      });

      if (!matriculaPagada) {
        return;
      }

      const hojasRegistradas = await tx.hojaRuta.count({
        where: {
          alumnoId: alumno.id,
          estado: "REGISTRADA",
          clasePractica: {
            isNot: null,
          },
        },
      });

      const permiso = normalizarLicencia(matriculaPagada.licencia);

      if (hojasRegistradas >= HOJAS_RUTA_REQUERIDAS) {
        const pendingOrPaid = await tx.pago.findFirst({
          where: {
            alumnoId: alumno.id,
            permiso,
            tipo: "EXAMEN_PRACTICO_GASTOS",
            estado: {
              in: ["PENDIENTE", "PAGADO"],
            },
          },
        });

        if (!pendingOrPaid) {
          const tarifa = await findTarifaPractica(tx, permiso);

          if (!tarifa) {
            return;
          }

          let attempt = 0;
          while (attempt < 3) {
            const numeroFactura = generarNumeroFacturaPago(attempt);

            try {
              await tx.pago.create({
                data: {
                  alumnoId: alumno.id,
                  matriculaId: matriculaPagada.id,
                  tipo: "EXAMEN_PRACTICO_GASTOS",
                  concepto: tarifa.concepto,
                  permiso,
                  importe: tarifa.precio,
                  estado: "PENDIENTE",
                  convocatoriasIncluidas: 0,
                  convocatoriasConsumidas: 0,
                  numeroFacturaPago: numeroFactura,
                },
              });

              await tx.factura.create({
                data: {
                  numero: numeroFactura,
                  alumnoId: alumno.id,
                  matriculaId: matriculaPagada.id,
                  concepto: tarifa.concepto,
                  baseImponible: tarifa.precio,
                  descuento: 0,
                  total: tarifa.precio,
                  estado: "EMITIDA",
                },
              });

              pagosCreados += 1;
              facturasEmitidas += 1;
              break;
            } catch (error) {
              if (error?.code !== "P2002" || attempt === 2) {
                throw error;
              }

              attempt += 1;
            }
          }
        }
      }

      const solicitudesSinPago = await tx.solicitudExamen.findMany({
        where: {
          alumnoId: alumno.id,
          tipo: "PRACTICO",
          estado: {
            in: ["APTO", "NO_APTO", "NO_PRESENTADO", "CANCELADO"],
          },
          pagoGastoPracticoId: null,
        },
        orderBy: {
          fechaProgramada: "asc",
        },
      });

      if (solicitudesSinPago.length === 0) {
        return;
      }

      const pagosPagados = await tx.pago.findMany({
        where: {
          alumnoId: alumno.id,
          permiso,
          tipo: "EXAMEN_PRACTICO_GASTOS",
          estado: "PAGADO",
        },
        orderBy: [{ fechaPago: "asc" }, { fechaCreacion: "asc" }],
      });

      if (pagosPagados.length === 0) {
        return;
      }

      const usados = new Set(
        (
          await tx.solicitudExamen.findMany({
            where: {
              tipo: "PRACTICO",
              pagoGastoPracticoId: {
                in: pagosPagados.map((p) => p.id),
              },
            },
            select: {
              pagoGastoPracticoId: true,
            },
          })
        )
          .map((row) => row.pagoGastoPracticoId)
          .filter(Boolean),
      );

      for (const solicitud of solicitudesSinPago) {
        const pagoDisponible = pagosPagados.find((p) => !usados.has(p.id));

        if (!pagoDisponible) {
          break;
        }

        await tx.solicitudExamen.update({
          where: {
            id: solicitud.id,
          },
          data: {
            pagoGastoPracticoId: pagoDisponible.id,
          },
        });

        usados.add(pagoDisponible.id);
        solicitudesVinculadas += 1;
      }
    });
  }

  console.log("Backfill gasto examen practico completado");
  console.log(`- Pagos creados: ${pagosCreados}`);
  console.log(`- Facturas emitidas: ${facturasEmitidas}`);
  console.log(`- Solicitudes historicas vinculadas: ${solicitudesVinculadas}`);
}

run()
  .catch((error) => {
    console.error("Error en backfill de gasto examen practico:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
