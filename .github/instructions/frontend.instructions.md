# Frontend Instructions

Estas instrucciones solo aplican a React y Vite.

## Arquitectura

Mantener estructura actual:

pages/
services/
components/
layouts/
routes/
utils/

## Llamadas API

Todas las llamadas HTTP deben realizarse mediante:

services/\*.js

No realizar llamadas Axios directamente dentro de componentes.

## Componentes

Mantener:

- React Functional Components
- Hooks
- useState
- useEffect

## Formularios

Mantener patrón actual:

- Estado local con useState.
- Validaciones antes de guardar.
- Snackbar para errores.

## Páginas CRUD

Seguir el patrón existente:

- DataGrid
- Botón Nuevo
- Dialog Alta
- Dialog Edición
- Dialog Confirmación
- Snackbar
- Alert

## Tablas

Utilizar:

DataGrid de MUI

como componente estándar.

## Estado

No introducir Redux nuevo.

Usar el patrón ya implementado en cada módulo.

## Navegación

Mantener React Router existente.

No cambiar rutas actuales sin necesidad.

## Diseño

Mantener coherencia visual del proyecto.

No introducir nuevas librerías UI.

Material UI es obligatorio.
