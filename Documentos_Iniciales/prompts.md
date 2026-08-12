
## Plan de Ruta para el Desarrollo (Fase 1)

```
Actúa como un Arquitecto de Software Senior y experto en Node.js. 
Necesito inicializar el backend de un proyecto para una autoescuela utilizando una arquitectura de Monolito Modular. 

Por favor, genera el código y los pasos para el "Paso 1: Diseño de Base de Datos y Servidor Inicial" siguiendo estas 
especificaciones exactas:

1. Configuración del Entorno y Servidor:
   - Crea un servidor básico con Express.js en JavaScript (ES6, usando "type": "module" en el package.json).
   - Configura middlewares esenciales: express.json() y CORS.
   - Define un punto de entrada en `src/server.js` y la configuración de Express en `src/app.js`.
   - Lee el puerto desde las variables de entorno (.env) con un fallback al puerto 5000.

2. Base de Datos y Prisma ORM:
   - Configura Prisma ORM para conectarse a una base de datos local de PostgreSQL.
   - Genera el archivo `prisma/schema.prisma` con el proveedor "postgresql".
   - Define los siguientes tres modelos con sus respectivas relaciones y restricciones:
     * Modelo 'Usuario': id (UUID, PK), nombre (String), email (String, único), passwordHash (String), rol 
	 (Enum: ADMIN, PROFESOR, ALUMNO), fechaCreacion (DateTime, default now).
     * Modelo 'Profesor': id (UUID, PK, mapeado al id de Usuario), licenciaConducir (String), telefono (String), 
	 activo (Boolean, default true). Relación 1:1 con Usuario.
     * Modelo 'Alumno': id (UUID, PK, mapeado al id de Usuario), tipoLicenciaObjetivo (String), 
	 horasPracticasCompletadas (Int, default 0), profesorAsignadoId (UUID, opcional). Relación 1:1 con Usuario y relación 1:N 
	 (muchos Alumnos a un Profesor).

Por favor, proporciona la estructura de archivos resultante, el código de los archivos principales (`app.js`, `server.js`, `schema.prisma`) 
y los comandos de terminal necesarios para instalar las dependencias e iniciar la primera migración de Prisma.
```


**Paso 2: API de Autenticación y CRUDs**

```
Actúa como un Arquitecto de Software Senior. Tomando como base el backend en Node.js, Express y Prisma que configuramos en el 
Paso 1, necesito que generes el código para el "Paso 2: API de Autenticación y CRUDs". 

Por favor, genera la estructura modular y el código siguiendo estas especificaciones:

1. Seguridad y Autenticación:
   - Instala y usa 'bcryptjs' para encriptar contraseñas y 'jsonwebtoken' para el manejo de JWT.
   - Crea un middleware de autenticación (`src/middlewares/authMiddleware.js`) que verifique el token JWT en los headers de las 
   peticiones (`Authorization: Bearer <token>`) y valide si el rol del usuario es 'ADMIN'.

2. Módulo de Autenticación (`src/modules/auth/`):
   - Ruta `POST /api/auth/login`: Debe permitir el inicio de sesión del Administrador (filtrando por email y verificando que su 
   rol sea ADMIN). Devuelve un token JWT válido si las credenciales coinciden.

3. Módulo de Profesores (`src/modules/profesores/`):
   - Implementa rutas CRUD completas bajo `/api/profesores`:
     * `POST /`: Crea un Usuario (con rol PROFESOR y contraseña encriptada) y su correspondiente registro en la tabla Profesor 
	 usando una transacción de Prisma.
     * `GET /`: Devuelve todos los profesores incluyendo sus datos de Usuario.
     * `GET /:id`: Devuelve un profesor específico por ID.
     * `PUT /:id`: Actualiza los datos del Profesor y su Usuario.
     * `DELETE /:id`: Elimina (o desactiva marcando activo: false) al Profesor y su Usuario.
   - Protege todas estas rutas con el middleware que verifica que el usuario sea ADMIN.

4. Módulo de Alumnos (`src/modules/alumnos/`):
   - Implementa rutas CRUD completas idénticas bajo `/api/alumnos` (crea Usuario con rol ALUMNO y su registro en Alumno).
   - Permite opcionalmente pasar un `profesorAsignadoId` al crear o editar.
   - Protege todas estas rutas con el middleware de ADMIN.

Por favor, organiza el código utilizando la estructura de Controladores y Rutas para cada módulo (ej. `profesor.controller.js` 
y `profesor.routes.js`). Además, incluye un ejemplo de archivo JSON listo para usar en Thunder Client o Postman para probar el 
Login y los POST de creación.

```

## 💡 Notas

<!--  Consejos para este paso en VS Code:
Abre el contexto: Antes de enviar el prompt en el panel de Copilot Chat, asegúrate de tener abiertos en tu editor los archivos 
schema.prisma, app.js y server.js del paso anterior. Copilot leerá automáticamente esos archivos abiertos como contexto para 
saber exactamente cómo se llaman tus tablas y campos (passwordHash, rol, etc.).

Instalación previa: Copilot te recordará que instales las librerías de autenticación, pero puedes adelantarte ejecutando en tu terminal:

Bash
npm install bcryptjs jsonwebtoken


Nota de control del proyecto: Al implementar este bloque de código tan importante, recuerda actualizar la versión en tu 
package.json y registrar la incorporación de la autenticación y los CRUDs en tu CHANGELOG.md siguiendo el formato Keep a Changelog. -->


**Paso 3: Frontend - Estructura y Autenticación**

```
Actúa como un Desarrollador Frontend Senior experto en React. Necesito inicializar el frontend de nuestro proyecto de gestión de 
autoescuela utilizando React con Vite y Tailwind CSS, enfocado en el "Paso 3: Frontend - Estructura y Autenticación".

Por favor, genera las instrucciones y el código basándote en los siguientes requerimientos:

1. Configuración Inicial (Comandos):
   - Proporcióname los comandos de terminal necesarios para crear un proyecto React con Vite (usando JavaScript/JSX), e instalar 
   Tailwind CSS junto con Axios para las peticiones HTTP.

2. Estructura de Carpetas:
   - Muestra cómo organizar la carpeta `src/` siguiendo una estructura limpia: `src/components/`, `src/context/`, `src/hooks/`, 
   `src/pages/`, `src/services/`.

3. Servicio de API (`src/services/api.js`):
   - Configura una instancia de Axios con una `baseURL` que apunte al backend (http://localhost:5000/api).
   - Añade un interceptor de peticiones para que, si existe un token en el LocalStorage, lo adjunte automáticamente en los headers 
   como `Authorization: Bearer <token>`.

4. Contexto de Autenticación (`src/context/AuthContext.jsx`):
   - Crea un `AuthContext` y un `AuthProvider` que gestione el estado global del usuario autenticado.
   - Debe incluir una función `login(email, password)` que llame al endpoint del backend, guarde el token JWT y los datos del 
   usuario en el LocalStorage, y actualice el estado.
   - Debe incluir una función `logout()` que limpie el LocalStorage y el estado.

5. Vista de Login (`src/pages/Login.jsx`):
   - Crea una pantalla de inicio de sesión atractiva y limpia utilizando únicamente clases de Tailwind CSS.
   - Debe contener un formulario con campos para Email y Contraseña, manejo de estados locales, control de errores (si las 
   credenciales son incorrectas) y una redirección simulada al Dashboard al tener éxito utilizando el AuthContext.

Por favor, proporciona el código estructurado de estos archivos principales de forma clara y modular.

```
## 💡 Notas

<!-- Consejos para este paso en VS Code:
Creación del proyecto: Recuerda que para este paso lo ideal es situarte en la carpeta raíz de tu proyecto general y abrir una terminal. 
Copilot te dirá que ejecutes comandos como npm create vite@latest frontend -- --template react para generar la carpeta independiente del 
front-end.

Uso de Copilot en los archivos: Una vez que tengas la estructura creada por los comandos, puedes abrir el archivo vacío AuthContext.jsx o 
Login.jsx y usar Ctrl + I (o Cmd + I) escribiendo un pequeño recordatorio como: Genera el AuthContext según las especificaciones del prompt 
anterior para que te lo escriba directamente en el archivo actual.

Nota de control del proyecto: Al inicializar el frontend e instalar nuevas dependencias, asegúrate de actualizar la versión en el 
package.json correspondiente de esta carpeta y dejar constancia de la creación de la interfaz de login en tu CHANGELOG.md siguiendo 
el formato Keep a Changelog. -->



**Paso 4: Frontend - Vistas de Gestión**

```
Actúa como un Desarrollador Frontend Senior experto en React y Tailwind CSS. Basándote en el proyecto de la autoescuela y el 
'AuthContext' / servicio de 'Axios' que creamos en el paso anterior, necesito que generes el código para el 
"Paso 4: Frontend - Vistas de Gestión".

Por favor, proporciona el código estructurado y modular para los siguientes componentes y páginas:

1. Componente Modal Reutilizable (`src/components/Modal.jsx`):
   - Un componente de modal genérico y accesible que acepte las propiedades 'isOpen', 'onClose' y 'children'. Diseñado con 
   Tailwind CSS (fondo oscuro traslúcido, centrado y animado).

2. Página de Gestión de Profesores (`src/pages/Profesores.jsx`):
   - Una vista completa que incluya:
     * Un estado para almacenar la lista de profesores traída desde el backend (`GET /api/profesores`) usando Axios al cargar 
	 la página (useEffect).
     * Una tabla interactiva y limpia con Tailwind que muestre: Nombre, Email, Licencia, Teléfono, Estado (Activo/Inactivo) y 
	 una columna de 'Acciones' (Botones de Editar y Eliminar).
     * Un botón principal "Añadir Profesor" que abra el Modal con un formulario.
     * Un formulario dentro del modal que sirva tanto para Crear (`POST`) como para Editar (`PUT`) un profesor (debe incluir 
	 campos de Nombre, Email, Contraseña, Licencia y Teléfono).
     * Lógica para eliminar/desactivar (`DELETE /api/profesores/:id`) tras confirmar la acción.

3. Página de Gestión de Alumnos (`src/pages/Alumnos.jsx`):
   - Una vista idéntica en estructura a la de profesores pero adaptada para Alumnos:
     * Tabla interactiva que muestre: Nombre, Email, Tipo de Licencia Objetivo, Horas Prácticas y Profesor Asignado.
     * Formulario en modal para Crear/Editar alumnos con los campos correspondientes.
     * Al cargar la página, también debe hacer un `GET` a profesores para llenar un campo de selección (`<select>`) en el 
	 formulario, permitiendo asignar un profesor al alumno de forma interactiva.

4. Componente de Navegación/Dashboard (`src/components/Sidebar.jsx` o `Navbar.jsx`):
   - Un menú lateral o barra superior de navegación simple para que el Administrador pueda alternar fácilmente entre la vista 
   de "Profesores" y "Alumnos", además de incluir el botón de "Cerrar Sesión" (usando el logout del AuthContext).

Por favor, genera el código de estos archivos asegurando el manejo de estados de carga (loading), manejo de errores si la API 
falla, y la actualización del estado local de React tras crear, editar o eliminar un registro para que la tabla se refresque automáticamente.

```

## 💡 Notas

<!-- Consejos para este paso final en VS Code:
Mantén el contexto abierto: Al igual que en el paso 2, te sugiero tener abierto en pestañas de VS Code tu archivo 
src/services/api.js (donde configuraste Axios) y tu AuthContext.jsx. Copilot usará esa información para saber exactamente 
cómo importar las funciones y cómo se llama tu instancia de Axios para hacer las peticiones api.get, api.post, etc.

Despliegue incremental: Si notas que el panel de chat te da un código demasiado largo y se corta, puedes pedirle a Copilot por 
partes: "Primero genérame solo el componente Profesores.jsx con su tabla y peticiones GET" y luego "Ahora genérame el formulario 
de inserción dentro del modal para ese mismo componente".

Nota de control del proyecto: Al implementar estas vistas visuales y flujos de datos completos, recuerda actualizar la versión 
en el package.json de tu frontend y dejar constancia de estas nuevas características en tu CHANGELOG.md siguiendo el 
formato Keep a Changelog.