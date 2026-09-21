# Protocolo interno - Secretaria

## Objeto

Establecer el flujo obligatorio para gestionar renovaciones de expediente cuando el alumno agota los 2 suspensos cubiertos por la Tasa DGT 2.1.

## Alcance

Aplica a permisos A1, A2, A, B, C, D y E.

## Regla base

Sin nueva Tasa DGT 2.1 pagada no se tramita nueva solicitud.

## Seguimiento operativo (2026-09-21)

Version documental: `v2026.09.21`

Avance:

- El proyecto ya incorpora componentes de renovacion en procesos teoricos/practicos y reglas por licencia en la capa de datos y scripts operativos.
- El protocolo sigue vigente como guia de ejecucion administrativa y control manual de casos.

Pendiente por completar:

- Integrar checklist del protocolo en flujo asistido dentro de interfaz para reducir dependencia de control manual.
- Registrar de forma estandarizada evidencia de cada revision (fecha, operador, bloqueo, desbloqueo) en un historico consultable.
- Conectar los bloqueos de renovacion con notificaciones automáticas al alumno y al equipo interno.

## Procedimiento operativo

1. Identificar alumno y permiso objetivo.
2. Verificar si la cobertura de Tasa DGT esta agotada.
3. Verificar si existe un nuevo pago de Tasa DGT 2.1 para ese permiso.
4. Verificar reglas de renovacion aplicables por licencia:
   - dias de espera
   - clases practicas obligatorias
5. Si cumple todo, tramitar solicitud y registrar observacion.
6. Si no cumple, informar requisitos pendientes y fecha estimada de desbloqueo.

## Mensaje estandar al alumno

Has agotado las convocatorias incluidas en tu Tasa DGT 2.1. Para volver a examen debes completar la renovacion de expediente: nueva tasa, plazo y clases obligatorias segun tu permiso.

## Registro obligatorio en observaciones

- Fecha de revision
- Permiso objetivo
- Estado del nuevo pago de tasa
- Cumplimiento de dias de espera
- Cumplimiento de clases obligatorias
- Proxima accion y fecha

## Criterio de escalado a jefatura

Escalar cuando:

- exista discrepancia documental
- se solicite excepcion
- haya conflicto entre calendario y requisitos
