# Catalogo unificado de estados de expediente

Fecha: 2026-11-03

Este catalogo define el conjunto oficial de fases de expediente de alumno.
Se usa en backend para resolver fase efectiva y en frontend para mostrar chips consistentes.

## Estados y criterio funcional

1. `PENDIENTE_MATRICULA`

- Matricula no pagada.

2. `ESTUDIANDO_TEORICO`

- Matricula pagada y aun sin solicitud teorica activa.

3. `PENDIENTE_EXAMEN_TEORICO`

- Solicitud teorica activa (`SOLICITADO`, `PROGRAMADO` o `PENDIENTE`).

4. `TEORICO_SUSPENSO`

- Ultimo resultado teorico final no apto/suspenso.

5. `TEORICO_APROBADO`

- Ultimo resultado teorico apto/aprobado y sin avance practico activo.

6. `REALIZANDO_CLASES_PRACTICAS_CIRCULACION`

- Teorico apto + existencia de clase de circulacion no cancelada.

7. `PENDIENTE_EXAMEN_PRACTICO_CIRCULACION`

- Solicitud practica activa de fase circulacion.

8. `PRACTICO_CIRCULACION_SUSPENSO`

- Ultimo resultado practico de circulacion no apto/suspenso/no presentado.

9. `PRACTICO_CIRCULACION_APROBADO`

- Solo licencias de doble fase (`A`, `A1`, `A2`, `C`, `D`, `E`):
  circulacion aprobada y pendiente fase pista.

10. `REALIZANDO_CLASES_PRACTICAS_PISTA`

- Solo doble fase:
  circulacion aprobada y existe clase de pista no cancelada.

11. `PENDIENTE_EXAMEN_PRACTICO_PISTA`

- Solo doble fase:
  solicitud practica activa de pista.

12. `PRACTICO_PISTA_SUSPENSO`

- Solo doble fase:
  resultado final no apto/suspenso/no presentado en pista.

13. `LICENCIA_OBTENIDA`

- Practico final apto/aprobado o expediente marcado como licencia obtenida.

## Paleta de color de chip

- `PENDIENTE_MATRICULA`: fondo `#FFDF20`, texto `#991b1b`, borde `#fca5a5`
- `ESTUDIANDO_TEORICO`: fondo `#fef9c3`, texto `#854d0e`, borde `#facc15`
- `PENDIENTE_EXAMEN_TEORICO`: fondo `#ffedd5`, texto `#9a3412`, borde `#fdba74`
- `TEORICO_SUSPENSO`: fondo `#fef2f2`, texto `#b91c1c`, borde `#fca5a5`
- `TEORICO_APROBADO`: fondo `#e0f2fe`, texto `#0c4a6e`, borde `#7dd3fc`
- `REALIZANDO_CLASES_PRACTICAS_CIRCULACION`: fondo `#ede9fe`, texto `#5b21b6`, borde `#c4b5fd`
- `PENDIENTE_EXAMEN_PRACTICO_CIRCULACION`: fondo `#fef3c7`, texto `#92400e`, borde `#fcd34d`
- `PRACTICO_CIRCULACION_SUSPENSO`: fondo `#fee2e2`, texto `#991b1b`, borde `#fca5a5`
- `PRACTICO_CIRCULACION_APROBADO`: fondo `#dbeafe`, texto `#1e3a8a`, borde `#93c5fd`
- `REALIZANDO_CLASES_PRACTICAS_PISTA`: fondo `#ede9fe`, texto `#5b21b6`, borde `#c4b5fd`
- `PENDIENTE_EXAMEN_PRACTICO_PISTA`: fondo `#fef3c7`, texto `#92400e`, borde `#fcd34d`
- `PRACTICO_PISTA_SUSPENSO`: fondo `#fee2e2`, texto `#991b1b`, borde `#fca5a5`
- `LICENCIA_OBTENIDA`: fondo `#dcfce7`, texto `#166534`, borde `#86efac`

## Implementacion

- Backend (regla unificada): `backend/src/shared/domain/expediente-phase.js`
- Backend (reglas por licencia): `backend/src/shared/domain/exam-license-rules.js`
- Frontend (metadatos chips + alias legacy): `frontend/src/utils/expedientePhase.js`
- Frontend (componente comun): `frontend/src/components/common/ExpedientePhaseChip.jsx`
