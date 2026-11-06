# FUNCTIONAL_SPECIFICATION.md

## Estado del documento

- ultima revision: 2026-11-03
- base: comportamiento real implementado y rutas activas
- validacion asociada: backend tests en verde (689/689) y frontend build correcto

---

# 1. Alcance actual del sistema

El sistema cubre:

- autenticacion, activacion y primer acceso
- gestion de usuarios operativos y roles
- ciclo completo de alumno (matricula, teoria, practicas, examenes)
- gestion de activos (profesores, vehiculos)
- gestion economica (tarifas, pagos, facturas, bonos, promociones, nominas)
- trazabilidad operativa (hojas de ruta, notificaciones, dashboards, informes)

---

# 2. Actor principal: Administrador

## 2.1 Autenticacion y acceso

- login por credenciales
- sesion con JWT
- acceso a panel de administracion por rol

## 2.2 Gestion de usuarios

- alta/edicion/baja logica de usuarios operativos
- reseteo de password con auditoria
- gestion de roles con permisos de backend

## 2.3 Gestion de alumnos

- alta y mantenimiento de expediente
- asignacion/reasignacion de profesor
- seguimiento de estado de expediente
- acceso a documentos y trazabilidad asociada

## 2.4 Gestion de profesores

- mantenimiento de datos y disponibilidad
- gestion de permisos/licencias
- consulta de alumnos asignados

## 2.5 Gestion de vehiculos

- alta y mantenimiento de flota
- activacion/desactivacion
- carga de imagen (opcional)

## 2.6 Gestion de clases practicas

- planificacion/edicion/cancelacion
- control de disponibilidad y estado
- integracion con pagos y hoja de ruta

## 2.7 Gestion de examenes

- gestion de examenes y convocatorias
- evaluacion de solicitudes teoricas/practicas
- control de fases practicas (circulacion/pista)

## 2.8 Dashboard ejecutivo

- metricas de estado general
- visibilidad segmentada por rol

## 2.9 Gestion economica y administrativa

- matriculas, tarifas, promociones y bonos
- pagos, facturas y descarga de PDF
- gastos de combustible y nominas
- informes operativos

---

# 3. Actor: Administrativo

## Funciones implementadas

- acceso a dashboard administrativo
- gestion de alumnos, profesores y vehiculos
- gestion de tarifas/promociones/bonos
- gestion de convocatorias, examenes y facturacion
- consulta de nominas e informes
- acceso a notificaciones

## Restricciones

- no dispone de todas las acciones exclusivas de `ADMIN` en usuarios de soporte

---

# 4. Actor: Soporte

## Funciones implementadas

- acceso a dashboard de soporte
- gestion de usuarios operativos permitidos
- seguimiento de notificaciones

## Restricciones

- acceso funcional reducido respecto a admin/administrativo

---

# 5. Actor: Profesor

## Funciones implementadas

- dashboard de profesor
- agenda y clases practicas asignadas
- consulta de alumnos asignados
- hoja de ruta de clases
- consulta de vehiculos relevantes
- gestion/consulta de gastos y nominas
- notificaciones

---

# 6. Actor: Alumno

## Funciones implementadas

- dashboard de alumno
- acceso a documentos propios
- pago de matricula y pagos propios
- consulta de facturas propias
- temario y test DGT
- reserva/seguimiento de clases y hojas de ruta
- solicitudes de examen teorico/practico
- acceso a notificaciones

## Comportamiento dinamico

El menu de alumno cambia segun:

- matricula pagada/no pagada
- teorico apto historico
- licencia obtenida

---

# 7. Funcionalidad general del sistema actual

## 7.1 Login

Flujo actual:

1. credenciales validas
2. generacion de token JWT
3. carga de interfaz segun rol

## 7.2 Primer acceso

Si `requiereCambioPassword = true`:

- se fuerza cambio de password
- se bloquea navegacion funcional hasta completar el cambio

## 7.3 Mantenimiento de entidades

Patron CRUD con validaciones en backend para:

- alumnos
- profesores
- vehiculos
- temarios
- examenes/solicitudes
- bonos/promociones/tarifas

## 7.4 Proteccion por roles

Toda ruta protegida valida:

1. autenticacion (token)
2. autorizacion (rol permitido)
3. ownership cuando aplica (ej. pagos/facturas de alumno)

---

# 8. Funcionalidades con implementacion parcial o no expuesta

## 8.1 Convocatorias teoricas

El feature backend existe, pero actualmente no esta montado en `app.js`.

## 8.2 Cobertura de tests frontend

Cobertura ampliada (2026-11-06) con pruebas funcionales en `temarios`,
`test-dgt`, `agendas`, `account-activation` y `pagos`.
Sigue pendiente ampliacion transversal al resto de modulos.

## 8.3 Matriz documental de permisos fina

Permisos reales existen en rutas; la documentacion puede seguir detallandose endpoint a endpoint.

---

# 9. Matriz funcional resumida (estado)

| Area | Estado |
|---|---|
| Autenticacion y roles | Implementada |
| Gestion academica nucleo | Implementada |
| Solicitudes/evaluaciones de examen | Implementada |
| Expediente unificado | Implementada |
| Gestion economica principal | Implementada |
| Notificaciones y dashboards | Implementada |
| Convocatorias teoricas (exposicion API principal) | Parcial/Pendiente |
| Testing frontend global | Parcial |

---

# 10. Conclusion

La especificacion funcional real muestra un sistema amplio y operativo para una autoescuela,
con especial madurez en backend y en procesos academico-economicos.
Los principales pendientes actuales se concentran en exposicion parcial de algun modulo
y en aumentar la cobertura automatizada del frontend.
