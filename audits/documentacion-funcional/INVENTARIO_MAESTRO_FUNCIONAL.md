# INVENTARIO MAESTRO FUNCIONAL

## 1. Objeto y alcance

Este inventario consolida el estado funcional global de la aplicacion
desde la evidencia de implementacion real (codigo + esquema + rutas + pantallas).

Fecha de corte: 2026-11-03.

---

## 2. Fuentes de evidencia principal

1. backend:
   - `backend/src/app.js`
   - `backend/src/features/*`
   - `backend/src/shared/*`
2. base de datos:
   - `backend/prisma/schema.prisma`
3. frontend:
   - `frontend/src/routes/AppRouter.jsx`
   - `frontend/src/components/layout/Sidebar.jsx`
   - `frontend/src/pages/*`
   - `frontend/src/services/*`
4. pruebas:
   - `backend/src/**/__tests__/*.test.js`
   - `frontend/src/pages/Temarios/__tests__/*.test.jsx`

---

## 3. Metodo de trabajo

1. identificar modulos realmente montados y consumidos
2. cruzar rutas con servicios y modelos
3. clasificar cobertura funcional:
   - Implementada
   - Parcial
   - Pendiente
4. reportar gaps de exposicion o trazabilidad

---

## 4. Catalogo maestro de cobertura funcional

| Dominio | Backend | Frontend | Datos | Estado |
|---|---|---|---|---|
| Autenticacion y acceso | Si | Si | Si | Implementada |
| Usuarios operativos y roles | Si | Si | Si | Implementada |
| Alumnos | Si | Si | Si | Implementada |
| Profesores | Si | Si | Si | Implementada |
| Vehiculos | Si | Si | Si | Implementada |
| Clases practicas y reservas | Si | Si | Si | Implementada |
| Hojas de ruta | Si | Si | Si | Implementada |
| Examenes y solicitudes | Si | Si | Si | Implementada |
| Convocatorias de examen | Si | Si | Si | Implementada |
| Convocatorias teoricas (submodulo) | Si (feature) | No directo | Si | Parcial |
| Temarios y progreso | Si | Si | Si | Implementada |
| Test DGT | Si | Si | Si | Implementada |
| Bonos y promociones | Si | Si | Si | Implementada |
| Matriculas y tarifas | Si | Si | Si | Implementada |
| Pagos y facturas | Si | Si | Si | Implementada |
| Gastos combustible | Si | Si | Si | Implementada |
| Nominas | Si | Si | Si | Implementada |
| Dashboard e informes | Si | Si | Si | Implementada |
| Notificaciones | Si | Si | Si | Implementada |

---

## 5. Observaciones de cobertura

### 5.1 Cobertura fuerte

- dominio academico-economico principal
- control de roles y seguridad por endpoint
- expediente y fases practicas por licencia
- trazabilidad de pago/factura y notificaciones

### 5.2 Cobertura media

- procesos batch tecnicos de evaluacion (presentes, documentacion funcional resumida)
- detalle documental fino de autorizaciones endpoint a endpoint

### 5.3 Cobertura pendiente

- activar/integrar plenamente `convocatorias-teorico` en API principal
- ampliar pruebas frontend fuera del modulo temarios

---

## 6. Estado de implementacion por dimension

### 6.1 Backend

**Madurez alta.**
Arquitectura por capas estable (`routes -> controller -> service -> repository`),
con modulos amplios y testeo por capas en gran parte del dominio.
Estado de suite validado: 81 archivos / 689 tests en verde (2026-11-03).

### 6.2 Frontend

**Madurez media-alta.**
Cobertura funcional extensa en pantallas y navegacion por rol.
Pruebas automatizadas aun concentradas en temarios.
Validacion tecnica: tests frontend en verde y build de produccion correcto (2026-11-03).

### 6.3 Permisos

**Madurez alta.**
Autenticacion JWT + autorizacion por rol en rutas protegidas.
Normalizacion de rol legado `GESTOR -> SOPORTE`.

### 6.4 Reglas de negocio

**Madurez alta.**
Reglas de matricula, expediente, solicitudes, pagos/facturas y ownership
estan aplicadas en servicios y soportadas por modelo de datos.

---

## 7. Prioridades de mantenimiento

1. cerrar brecha de exposicion de `convocatorias-teorico`
2. ampliar automatizacion de pruebas frontend por modulos criticos
3. mantener sincronia estricta entre:
   - `BUSINESS_RULES.md`
   - `DOMAIN_MODEL.md`
   - `FUNCTIONAL_SPECIFICATION.md`
   - `BR_TRACEABILITY_INDEX.md`

---

## 8. Conclusion del inventario

El sistema presenta un nivel de implementacion funcional solido
para operativa real de autoescuela, con la mayor parte del dominio activa.
Los pendientes actuales son acotados y no comprometen el nucleo operativo.
