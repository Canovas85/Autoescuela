# Sistema de Gesti¨®n para Autoescuela (AutoDrive Admin)

Este es un proyecto Full-Stack dise?ado para la Gesti¨®n interna de una autoescuela, enfocado inicialmente en permitir que el administrador 
pueda gestionar (CRUD) profesores y alumnos de forma eficiente.

## Arquitectura del Proyecto

El proyecto sigue una **Arquitectura Cliente-Servidor Desacoplada (Monolito Modular en el Backend)** 
para facilitar el desarrollo independiente, la escalabilidad inicial y una curva de aprendizaje ¨®ptima para desarrolladores Junior.

```
[ Frontend: React + Vite ] <--- HTTP / REST API ---> [ Backend: Node.js + Express ]
                                                               |
                                                       [ Base de Datos: PostgreSQL ]
```

### Componentes de la Arquitectura
1. **Frontend (Capa de Presentaci¨®n):** Aplicaci¨®n de p¨¢gina ¨²nica (SPA) que consume la API REST del backend.
2. **Backend (Capa de Negocio):** Servidor API RESTful encargado de la autenticaci¨®n, validaci¨®n de datos y l¨®gica de negocio. Estructurado por componentes/m¨®dulos (auth, profesores, alumnos).
3. **Base de Datos (Capa de Datos):** Base de datos relacional para garantizar la consistencia de los datos mediante claves for¨¢neas y restricciones.

---

## Tecnologias Recomendadas

** A?ADIDO

## TDD - MANDATORY

<!-- En el mundo del software, TDD significa Test-Driven Development (en espa?ol: Desarrollo Guiado por Pruebas).
B¨¢sicamente, es una metodolog¨ªa o filosof¨ªa de dise?o de software donde escribes las pruebas autom¨¢ticas antes de 
escribir el c¨®digo funcional. 

El Ciclo Red - Green - Refactor
TDD se basa en un mantra o ciclo repetitivo muy corto y estricto de tres pasos:

1. ?? Red (Rojo)
Escribes una prueba unitaria para una funcionalidad que a¨²n no existe. Al ejecutar la prueba, esta debe fallar 
(porque el c¨®digo base todav¨ªa no hace lo que la prueba pide).

?Por qu¨¦ importa? Te asegura que la prueba realmente est¨¢ evaluando algo real y que fallar¨¢ si el c¨®digo se rompe en el futuro.

2. ?? Green (Verde)
Escribes la m¨ªnima cantidad de c¨®digo necesaria para que la prueba pase (se ponga en verde). 
No importa si el c¨®digo no es el m¨¢s elegante o el m¨¢s ¨®ptimo en este punto; el ¨²nico objetivo es que la prueba deje de fallar.

3. ?? Refactor (Refactorizar)
Ahora que el c¨®digo funciona y est¨¢s a salvo con tu prueba en verde, limpias el c¨®digo. Eliminas duplicados, 
mejoras los nombres de las variables, aplicas buenas pr¨¢cticas y lo haces mantenible.

La regla de oro: Vuelves a ejecutar la prueba. Si sigue en verde, significa que mejoraste el dise?o sin romper la funcionalidad.

EJEMPLO RAPIDO PARA VISUALIZARLO
Imagina que te piden una funci¨®n para sumar dos n¨²meros:

Rojo: Escribes una prueba que dice: deberia_retornar_4_cuando_sume_2_y_2(). Como la funci¨®n sumar ni siquiera existe, la prueba falla.

Verde: Creas la funci¨®n sumar(a, b) y haces que retorne 4 (literalmente, puedes hardcodearlo si es lo m¨ªnimo para que pase). La prueba pasa.

Refactor: Cambias el c¨®digo hardcodeado por return a + b. Vuelves a correr la prueba, sigue pasando. ?Listo! -->

1. Write test FIRST ¡ú run ¡ú MUST FAIL
2. Implement MINIMUM code to pass
3. Refactor keeping tests green

## File Organization (Scope Rule)

- `src/shared/` ¡ú used by multiple features
- `src/features/X/` ¡ú specific to one feature

** FIN A?ADIDO

## Stack

### Frontend
- **Framework:** **React.js** (con **Vite** como empaquetador por su velocidad y ligereza).
- **Lenguaje:** **JavaScript (ES6+)** o **TypeScript** (opcional, para tipado est¨¢tico).
- **Estilos y Componentes:** **Tailwind CSS** (para un dise?o r¨¢pido y responsivo) junto con **shadcn/ui** o **Chakra UI** para componentes de tabla y formularios listos para usar.
- **Gesti¨®n de Estado y Peticiones:** **Axios** o **Fetch API** junto con **TanStack Query (React Query)** para el manejo eficiente del estado del servidor y cach¨¦.

### Backend
- **Entorno de Ejecuci¨®n:** **Node.js**.
- **Framework Web:** **Express.js** (minimalista, flexible y con la comunidad m¨¢s grande para resolver dudas).
- **Autenticaci¨®n:** **JSON Web Tokens (JWT)** junto con **bcryptjs** para el hashing de contrase?as de administradores y profesores.
- **Validaci¨®n:** **Zod** o **Joi** para asegurar que los datos que entran a la API sean correctos.

### Base de Datos & Herramientas
- **Motor de BD:** **PostgreSQL** (Relacional, ideal para la estructura estricta de alumnos vinculados a profesores/clases).
- **ORM:** **Prisma** o **Sequelize** (Prisma es altamente recomendado por su autocompletado y facilidad para migrar datos).

---

## Modelo de Datos Inicial (Esquema Relacional)

### 1. Tabla: `Usuarios` (Base para Roles)
- `id` (UUID, PK)
- `nombre` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `rol` (ENUM: 'admin', 'profesor', 'alumno')
- `fecha_creacion` (TIMESTAMP)

### 2. Tabla: `Profesores`
- `id` (UUID, PK, FK -> Usuarios.id)
- `licencia_conducir` (VARCHAR)
- `telefono` (VARCHAR)
- `activo` (BOOLEAN)

### 3. Tabla: `Alumnos`
- `id` (UUID, PK, FK -> Usuarios.id)
- `profesor_asignado_id` (UUID, FK -> Profesores.id, NULLABLE)
- `tipo_licencia_objetivo` (VARCHAR, ej: 'B', 'A2')
- `horas_practicas_completadas` (INTEGER)

---

## Estructura de Carpetas Sugerida

### Backend (`/backend`)
```
©À©¤©¤ src/
©À  ©À©¤©¤ config/          # Conexi¨®n a BD y variables de entorno
©À  ©À©¤©¤ middlewares/     # Autenticaci¨®n (authMiddleware), manejo de errores
©À  ©À©¤©¤ modules/         # M¨®dulos de negocio (Estructura modular)
©À  ©À ©À©¤©¤ auth/
©À  ©À ©À©¤©¤ profesores/
©À  ©À ©À ©À©¤©¤ profesor.controller.js
©À  ©À ©À ©À©¤©¤ profesor.routes.js
©À  ©À ©À ©À©¤©¤ profesor.service.js
©À  ©À ©À©¤©¤ alumnos/
©À  ©À prisma/          # Esquemas y migraciones (si usas Prisma)
©À  ©À app.js           # Configuraci¨®n de Express
©À  ©À server.js        # Punto de entrada del servidor
©À .env
©À package.json
©À README.md
```

### Frontend (`/frontend`)
```
©À©¤©¤ src/
©¦ ©À©¤©¤ assets/          # Im¨¢genes y logos
©¦ ©À©¤©¤ components/      # Componentes comunes reutilizables (Botones, Inputs)
©¦ ©À©¤©¤ context/         # Contexto global (ej. AuthContext para login)
©¦ ©À©¤©¤ hooks/           # Custom hooks para peticiones (useProfesores, useAlumnos)
©¦ ©À©¤©¤ pages/           # Vistas de la aplicaci¨®n (Dashboard, Login, Profesores, Alumnos)
©¦ ©À©¤©¤ services/        # Configuraci¨®n de Axios y llamadas a la API
©¦ ©À©¤©¤ App.jsx
©¦ ©À©¤©¤ main.jsx
©À©¤©¤ tailwind.config.js
©À©¤©¤ package.json
©À©¤©¤ README.md
```

** A?ADIDO

## Critical Configurations

### tsconfig.app.json

```json
{ "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**"] }
```

NEVER use `allowExportNames` workaround.

<!-- En el desarrollo de software (especialmente cuando trabajas con JavaScript, TypeScript o frameworks como Next.js), 
este mensaje es una regla de estilo o una directiva arquitect¨®nica estricta que proh¨ªbe usar un "atajo" o truco espec¨ªfico.

Te explico en detalle qu¨¦ significa y por qu¨¦ se proh¨ªbe:

1. Desglosando la frase
NEVER use: Es una orden categ¨®rica. Significa que bajo ninguna circunstancia se acepta esa pr¨¢ctica en el repositorio.

allowExportNames: Es el nombre de una configuraci¨®n o propiedad t¨¦cnica espec¨ªfica (usualmente asociada a herramientas 
de empaquetado como Webpack, Vite, o linters como ESLint).

workaround: Significa "soluci¨®n alternativa" o "parche". En programaci¨®n, un workaround es una soluci¨®n r¨¢pida que arregla 
un s¨ªntoma temporalmente, pero no resuelve el problema de ra¨ªz (un "alambre" o "parche"). -->

### Husky: git init BEFORE husky init

## Scripts

- `pnpm test:run` - unit tests
- `pnpm test:e2e` - playwright
- `pnpm quality` - lint + typecheck + test:run
- `pnpm verify` - quality + test:e2e + build


## Validation

`pnpm verify` must pass: 0 lint errors, 0 type errors, all tests green, build success.


** FIN A?ADIDO

---

## Plan de Ruta para el Desarrollo (Fase 1)

1. **Paso 1: Dise?o de Base de Datos y Servidor Inicial**
   - Configurar el entorno de Node.js con Express.
   - Crear la base de datos local en PostgreSQL y definir las tablas con Prisma.
2. **Paso 2: API de Autenticaci¨®n y CRUDs**
   - Implementar el Login del Administrador (JWT).
   - Crear las rutas de CRUD para Profesores (`GET`, `POST`, `PUT`, `DELETE`).
   - Crear las rutas de CRUD para Alumnos.
   - Probar los endpoints usando Thunder Client (VS Code) o Postman.
3. **Paso 3: Frontend - Estructura y Autenticaci¨®n**
   - Inicializar el proyecto React con Vite y configurar Tailwind CSS.
   - Crear la pantalla de Login y guardar el token JWT en el LocalStorage/Cookies.
4. **Paso 4: Frontend - Vistas de Gesti¨®n**
   - Crear el Dashboard con tablas interactivas para listar Profesores y Alumnos.
   - Implementar formularios en modales para a?adir y editar registros.
   - Conectar los formularios con las APIs del Backend usando Axios.
   
   
   
------------------------------------------------------------------------------------------------------------

## Resumen del Contenido del README.md Creado

El fichero que te he generado en docs/README.md contiene la estructura id¨®nea para iniciar tu repositorio de Git. Incluye:

1. Diagrama de arquitectura b¨¢sico explicativo.

2. Detalle del Stack de Tecnolog¨ªas con herramientas complementarias ideales para Juniors (como Zod para validar que los 
formularios traigan los datos correctos antes de guardarlos).

3. Modelo de Datos Inicial (Entidad-Relaci¨®n): El dise?o de las tablas (Usuarios, Profesores, Alumnos) con sus claves primarias 
y for¨¢neas correspondientes para que sepas c¨®mo estructurar tu base de datos desde el primer d¨ªa.

4. Estructura de Carpetas Limpia: Tanto para el frontend como para el backend, estructurado de una manera que escalar¨¢ de forma 
sana cuando decidas a?adir clases pr¨¢cticas, ex¨¢menes o pagos.

5. Roadmap (Gu¨ªa paso a paso): Un plan de acci¨®n dividido en 4 fases secuenciales para que no te abrumes y sepas exactamente por 
d¨®nde empezar a picar c¨®digo.
   
   
## INFO FUERA DEL README

?Hola! Felicidades por dar el paso de iniciar este proyecto full-stack. 
Es una excelente manera de consolidar tus conocimientos como programador junior, ya que abarca todos los pilares del desarrollo 
de software: bases de datos, l¨®gica de negocio y presentaci¨®n visual.

He analizado tu requerimiento y he preparado las recomendaciones de arquitectura, stack tecnol¨®gico y estructura para tu proyecto. 
Siguiendo tus pautas de configuraci¨®n, he generado el archivo README.md completo y detallado dentro de la carpeta docs/.


A continuaci¨®n, te detallo la justificaci¨®n de las elecciones para que entiendas el porqu¨¦ de cada decisi¨®n.

1. Arquitectura Recomendada: Cliente-Servidor Desacoplada
Para un desarrollador junior y para el inicio de este proyecto, la mejor opci¨®n es una Arquitectura Cliente-Servidor 
Desacoplada (Separando completamente el Front-end del Back-end) con un backend estructurado como Monolito Modular.

?Por qu¨¦ desacoplada? Te permite trabajar en el backend (creando tu API) y en el frontend (creando la interfaz) de forma 
independiente. Si en el futuro decides cambiar la web por una aplicaci¨®n m¨®vil, el backend te servir¨¢ exactamente igual sin 
modificar una sola l¨ªnea de c¨®digo de l¨®gica.

?Por qu¨¦ Monolito Modular? En el backend, en lugar de mezclar todo el c¨®digo, lo organizaremos por "m¨®dulos" independientes 
(un m¨®dulo para alumnos, otro para profesores, otro para autenticaci¨®n). Esto mantiene el c¨®digo ordenado, f¨¢cil de testear y 
evita que se vuelva inmanejable.

2. Stack Tecnol¨®gico Sugerido
Back-end: Node.js + Express.js
Raz¨®n: Te permite programar en JavaScript tanto en el cliente como en el servidor, reduciendo el contexto cognitivo. 
Express es el framework m¨¢s popular de Node.js, lo que significa que ante cualquier error que te encuentres, habr¨¢ miles de 
soluciones documentadas en StackOverflow o foros.

Base de Datos: PostgreSQL + Prisma ORM
Raz¨®n: Al ser una autoescuela, los datos tienen relaciones muy claras y estrictas (un alumno tiene un profesor asignado, 
las clases pertenecen a un alumno y un profesor, etc.). Una base de datos relacional (SQL) como PostgreSQL es indispensable 
aqu¨ª para asegurar la integridad de los datos.

Prisma ORM: Act¨²a como puente entre tu c¨®digo Node.js y la base de datos. Te dar¨¢ autocompletado en tu editor de c¨®digo y 
facilitar¨¢ enormemente las consultas y las migraciones de bases de datos sin tener que escribir SQL puro al principio.

Front-end: React (con Vite) + Tailwind CSS
Raz¨®n: React es el est¨¢ndar de la industria y te forzar¨¢ a pensar en componentes reutilizables (por ejemplo, crear un componente 
Tabla o Boton que sirva tanto para profesores como para alumnos). Vite es el empaquetador moderno que sustituye al antiguo 
create-react-app, siendo extremadamente r¨¢pido.

Tailwind CSS: Te permitir¨¢ dise?ar interfaces profesionales de forma muy veloz directamente escribiendo clases en el HTML/JSX, 
ahorr¨¢ndote lidiar con archivos CSS gigantescos.

Resumen del Contenido del README.md Creado
El fichero que te he generado en docs/README.md contiene la estructura id¨®nea para iniciar tu repositorio de Git. Incluye:

Diagrama de arquitectura b¨¢sico explicativo.

Detalle del Stack de Tecnolog¨ªas con herramientas complementarias ideales para Juniors (como Zod para validar que los 
formularios traigan los datos correctos antes de guardarlos).

Modelo de Datos Inicial (Entidad-Relaci¨®n): El dise?o de las tablas (Usuarios, Profesores, Alumnos) con sus claves primarias y 
for¨¢neas correspondientes para que sepas c¨®mo estructurar tu base de datos desde el primer d¨ªa.

Estructura de Carpetas Limpia: Tanto para el frontend como para el backend, estructurado de una manera que escalar¨¢ de forma 
sana cuando decidas a?adir clases pr¨¢cticas, ex¨¢menes o pagos.

Roadmap (Gu¨ªa paso a paso): Un plan de acci¨®n dividido en 4 fases secuenciales para que no te abrumes y sepas exactamente por 
d¨®nde empezar a picar c¨®digo.

Nota IMPORTANTE  de control: Recuerda que de acuerdo a tus directrices guardadas en las instrucciones, si realizas la primera 
inicializaci¨®n de c¨®digo de este dise?o en tus ficheros ra¨ªz, deber¨¢s incrementar la versi¨®n del package.json y registrar los 
cambios correspondientes en tu CHANGELOG.md. ?Mucho ¨¦xito con el proyecto!



