# Catalogo unificado de estados de expediente

Fecha: 2026-09-28

Este catalogo define un unico conjunto de fases para el expediente de alumno.
Se usa en backend para calcular el estado y en frontend para pintar chips con el mismo color en todas las vistas.

## Estados y criterio funcional

1. `PENDIENTE_MATRICULA`

- Matricula no pagada.

2. `ESTUDIANDO_TEORICO`

- Matricula pagada y aun no ha solicitado fecha de examen teorico.

3. `PENDIENTE_EXAMEN_TEORICO`

- Solicitud teorica activa (solicitado/programado/pendiente).

4. `TEORICO_SUSPENSO`

- Ultimo resultado teorico final en estado no apto/suspenso.

5. `TEORICO_APROBADO`

- Ultimo resultado teorico en apto.

6. `PREPARANDO_PRACTICO`

- Teorico apto y con al menos una clase practica programada o confirmada.

7. `PENDIENTE_EXAMEN_PRACTICO`

- Solicitud practica activa (solicitado/programado/pendiente).

8. `PRACTICO_SUSPENSO`

- Ultimo resultado practico final en no apto/suspenso.

9. `LICENCIA_OBTENIDA`

- Resultado practico apto o expediente marcado como licencia obtenida.

## Paleta de color de chip

- `PENDIENTE_MATRICULA`: fondo `#fee2e2`, texto `#991b1b`, borde `#fca5a5`
- `ESTUDIANDO_TEORICO`: fondo `#fef9c3`, texto `#854d0e`, borde `#facc15`
- `PENDIENTE_EXAMEN_TEORICO`: fondo `#ffedd5`, texto `#9a3412`, borde `#fdba74`
- `TEORICO_SUSPENSO`: fondo `#fef2f2`, texto `#b91c1c`, borde `#fca5a5`
- `TEORICO_APROBADO`: fondo `#e0f2fe`, texto `#0c4a6e`, borde `#7dd3fc`
- `PREPARANDO_PRACTICO`: fondo `#ede9fe`, texto `#5b21b6`, borde `#c4b5fd`
- `PENDIENTE_EXAMEN_PRACTICO`: fondo `#fef3c7`, texto `#92400e`, borde `#fcd34d`
- `PRACTICO_SUSPENSO`: fondo `#fee2e2`, texto `#991b1b`, borde `#fca5a5`
- `LICENCIA_OBTENIDA`: fondo `#dcfce7`, texto `#166534`, borde `#86efac`

## Implementacion

- Backend (regla unificada): `backend/src/shared/domain/expediente-phase.js`
- Frontend (meta de color + labels): `frontend/src/utils/expedientePhase.js`
- Componente global chip: `frontend/src/components/common/ExpedientePhaseChip.jsx`
