--
-- PostgreSQL database dump
--

\restrict lmJE9uKMqERS6eeKCoaiCE0XJAUZupjHG2cKjgASNBvSFEAYsIofe0sGAYZUQJJ

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Rol" AS ENUM (
    'ADMIN',
    'PROFESOR',
    'ALUMNO'
);


ALTER TYPE public."Rol" OWNER TO postgres;

--
-- Name: TipoPrecio; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipoPrecio" AS ENUM (
    'FIJO',
    'VARIABLE',
    'POR_CLASE',
    'POR_EXAMEN'
);


ALTER TYPE public."TipoPrecio" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: activaciones_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activaciones_cuenta (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" text,
    "resendCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.activaciones_cuenta OWNER TO postgres;

--
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id text NOT NULL,
    "tipoLicenciaObjetivo" text NOT NULL,
    "horasPracticasCompletadas" integer DEFAULT 0 NOT NULL,
    "profesorAsignadoId" text,
    activo boolean DEFAULT true NOT NULL,
    "fechaNacimiento" timestamp(3) without time zone
);


ALTER TABLE public.alumnos OWNER TO postgres;

--
-- Name: bonos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bonos (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "clasesIncluidas" integer NOT NULL,
    "validezDias" integer DEFAULT 90 NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.bonos OWNER TO postgres;

--
-- Name: clases_directo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clases_directo (
    id text NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    "videoUrl" text NOT NULL,
    "duracionSegundos" integer DEFAULT 0 NOT NULL,
    "profesorId" text,
    permiso text DEFAULT 'B'::text NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.clases_directo OWNER TO postgres;

--
-- Name: clases_practicas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clases_practicas (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "profesorId" text NOT NULL,
    "vehiculoId" text NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    duracion integer NOT NULL,
    estado text NOT NULL
);


ALTER TABLE public.clases_practicas OWNER TO postgres;

--
-- Name: compras_bonos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compras_bonos (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "bonoId" text NOT NULL,
    "clasesCompradas" integer NOT NULL,
    "clasesConsumidas" integer DEFAULT 0 NOT NULL,
    pagado boolean DEFAULT false NOT NULL,
    "fechaCompra" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaValidezHasta" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.compras_bonos OWNER TO postgres;

--
-- Name: documentos_alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_alumno (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    tipo text NOT NULL,
    estado text DEFAULT 'PENDIENTE_VALIDACION'::text NOT NULL,
    observaciones text,
    activo boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.documentos_alumno OWNER TO postgres;

--
-- Name: documentos_alumno_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_alumno_archivos (
    id text NOT NULL,
    "documentoId" text NOT NULL,
    "nombreOriginal" text NOT NULL,
    "nombreArchivo" text NOT NULL,
    "mimeType" text NOT NULL,
    "tamanioBytes" integer NOT NULL,
    ruta text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.documentos_alumno_archivos OWNER TO postgres;

--
-- Name: examenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examenes (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    tipo text NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    estado text NOT NULL
);


ALTER TABLE public.examenes OWNER TO postgres;

--
-- Name: examenes_dgt_alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examenes_dgt_alumno (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    licencia text NOT NULL,
    "totalPreguntas" integer NOT NULL,
    aciertos integer NOT NULL,
    fallos integer NOT NULL,
    aprobado boolean NOT NULL,
    "duracionSegundos" integer,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.examenes_dgt_alumno OWNER TO postgres;

--
-- Name: facturas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facturas (
    id text NOT NULL,
    numero text NOT NULL,
    "alumnoId" text NOT NULL,
    "matriculaId" text NOT NULL,
    concepto text NOT NULL,
    "baseImponible" numeric(10,2) NOT NULL,
    descuento numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    estado text DEFAULT 'EMITIDA'::text NOT NULL,
    "fechaEmision" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaPago" timestamp(3) without time zone
);


ALTER TABLE public.facturas OWNER TO postgres;

--
-- Name: matriculas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matriculas (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    licencia text NOT NULL,
    "precioBase" numeric(10,2) NOT NULL,
    "precioFinal" numeric(10,2) NOT NULL,
    "promocionId" text,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    "fechaCreacion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaPago" timestamp(3) without time zone,
    observaciones text
);


ALTER TABLE public.matriculas OWNER TO postgres;

--
-- Name: matriculas_conceptos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matriculas_conceptos (
    id text NOT NULL,
    "matriculaId" text NOT NULL,
    "tarifaConceptoId" text NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    "precioUnitario" numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    observaciones text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.matriculas_conceptos OWNER TO postgres;

--
-- Name: preguntas_dgt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas_dgt (
    id text NOT NULL,
    licencia text[],
    enunciado text NOT NULL,
    "imagenRuta" text,
    explicacion text,
    activa boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.preguntas_dgt OWNER TO postgres;

--
-- Name: profesores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesores (
    id text NOT NULL,
    "licenciaConducir" text NOT NULL,
    telefono text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "permisosLicencias" text[] DEFAULT ARRAY[]::text[] NOT NULL
);


ALTER TABLE public.profesores OWNER TO postgres;

--
-- Name: promociones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promociones (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "precioOriginal" numeric(10,2) NOT NULL,
    "precioPromocional" numeric(10,2) NOT NULL,
    "licenciasAplicables" text[],
    "imagenRuta" text,
    "fechaInicio" timestamp(3) without time zone,
    "fechaFin" timestamp(3) without time zone,
    activa boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "requiereCarnetEstudiante" boolean DEFAULT false NOT NULL,
    "edadMinima" integer,
    "edadMaxima" integer,
    "requiereFidelidad" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.promociones OWNER TO postgres;

--
-- Name: respuestas_pregunta_dgt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas_pregunta_dgt (
    id text NOT NULL,
    "preguntaId" text NOT NULL,
    texto text NOT NULL,
    correcta boolean DEFAULT false NOT NULL,
    orden integer
);


ALTER TABLE public.respuestas_pregunta_dgt OWNER TO postgres;

--
-- Name: solicitudes_examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes_examen (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    tipo text NOT NULL,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    "fechaSolicitud" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaProgramada" timestamp(3) without time zone,
    observaciones text
);


ALTER TABLE public.solicitudes_examen OWNER TO postgres;

--
-- Name: tarifas_concepto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarifas_concepto (
    id text NOT NULL,
    permiso text NOT NULL,
    concepto text NOT NULL,
    precio numeric(10,2) NOT NULL,
    tipo public."TipoPrecio" NOT NULL,
    descripcion text,
    activa boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tarifas_concepto OWNER TO postgres;

--
-- Name: tarifas_concepto_historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarifas_concepto_historial (
    id text NOT NULL,
    "tarifaConceptoId" text NOT NULL,
    permiso text NOT NULL,
    concepto text NOT NULL,
    "precioAnterior" numeric(10,2),
    "precioNuevo" numeric(10,2) NOT NULL,
    motivo text,
    "usuarioId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tarifas_concepto_historial OWNER TO postgres;

--
-- Name: tarifas_matricula; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarifas_matricula (
    id text NOT NULL,
    licencia text NOT NULL,
    precio numeric(10,2) NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tarifas_matricula OWNER TO postgres;

--
-- Name: temarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temarios (
    id text NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    orden integer DEFAULT 0 NOT NULL,
    "tipoLicenciaObjetivo" text[] NOT NULL,
    "documentacionRuta" text,
    "claseDirectoVideoUrl" text
);


ALTER TABLE public.temarios OWNER TO postgres;

--
-- Name: temarios_progreso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temarios_progreso (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "temarioId" text NOT NULL,
    revisado boolean DEFAULT false NOT NULL,
    dominio integer DEFAULT 0 NOT NULL,
    "ultimaRevision" timestamp(3) without time zone
);


ALTER TABLE public.temarios_progreso OWNER TO postgres;

--
-- Name: tests_practica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tests_practica (
    id text NOT NULL,
    "alumnoId" text NOT NULL,
    "temarioId" text,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resultado text NOT NULL,
    "respuestasCorrectas" integer NOT NULL,
    "totalPreguntas" integer NOT NULL
);


ALTER TABLE public.tests_practica OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id text NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    rol public."Rol" NOT NULL,
    "fechaCreacion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telefono text,
    dni text,
    "requiereCambioPassword" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id text NOT NULL,
    matricula text NOT NULL,
    marca text,
    modelo text,
    "tipoPermiso" text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "imagenRuta" text
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a5eef114-89ca-4f37-9572-59769bb4361d	2ba469375cad85974d96619eefa99a1d5ca119d33eddf8b07926eae686c4e91f	2026-09-07 06:41:10.157668+00	20260803193917_init	\N	\N	2026-09-07 06:41:09.997896+00	1
4757b475-5e60-402f-a594-a5d61a318cdd	5a5c3066bc4fbbc26f93bac9b45261717b91b13059fc6c99f9b43be41fb9b493	2026-09-07 06:41:10.838442+00	20260903125937_remove_old_matricula_fields	\N	\N	2026-09-07 06:41:10.83062+00	1
63c902ba-ba4e-4f71-b2d4-bc643351c460	079e60a636bb49bc02d316c1a3b3c710571aaf03134f2f4cce66265cd9e0d335	2026-09-07 06:41:10.325852+00	20260810090110_add_vehiculos_clases_examenes	\N	\N	2026-09-07 06:41:10.16112+00	1
7436df79-3d08-40e0-b3e1-06137327ac90	f351c5adf03a4493ef3cfffc3205349e16b6367e0039e447b1862d7360c9edaf	2026-09-07 06:41:10.339613+00	20260815143135_add_telefono_usuario	\N	\N	2026-09-07 06:41:10.328609+00	1
979f8bc8-2080-4760-a32f-dcb3c277d1ec	51d9e6884cba99b7c4a6140cb57b5a300a0cdd0d83ec05d9d6cb07cdb3f2d6a5	2026-09-07 06:41:11.062922+00	20260907120000_add_tarifas_concepto_historial	\N	\N	2026-09-07 06:41:11.029883+00	1
78ab8131-16bf-4774-b45f-946a61449265	e27897c69c9b39bd9bc588345a541834fc5f002b59eacc4b2a3056a68ee6ef5e	2026-09-07 06:41:10.358227+00	20260815164108_add_activo_alumno	\N	\N	2026-09-07 06:41:10.342509+00	1
890ce330-e2cc-44a6-aac6-fa2715dc4cc3	84613eb179b256bd72c34641df2af595a12be1e060f65fc71efbbf197d7ab985	2026-09-07 06:41:10.89051+00	20260903183000_add_promocion_reglas_y_facturas	\N	\N	2026-09-07 06:41:10.841077+00	1
ccbdeeab-1e61-4919-a867-2fabde4061c5	028ff7a5d8c56d93d5ae70e6a7b8daf778cce30c2fff161c8866bbff95b13c6b	2026-09-07 06:41:10.376669+00	20260824103916_add_usuario_dni_y_alumno_fecha_nacimiento	\N	\N	2026-09-07 06:41:10.361069+00	1
05d26d4b-351e-4505-baf1-2af07bdd11ab	ea67ad80c928ce076e2eaa0e7658baf7bee07c4c7e83a682fdb02e2bdbf46351	2026-09-07 06:41:10.393386+00	20260824110249_add_requiere_cambio_password_primer_login	\N	\N	2026-09-07 06:41:10.383068+00	1
d6c40fe2-358d-47e9-95a0-756192ca9c51	26a708465ac5c7d11be1711c285c61b383356d6709755ec884a2e405d40b5d91	2026-09-07 06:41:10.612631+00	20260824130000_student_dashboard_models	\N	\N	2026-09-07 06:41:10.400719+00	1
ccb7bbbd-c60d-4037-922b-5bae98c8722d	28937473460462b9e75529b87ffe5f4115e19c0d713a457cada433d7b05c6b55	2026-09-07 06:41:10.899896+00	20260903185120_temarios_multilicencia	\N	\N	2026-09-07 06:41:10.893116+00	1
b0f64f2b-a4c2-4f76-839f-3e6a482a21c2	46fcf1d03040aec5ca1cb66563dcbb7f5d434724a192a5275aa12ba72a7c2ef4	2026-09-07 06:41:10.626204+00	20260824170000_add_permisos_licencias_profesor	\N	\N	2026-09-07 06:41:10.615144+00	1
75087613-5d34-4c77-8386-7b3f9cbc916a	3adfa654e3f5919227c57f3d5734b0c1a4053f4885332aaf7cb698b6c8e888ac	2026-09-07 06:41:10.642585+00	20260824190000_add_imagen_ruta_vehiculo	\N	\N	2026-09-07 06:41:10.628687+00	1
cb4638ae-c08c-4910-914a-ecd2ba0b5526	d7fe0e8a35b6ec4934cbc49eb7818052ac86777dbde03c60bf8d64cb02b97d9a	2026-09-07 06:41:10.70065+00	20260825123000_add_account_activation_tokens	\N	\N	2026-09-07 06:41:10.64523+00	1
761dd789-4c0e-4f2f-8146-72bc8a324569	91f97a23df08268cf6d1e8c9395725d081e041b54d44ac6498aafbfa71ac3a4e	2026-09-07 06:41:10.918288+00	20260903205500_temarios_multilicencia	\N	\N	2026-09-07 06:41:10.903829+00	1
f8181b3a-7d1e-432c-a38a-74dc11a1c349	e934ad338ccfb9cb38ceafae475e5cd04b766bb8ec651e7aba0e182515414be8	2026-09-07 06:41:10.728796+00	20260828085901_create_promociones	\N	\N	2026-09-07 06:41:10.704209+00	1
c1487c09-02c3-445d-9ae3-2164fc5e8e74	12ade4a7c9177b019e811fec0d12a33ae6bb22c649daa2ebd1083075ac2fa65a	2026-09-07 06:41:10.773714+00	20260901123730_add_clases_directo	\N	\N	2026-09-07 06:41:10.731464+00	1
05fa10d9-4010-4cfe-a721-2f5f0823fd6f	3743a6643439aca8b6fd7e6b330953aad48083f41b5a5a3ce364c99ec5d56c74	2026-09-07 08:05:51.636279+00	20260907080551_add_preguntas_dgt_models	\N	\N	2026-09-07 08:05:51.233096+00	1
0967b8d9-df60-4f7f-ae65-62f6f81d829c	681e4ea2af112ead7eb52bcbb04df0b1dc09e0daa7050784548e8268d29664cc	2026-09-07 06:41:10.828145+00	20260902143146_create_matriculas	\N	\N	2026-09-07 06:41:10.777372+00	1
942e575c-c39f-4417-a80c-e5aef04a2187	28937473460462b9e75529b87ffe5f4115e19c0d713a457cada433d7b05c6b55	2026-09-07 06:41:10.929168+00	20260904121135_create_dgt_tests	\N	\N	2026-09-07 06:41:10.921342+00	1
7c2938b2-a905-46c0-ba7b-ec9e45228ac3	402aa3da6634cbbb55f825c04ef78e774d28c89f705922559b53a58a60f841cb	2026-09-07 06:41:10.966285+00	20260906084720_add_tarifas_concepto	\N	\N	2026-09-07 06:41:10.932933+00	1
46785f61-5811-4ffd-bcfa-2070d3d3bffa	0572b80690b44b6c6d515e0da3ed16bb1f4f5c82e6e46f48d2fe0d2baeb4fbb9	2026-09-07 06:41:11.010395+00	20260906193834_add_matricula_conceptos	\N	\N	2026-09-07 06:41:10.970118+00	1
dbfac455-095c-405b-8590-ac945343363a	a6c0f44eefefd41e296536c919f9c1ec36a6605720ed62470f71040b283c02a7	2026-09-07 09:56:36.316184+00	20260907130000_add_temario_documentacion_video	\N	\N	2026-09-07 09:56:36.178+00	1
9471efef-27a9-4a92-aadb-113cb982202f	3d1ce097c30eda3d282a797282b43bad85fba2de9f8243bad0974bd368624c01	2026-09-07 06:41:11.024799+00	20260906194305_add_matricula_concepto_timestamps	\N	\N	2026-09-07 06:41:11.014913+00	1
\.


--
-- Data for Name: activaciones_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activaciones_cuenta (id, "usuarioId", "tokenHash", "expiresAt", "usedAt", "createdAt", "createdById", "resendCount") FROM stdin;
30c56518-d696-4f3c-81c6-86eb5f6a2742	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	69cf0f420df816840418a30b83d57e4162403e4b736d319e860688ae3b3e6b53	2026-09-08 07:25:12.012	\N	2026-09-07 07:25:12.023	11111111-1111-1111-1111-111111111112	0
5abb06e4-2292-43d0-a4e9-6a5169f3e600	e3a5a66a-e63d-4cee-9ef1-79265fbe4b1a	0a66fc8698ec6f19096b2dddbe41d61ee96d5948159c1072552206ba60f03a21	2026-09-08 08:37:58.976	\N	2026-09-07 08:37:58.998	11111111-1111-1111-1111-111111111112	0
8abb909b-5544-4d20-ba54-696577d3692e	a7a94770-62cb-40e4-abd5-3fa8455a900e	551f821ca99b2b0158a2c4d8d285db679144e01d9523faa1b1df72e2b77cdad6	2026-09-08 08:38:49.443	\N	2026-09-07 08:38:49.446	11111111-1111-1111-1111-111111111112	0
67023655-3ea7-482f-875b-aaffc5dfb2b4	0c02fb90-2481-43a5-b6ec-bd56c0b343d7	4cfbc3ef9986643e7e0f693dbe971d8b1129001fa168eb96fea86bcdf2da8122	2026-09-08 15:09:59.141	\N	2026-09-07 15:09:59.165	11111111-1111-1111-1111-111111111112	0
2c74c558-01cf-4961-8fe9-0fc204a64bf7	8444ae56-b039-47cd-9010-77721e2619f9	867d2f54a8ddd130871eed789e7cef993b2b02cd2349c3d16b1a69f4336352c4	2026-09-08 15:11:09.533	\N	2026-09-07 15:11:09.536	11111111-1111-1111-1111-111111111112	0
b7f07642-cc6b-497b-b1e4-95e2c9dd7386	3849e347-268b-409f-a0e0-072ba912b7ad	f4e276b5037861f43a7315844d0406592f93a060ee70005af1ce910fb93d2e84	2026-09-08 15:12:12.537	\N	2026-09-07 15:12:12.539	11111111-1111-1111-1111-111111111112	0
\.


--
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id, "tipoLicenciaObjetivo", "horasPracticasCompletadas", "profesorAsignadoId", activo, "fechaNacimiento") FROM stdin;
33333333-3333-3333-3333-333333333333	B	6	22222222-2222-2222-2222-222222222222	t	2002-05-18 00:00:00
74ea708b-d88c-4a1b-ab13-9e16c51a38d4	B	0	e3a5a66a-e63d-4cee-9ef1-79265fbe4b1a	t	1986-01-31 00:00:00
0c02fb90-2481-43a5-b6ec-bd56c0b343d7	C	0	\N	t	1985-06-06 00:00:00
8444ae56-b039-47cd-9010-77721e2619f9	B	0	\N	t	2004-01-24 00:00:00
3849e347-268b-409f-a0e0-072ba912b7ad	A2	0	\N	t	1985-10-09 00:00:00
\.


--
-- Data for Name: bonos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bonos (id, nombre, descripcion, "clasesIncluidas", "validezDias", activo) FROM stdin;
bono-001	Pack 10 Clases	Bono estándar con 10 clases prácticas.	10	90	t
bono-002	Pack 20 Clases	Bono ampliado con 20 clases prácticas.	20	120	t
bono-003	Pack Intensivo	Bono intensivo para refuerzo rápido antes del examen.	15	60	t
\.


--
-- Data for Name: clases_directo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clases_directo (id, titulo, descripcion, "videoUrl", "duracionSegundos", "profesorId", permiso, activa, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: clases_practicas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clases_practicas (id, "alumnoId", "profesorId", "vehiculoId", fecha, duracion, estado) FROM stdin;
clase-001	33333333-3333-3333-3333-333333333333	22222222-2222-2222-2222-222222222222	vehiculo-001	2026-08-26 10:00:00	45	PROGRAMADA
clase-002	33333333-3333-3333-3333-333333333333	22222222-2222-2222-2222-222222222222	vehiculo-001	2026-08-30 10:00:00	45	PROGRAMADA
clase-003	33333333-3333-3333-3333-333333333333	22222222-2222-2222-2222-222222222222	vehiculo-001	2026-08-20 10:00:00	45	CANCELADA
clase-004	33333333-3333-3333-3333-333333333333	22222222-2222-2222-2222-222222222222	vehiculo-001	2026-08-16 10:00:00	45	PROGRAMADA
\.


--
-- Data for Name: compras_bonos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras_bonos (id, "alumnoId", "bonoId", "clasesCompradas", "clasesConsumidas", pagado, "fechaCompra", "fechaValidezHasta") FROM stdin;
compra-bono-001	33333333-3333-3333-3333-333333333333	bono-001	10	4	t	2026-07-25 10:00:00	2026-10-23 10:00:00
compra-bono-002	33333333-3333-3333-3333-333333333333	bono-003	15	15	t	2026-06-10 10:00:00	2026-08-22 10:00:00
\.


--
-- Data for Name: documentos_alumno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_alumno (id, "alumnoId", tipo, estado, observaciones, activo, "createdAt", "updatedAt") FROM stdin;
2b06a4c5-ab18-4f67-9d13-ceb42541f096	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	CERTIFICADO_PSICOTECNICO	RECHAZADO	Psicotécnico David Ruiz Cortes	f	2026-09-08 12:41:23.808	2026-09-08 12:41:36.275
2845ea32-c78e-4627-aa6e-103aa3a71619	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	JUSTIFICANTE	PENDIENTE_VALIDACION	Justificante David Ruiz Cortes	t	2026-09-08 12:44:12.535	2026-09-08 12:44:12.535
a4c293ed-59d3-4fdc-ac3d-cc9e8dbdad57	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	CERTIFICADO_PSICOTECNICO	PENDIENTE_VALIDACION	Psicotécnico	t	2026-09-08 12:41:48.739	2026-09-08 12:44:42.793
b64d3448-0ca8-457c-b8c9-98d07946de5f	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	DNI	VALIDADO	DNI David Ruiz Cortes	t	2026-09-08 12:43:48.27	2026-09-08 12:57:08.953
\.


--
-- Data for Name: documentos_alumno_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_alumno_archivos (id, "documentoId", "nombreOriginal", "nombreArchivo", "mimeType", "tamanioBytes", ruta, "createdAt") FROM stdin;
06eb99a0-60ef-4133-915d-2dfbc271f4bb	2b06a4c5-ab18-4f67-9d13-ceb42541f096	recibo_psicotecnico.jpg	9d3a39d4-90e5-4a3a-ba64-0466b60f144b.jpg	image/jpeg	26321	/api/uploads/documentos-alumno/9d3a39d4-90e5-4a3a-ba64-0466b60f144b.jpg	2026-09-08 12:41:23.808
6d00b6ca-a4e7-44cb-923e-c24239c45358	a4c293ed-59d3-4fdc-ac3d-cc9e8dbdad57	recibo_psicotecnico.jpg	c86a4f5c-a331-47ec-8e4c-74cee73a2a41.jpg	image/jpeg	26321	/api/uploads/documentos-alumno/c86a4f5c-a331-47ec-8e4c-74cee73a2a41.jpg	2026-09-08 12:41:48.739
5582c11a-ed15-487b-ade0-1e457e6878dd	b64d3448-0ca8-457c-b8c9-98d07946de5f	dni_delantera.jpg	e309a918-a1a9-4238-9698-0fff68b581f4.jpg	image/jpeg	46082	/api/uploads/documentos-alumno/e309a918-a1a9-4238-9698-0fff68b581f4.jpg	2026-09-08 12:43:48.27
420d4736-84ff-4039-b3e3-e879bae4a13d	2845ea32-c78e-4627-aa6e-103aa3a71619	justificante_medico.png	238800bb-4bd0-4376-8a3b-d6cf40d6b5d8.png	image/png	14654	/api/uploads/documentos-alumno/238800bb-4bd0-4376-8a3b-d6cf40d6b5d8.png	2026-09-08 12:44:12.535
\.


--
-- Data for Name: examenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examenes (id, "alumnoId", tipo, fecha, estado) FROM stdin;
examen-001	33333333-3333-3333-3333-333333333333	TEORICO	2026-09-07 10:00:00	PROGRAMADO
examen-002	33333333-3333-3333-3333-333333333333	PRACTICO	2026-09-18 10:00:00	PROGRAMADO
\.


--
-- Data for Name: examenes_dgt_alumno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examenes_dgt_alumno (id, "alumnoId", licencia, "totalPreguntas", aciertos, fallos, aprobado, "duracionSegundos", fecha) FROM stdin;
a523fd2c-5d73-40f4-80f1-cfd9fa97c7a2	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	B	30	29	1	t	196	2026-09-08 13:01:23.297
c2c26a03-a8f9-46a0-9448-81a53a3ccf5a	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	B	30	30	0	t	\N	2026-09-08 14:48:51.804
467349bc-9890-4566-9fc4-fc4492d3ff9b	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	B	30	10	20	f	\N	2026-09-08 14:51:35.141
\.


--
-- Data for Name: facturas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facturas (id, numero, "alumnoId", "matriculaId", concepto, "baseImponible", descuento, total, estado, "fechaEmision", "fechaPago") FROM stdin;
ab46e5ab-ace6-485e-a1b6-5d8e9552d733	FAC-1788765911994-6225	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	fb2cdd7a-a525-4a54-ab0f-2ac82c74b17f	Matricula licencia B - Promoción Coche Septiembre	220.00	110.00	110.00	PAGADA	2026-09-07 07:25:11.996	2026-09-07 08:34:47.923
c31fc4a1-1f15-4c94-b535-d52fb093b853	FAC-1788793869524-1656	8444ae56-b039-47cd-9010-77721e2619f9	746a5f0b-1756-4e03-b281-c1dc8f5d73aa	Matricula licencia B - Promoción Coche Septiembre	220.00	110.00	110.00	EMITIDA	2026-09-07 15:11:09.525	\N
a273c761-c1c1-431c-8399-dc39a206bfbb	FAC-1788793932531-3030	3849e347-268b-409f-a0e0-072ba912b7ad	92b37997-2d9e-453c-b88f-a8e21cf6f9cc	Matricula licencia A2	180.00	0.00	180.00	EMITIDA	2026-09-07 15:12:12.531	\N
200d45fb-105f-468b-8813-fdd22eb16431	FAC-1788793799120-1564	0c02fb90-2481-43a5-b6ec-bd56c0b343d7	cc1a4e19-2035-4669-9203-c940bf806eed	Matricula licencia C - Promoción Camión Septiembre	450.00	225.00	225.00	PAGADA	2026-09-07 15:09:59.122	2026-09-07 15:14:58.931
\.


--
-- Data for Name: matriculas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matriculas (id, "alumnoId", licencia, "precioBase", "precioFinal", "promocionId", estado, "fechaCreacion", "fechaPago", observaciones) FROM stdin;
fb2cdd7a-a525-4a54-ab0f-2ac82c74b17f	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	B	220.00	110.00	5202a365-aef9-4099-a368-ad1e5b56cb2d	PAGADA	2026-09-07 07:25:11.984	2026-09-07 08:34:47.923	\N
746a5f0b-1756-4e03-b281-c1dc8f5d73aa	8444ae56-b039-47cd-9010-77721e2619f9	B	220.00	110.00	5202a365-aef9-4099-a368-ad1e5b56cb2d	PENDIENTE	2026-09-07 15:11:09.522	\N	\N
92b37997-2d9e-453c-b88f-a8e21cf6f9cc	3849e347-268b-409f-a0e0-072ba912b7ad	A2	180.00	180.00	\N	PENDIENTE	2026-09-07 15:12:12.53	\N	\N
cc1a4e19-2035-4669-9203-c940bf806eed	0c02fb90-2481-43a5-b6ec-bd56c0b343d7	C	450.00	225.00	4d968649-d5d6-408f-a40f-dab58bba3a71	PAGADA	2026-09-07 15:09:59.111	2026-09-07 15:14:58.931	\N
\.


--
-- Data for Name: matriculas_conceptos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matriculas_conceptos (id, "matriculaId", "tarifaConceptoId", cantidad, "precioUnitario", subtotal, activo, observaciones, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: preguntas_dgt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas_dgt (id, licencia, enunciado, "imagenRuta", explicacion, activa, "createdAt", "updatedAt") FROM stdin;
pregunta-dgt-b-060	{B}	Pregunta DGT 60: ¿Puede estar una baca instalada en un vehículo sin que se le de uso?	/api/uploads/preguntas-dgt/5e943eab-c27e-4126-a16f-cf12ca62a8f3.webp	\N	t	2026-09-08 12:13:01.193	2026-09-08 12:32:50.781
pregunta-dgt-b-056	{B}	Pregunta DGT 56: El consumo de drogas de abuso o ilegales, ¿afecta a la seguridad vial?	/api/uploads/preguntas-dgt/34eb6372-86dd-4d13-ba3f-5eb5d19ba35f.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:37:29.038
pregunta-dgt-b-018	{B}	Pregunta DGT 18: ¿Aumenta el consumo de carburante al circular a alta velocidad?	/api/uploads/preguntas-dgt/f82b9e4d-448b-465b-9c3e-36cb20826425.webp	\N	t	2026-09-07 08:19:42.03	2026-09-08 09:40:17.11
pregunta-dgt-b-019	{B}	Pregunta DGT 19: ¿Es la luz antiniebla delantera obligatoria para los vehículos a motor?	/api/uploads/preguntas-dgt/d143e9c7-f661-493f-b733-8d841ad30009.webp	\N	t	2026-09-07 08:19:42.042	2026-09-08 09:40:24.726
pregunta-dgt-b-020	{B}	Pregunta DGT 20: Gran parte de los accidentes son debidos principalmente al factor...	/api/uploads/preguntas-dgt/7fcfec1e-e938-4931-9852-a6ffd76fe891.webp	\N	t	2026-09-07 08:19:42.058	2026-09-08 09:40:39.559
pregunta-dgt-b-021	{B}	Pregunta DGT 21: Uno de los factores que propician la accidentalidad de los jovenes conductores es...	/api/uploads/preguntas-dgt/7c13982d-973b-4128-942f-5edb8d42fd2f.webp	\N	t	2026-09-07 08:19:42.068	2026-09-08 09:40:45.396
pregunta-dgt-b-022	{B}	Pregunta DGT 22: ¿Esta permitido escuchar la radio o hablar por el móvil mientras se conduce un patinete?	/api/uploads/preguntas-dgt/46402be0-8ec0-4257-a122-59eabe708819.webp	\N	t	2026-09-07 08:19:42.083	2026-09-08 09:40:52.524
pregunta-dgt-b-023	{B}	Pregunta DGT 23: ¿Cuál de los siguientes efectos pueden provocar las drogas en un conductor?	/api/uploads/preguntas-dgt/2ca15bcd-6289-4c45-b054-5f0a6e6a140c.webp	\N	t	2026-09-07 08:19:42.097	2026-09-08 09:40:59.199
pregunta-dgt-b-025	{B}	Pregunta DGT 25: ¿Cómo se denomina al espacio en que los usuarios de la vía se pueden desplazar de modo imprevisto?	/api/uploads/preguntas-dgt/cdc06cd2-b0a3-44d8-9408-d18f138d31d5.webp	\N	t	2026-09-07 08:19:42.125	2026-09-08 09:41:10.995
pregunta-dgt-b-026	{B}	Pregunta DGT 26: ¿Cuánto tiempo tiene un conductor para subsanar los defectos de seguridad que se encuentren en una ITV?	/api/uploads/preguntas-dgt/c3165f1a-0094-4cd5-b5a7-924877350284.webp	\N	t	2026-09-07 08:19:42.134	2026-09-08 09:41:17.841
pregunta-dgt-b-024	{B,C}	Pregunta DGT 24: Las señales indican...	/api/uploads/preguntas-dgt/31fad5dc-d88a-4374-925a-a1344bbddc05.webp	\N	t	2026-09-07 08:19:42.111	2026-09-08 09:43:21.875
pregunta-dgt-b-053	{B}	Pregunta DGT 53: Al circular, en caso de lluvia intensa, ¿Qué precauciones se deben tomar?	/api/uploads/preguntas-dgt/ce48b058-3c3e-4e03-b996-af00aec6f20c.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:36:27.256
pregunta-dgt-b-005	{B}	Pregunta DGT 5: Cuando se padece una alergia respiratoria y se tiene una crisis de estornudos...	/api/uploads/preguntas-dgt/2a895a9e-3304-4fb3-a43f-a74582758d9c.webp	\N	t	2026-09-07 08:19:41.877	2026-09-08 09:42:24.36
pregunta-dgt-b-006	{B}	Pregunta DGT 6: ¿Qué usuarios deben obedecer el semáforo de la fotografía?	/api/uploads/preguntas-dgt/1788ffe7-2322-41b9-9233-5b99b909f711.webp	\N	t	2026-09-07 08:19:41.884	2026-09-08 09:42:30.014
pregunta-dgt-b-007	{B}	Pregunta DGT 7: ¿Qué es un catadióptrico?	/api/uploads/preguntas-dgt/1076b0d2-21d2-4db9-9e38-dbba48ae4ad1.webp	\N	t	2026-09-07 08:19:41.895	2026-09-08 09:42:36.265
pregunta-dgt-b-008	{B}	Pregunta DGT 8: ¿A que tipo de vehículos puede estar destinando un semáforo con una franja blanca sobre un fondo circular negro?	/api/uploads/preguntas-dgt/cd9b2880-adb7-40e7-8396-cc2759c26eb6.webp	\N	t	2026-09-07 08:19:41.907	2026-09-08 09:42:42.453
pregunta-dgt-b-009	{B}	Pregunta DGT 9: Si un niño es atropellado, el mayor punto de impacto es....	/api/uploads/preguntas-dgt/8a198843-b643-462b-9ce9-e3a35e227f4a.webp	\N	t	2026-09-07 08:19:41.916	2026-09-08 09:42:53.93
pregunta-dgt-b-001	{B}	Pregunta DGT 1: ¿Cómo se puede comprobar la presión de los neumáticos del vehículo?	/api/uploads/preguntas-dgt/56e136fe-4d43-41ce-b914-fa05b5fd329e.webp	\N	t	2026-09-07 08:19:41.768	2026-09-08 09:39:07.712
pregunta-dgt-b-010	{B}	Pregunta DGT 10: ¿Qué luces deberemos utilizar adicionalmente ante nubes densas de humo o polvo?	/api/uploads/preguntas-dgt/e7b18b1a-fcd1-4672-950f-d294f0dd32a7.webp	\N	t	2026-09-07 08:19:41.929	2026-09-08 09:39:15.986
pregunta-dgt-b-011	{B}	Pregunta DGT 11: ¿Qué significa la señal de bandera roja realizada por un agente de circulación desde su vehículo?	/api/uploads/preguntas-dgt/4916b52e-6b96-47ab-b31a-b0799fe87aeb.webp	\N	t	2026-09-07 08:19:41.94	2026-09-08 09:39:23.352
pregunta-dgt-b-012	{B}	Pregunta DGT 12: ¿Influye la velocidad en la capacidad de anticipación del conductor?	/api/uploads/preguntas-dgt/1a10ee77-03e8-40ab-8ca9-d80657efc86d.webp	\N	t	2026-09-07 08:19:41.949	2026-09-08 09:39:31.565
pregunta-dgt-b-013	{B}	Pregunta DGT 13: ¿Debe dejar encendidas las luces de posición un vehículo estacionado en una travesía en vía urbana poco iluminada?	/api/uploads/preguntas-dgt/cbe02a6b-3959-42c8-b75e-1b6422c695b8.webp	\N	t	2026-09-07 08:19:41.963	2026-09-08 09:39:40.18
pregunta-dgt-b-014	{B}	Pregunta DGT 14: ¿Qué circunstancia ostenta el primer lugar como causante de accidente?	/api/uploads/preguntas-dgt/b814b766-fb3c-4dfd-95cf-7488a573161c.webp	\N	t	2026-09-07 08:19:41.975	2026-09-08 09:39:47.669
pregunta-dgt-b-015	{B}	Pregunta DGT 15: ¿Cuál de estas es una norma especifica para las curvas de visibilidad reducida?	/api/uploads/preguntas-dgt/32de27b1-31b9-4fed-9721-bc77625bf826.webp	\N	t	2026-09-07 08:19:41.982	2026-09-08 09:39:54.198
pregunta-dgt-b-016	{B}	Pregunta DGT 16: ¿Esta obligado un conductor a ceder el paso cuando vaya a incorporarse a la circulación?	/api/uploads/preguntas-dgt/3c51f9ff-c364-404a-8fbe-0e0ab2dd9a8c.webp	\N	t	2026-09-07 08:19:41.997	2026-09-08 09:40:00.484
pregunta-dgt-b-017	{B}	Pregunta DGT 17: ¿Qué alumbrado debe utilizar si circula antes de la salida del sol, pero con buena visibilidad?	/api/uploads/preguntas-dgt/f5c73524-d9e4-4380-b5c1-6e11c0076a9f.webp	\N	t	2026-09-07 08:19:42.016	2026-09-08 09:40:10.609
pregunta-dgt-b-002	{B}	Pregunta DGT 2: Si el entorno de la vía es monótono y con poco trafico...	/api/uploads/preguntas-dgt/4fcb1b3a-ab08-4828-996f-14ea9c802478.webp	\N	t	2026-09-07 08:19:41.844	2026-09-08 09:40:31.964
pregunta-dgt-b-027	{B}	Pregunta DGT 27: Los sistemas de seguridad pasiva incluyen...	/api/uploads/preguntas-dgt/aa11f412-416e-43a0-a078-03b4eb067865.webp	\N	t	2026-09-07 08:19:42.148	2026-09-08 09:41:25.427
pregunta-dgt-b-003	{B}	Pregunta DGT 3: ¿Deben facilitar los conductores de una autopista la incorporación de aquellos que entrar en el carril de aceleración?	/api/uploads/preguntas-dgt/dd8d426a-d3e9-41f6-8693-cefff2f607bc.webp	\N	t	2026-09-07 08:19:41.852	2026-09-08 09:42:01.907
pregunta-dgt-b-004	{B}	Pregunta DGT 4: ¿Esta permitido adelantar en este cambio de rasante de visibilidad reducida situado en una vía de doble sentido?	/api/uploads/preguntas-dgt/354fe2f6-4b9d-47a5-ba33-14e4357c31b6.webp	\N	t	2026-09-07 08:19:41.864	2026-09-08 09:42:18.706
pregunta-dgt-b-028	{B}	Pregunta DGT 28: ¿Podemos proporcionar un medicamento a un herido en un accidente de trafico?	/api/uploads/preguntas-dgt/8934e6ea-e3cf-4a21-a966-992d1d4b44f1.webp	\N	t	2026-09-07 08:19:42.165	2026-09-08 09:41:36.248
pregunta-dgt-b-029	{B}	Pregunta DGT 29: ¿Tiene prioridad de paso una ambulancia que circule con las señales luminosas apagadas?	/api/uploads/preguntas-dgt/c0f6e8d7-93b9-4744-9cf5-fd5be81515a8.webp	\N	t	2026-09-07 08:19:42.177	2026-09-08 09:41:41.43
pregunta-dgt-b-030	{B}	Pregunta DGT 30: ¿Cuál de estos factores favorecen las distracciones al conducir?	/api/uploads/preguntas-dgt/bcf811de-6218-4ebb-ba76-712c2be1467f.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 09:41:54.627
pregunta-dgt-b-033	{B}	Pregunta DGT 33: La dirección del vehículo es un sistema de seguridad	/api/uploads/preguntas-dgt/96892719-05c4-4312-990f-dcc0d078c266.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:33:47.1
pregunta-dgt-b-036	{B}	Pregunta DGT 36: Se considera conductor a la persona...	/api/uploads/preguntas-dgt/12ade8e5-b957-435a-aa60-0553d5587aa5.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:14.047
pregunta-dgt-b-037	{B}	Pregunta DGT 37: Conducir con mucho calor ¿puede afectar a la conducción?	/api/uploads/preguntas-dgt/358efdcd-3a5a-46b2-a22c-d948697bf655.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:23.337
pregunta-dgt-b-038	{B}	Pregunta DGT 38: La habilitación de uno o varios carriles para la circulación VAO, ¿será siempre temporal y con horario fijo?	/api/uploads/preguntas-dgt/bea8e78b-1025-4065-8f72-ed4d72e07539.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:34.22
pregunta-dgt-b-039	{B}	Pregunta DGT 39: ¿Qué indica la señal?	/api/uploads/preguntas-dgt/7923c14e-2dc4-495d-ae48-9cad4f3b8a00.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:42.972
pregunta-dgt-b-040	{B}	Pregunta DGT 40: A la hora de determinar la distancia de seguridad con el vehículo que circula por delante...	/api/uploads/preguntas-dgt/f0bf3b28-095c-4fec-ba93-ae9f6a9c0b62.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:50.876
pregunta-dgt-b-041	{B}	Pregunta DGT 41: ¿Pueden los factores personales, como estrés, influir en los efectos del alcohol?	/api/uploads/preguntas-dgt/4a073f07-0d77-4cdd-974f-596b2f45bb55.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:58.207
pregunta-dgt-b-042	{B}	Pregunta DGT 42: ¿Qué significa esta señal?	/api/uploads/preguntas-dgt/2582fed7-8759-48b4-bca0-21837d029fbf.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:06.231
pregunta-dgt-b-043	{B}	Pregunta DGT 43: La presión de inflado del neumático...	/api/uploads/preguntas-dgt/f54be88c-f6b9-4680-8c29-556b2249c0a4.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:22.118
pregunta-dgt-b-044	{B}	Pregunta DGT 44: ¿Cómo debe señalizar la carga que sobresale de una motocicleta?	/api/uploads/preguntas-dgt/3419b796-5fec-48ef-83cf-72329d5b793a.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:27.95
pregunta-dgt-b-045	{B}	Pregunta DGT 45: Circulando por un carril, se enciende la señar con aspa roja, ¿Qué debemos hacer?	/api/uploads/preguntas-dgt/1a892181-a9b2-4a07-8b14-9c0d7254ef65.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:34.539
pregunta-dgt-b-046	{B}	Pregunta DGT 46: ¿Cómo se llama la señal vertical situada a la salida de los núcleos urbanos?	/api/uploads/preguntas-dgt/cbda6f43-a29e-4cd4-820e-58618ae71189.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:40.495
pregunta-dgt-b-047	{B}	Pregunta DGT 47: Como regla general, ¿Por que no se debe quitar el casco a un conductor de motocicleta herido por un accidente?	/api/uploads/preguntas-dgt/0f56159f-3635-45ea-8267-a2111771ad49.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:47.116
pregunta-dgt-b-048	{B}	Pregunta DGT 48: En una motocicleta con mandos independiente para cada uno de los frenos, ¿Dónde se acciona generalmente el freno delantero?	/api/uploads/preguntas-dgt/9880981c-1cfa-4cdc-a61f-e16e390079f0.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:35:54.104
pregunta-dgt-b-049	{B}	Pregunta DGT 49: El conductor esta obligado a advertir mediante señales ópticas...	/api/uploads/preguntas-dgt/7db367b5-5058-4870-b062-cc4cc021a3ae.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:36:00.273
pregunta-dgt-b-050	{B}	Pregunta DGT 50: Un vehículo policial hace señales al conductor del un turismo que circula delante para se que detenga, ¿Qué debe hacer el conductor del turismo?	/api/uploads/preguntas-dgt/14aa4831-75e0-43af-99b1-33004f08beea.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:36:06.657
pregunta-dgt-b-051	{B}	Pregunta DGT 51: ¿Existe la señal vertical de estacionamiento prohibido en los días pares?	/api/uploads/preguntas-dgt/6b24f633-b152-42de-afb2-553198f0d179.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:36:12.457
pregunta-dgt-b-052	{B}	Pregunta DGT 52: Esta señal indica...	/api/uploads/preguntas-dgt/8f1163dd-95de-49f2-a6e8-00fbd4aedce0.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:36:20.081
pregunta-dgt-b-054	{B}	Pregunta DGT 54: ¿Cuál de los siguientes efectos puede provocar mientras se conduce?	/api/uploads/preguntas-dgt/f81b6e53-083e-4dd0-8a75-6874f2f5cd42.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:37:11.356
pregunta-dgt-b-055	{B}	Pregunta DGT 55: ¿Se puede adelantar a los ciclistas?	/api/uploads/preguntas-dgt/299cf5c9-614a-4443-8b3b-ffaf8218fcf5.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:37:20.442
pregunta-dgt-b-057	{B}	Pregunta DGT 57: ¿Cómo se deberá realizar un estacionamiento en vía interurbana?	/api/uploads/preguntas-dgt/3f579417-1e85-479c-8de8-2bb51e0285e7.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:37:37.924
pregunta-dgt-b-058	{B}	Pregunta DGT 58: ¿Puede un vehículo no prioritario en servicio de emergencia utilizar señales acústicas?	/api/uploads/preguntas-dgt/20fb9882-f60a-445f-a83c-a69da4fff1fb.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:37:45.364
pregunta-dgt-b-034	{B}	Pregunta DGT 34: ¿Qué neumáticos se sobrecargan mas cuando el vehículo frena?	/api/uploads/preguntas-dgt/8acaf982-0e4f-4b50-baf7-3c0215871130.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:33:54.956
pregunta-dgt-b-059	{B}	Pregunta DGT 59: Se encuentra con un motorista accidentado, ¿debe quitarle el casos?	/api/uploads/preguntas-dgt/076c41cd-f42b-463b-bfda-0be7514923f7.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:32:57.766
pregunta-dgt-b-031	{B}	Pregunta DGT 31: Cuando el alumbrado de marcha atrás este averiado, ¿Cómo indicaremos que queremos ir marcha atrás?	/api/uploads/preguntas-dgt/2a5a031e-f1f0-40bb-a15b-cbcc3b865e28.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:33:10.09
pregunta-dgt-b-032	{B}	Pregunta DGT 32: El vehículo blanco se quiere incorporar a la circulación proveniente del garaje particular de una vivienda, ¿debe ceder el paso?	/api/uploads/preguntas-dgt/48918173-c492-48f5-ba00-d9ad93f6683e.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:33:18.159
pregunta-dgt-b-035	{B}	Pregunta DGT 35: Es la luz de estacionamiento obligatoria para todos los vehículos de 4 metros	/api/uploads/preguntas-dgt/8a737547-0899-40d0-a44f-a778f3c28793.webp	\N	t	2026-09-07 08:19:42.185	2026-09-08 12:34:05.045
\.


--
-- Data for Name: profesores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesores (id, "licenciaConducir", telefono, activo, "permisosLicencias") FROM stdin;
22222222-2222-2222-2222-222222222222	B	600000002	t	{B,A1}
a7a94770-62cb-40e4-abd5-3fa8455a900e	C	638542911	t	{C,D}
e3a5a66a-e63d-4cee-9ef1-79265fbe4b1a	B	634516593	t	{B,A2}
\.


--
-- Data for Name: promociones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promociones (id, nombre, descripcion, "precioOriginal", "precioPromocional", "licenciasAplicables", "imagenRuta", "fechaInicio", "fechaFin", activa, "createdAt", "updatedAt", "requiereCarnetEstudiante", "edadMinima", "edadMaxima", "requiereFidelidad") FROM stdin;
5202a365-aef9-4099-a368-ad1e5b56cb2d	Promoción Coche Septiembre	Matriculate y obten un 50% de descuento	220.00	110.00	{B}	/api/uploads/promociones/cb726b37-0bf6-4777-a5e9-6983b50fd430.jpeg	2026-09-01 00:00:00	2026-09-30 00:00:00	t	2026-09-07 07:10:23.581	2026-09-07 07:10:23.581	f	\N	\N	f
4d968649-d5d6-408f-a40f-dab58bba3a71	Promoción Camión Septiembre	Matricúlate y obtén un 50% de descuento	450.00	225.00	{C}	/api/uploads/promociones/674d2986-6cd1-4655-82de-a1db64828e4a.jpeg	2026-09-01 00:00:00	2026-09-30 00:00:00	t	2026-09-07 07:12:12.626	2026-09-07 07:12:12.626	f	\N	\N	f
27e3f15a-8428-4657-8fb4-9a4c84aa0f39	Promoción Todo Incluido	Matricula gratis. Material teórico. Clases teóricas ilimitadas. 20 Clases prácticas. Tasas de examen. Gestión de tramites.	850.00	699.00	{B}	/api/uploads/promociones/567b6951-1d2f-4331-a4cf-fe67f2279d5a.jpeg	2026-10-01 00:00:00	2026-10-31 00:00:00	t	2026-09-07 07:18:38.539	2026-09-07 07:18:38.539	f	18	35	f
\.


--
-- Data for Name: respuestas_pregunta_dgt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respuestas_pregunta_dgt (id, "preguntaId", texto, correcta, orden) FROM stdin;
4a46cb66-82a1-40e0-aa73-709f0e913b0f	pregunta-dgt-b-030	Una carretera desconocida	f	1
57c85c33-660b-42e0-96a6-2d8fec17d8c9	pregunta-dgt-b-030	Una situación de trafico excesivamente sencilla	f	2
9eec5214-12a1-47f7-bc0c-a5424861b16d	pregunta-dgt-b-030	Una situación de trafico excesivamente compleja	t	3
d690f50f-a2bf-409f-ba25-00d2b6a44ab0	pregunta-dgt-b-001	Con los neumáticos fríos	t	1
74f887d0-b180-448a-b92b-7f060dc32018	pregunta-dgt-b-003	No, no deben facilitar el paso en ningún caso	f	1
9cbc2170-8487-4760-8660-cbbb94f48ff0	pregunta-dgt-b-003	Si, en la medida de lo posible	t	2
3d6e7bbc-e6db-4082-854b-bc88a4af3963	pregunta-dgt-b-003	Si, deben bajar la velocidad para que puedan pasar	f	3
5359ed1a-9ad7-44be-bd5c-65132e883489	pregunta-dgt-b-001	Con los neumáticos calientes	f	2
9280a1b7-843c-4612-86b1-5e7c673ef37e	pregunta-dgt-b-004	No, porque no existe visibilidad suficiente	t	1
3330010a-aec1-43c6-bb43-ca1cdadb55a8	pregunta-dgt-b-004	No, excepto a bicicletas, aunque se ocupe el carril de sentido contrario	f	2
9ba4abe0-3e15-42b4-9829-57ef4c209f59	pregunta-dgt-b-004	Si, porque la linea longitudinal discontinua lo permite	f	3
067cc2a5-274d-45ff-9be6-40b0f5b9943d	pregunta-dgt-b-001	Es indiferente la temperatura de los neumáticos al comprobarlos	f	3
83dad432-18f8-403c-823f-b1d5c28a104e	pregunta-dgt-b-010	Luz de emergencia	f	1
243cec64-20f5-424e-a0b2-5a39e890a53b	pregunta-dgt-b-010	Luz antiniebla posterior	t	2
8aef9fa4-44f5-4ea0-a89d-79ad9d61827d	pregunta-dgt-b-010	Luz de marcha atrás	f	3
fa5a846f-5917-4659-a9e2-0834ad6af009	pregunta-dgt-b-011	Calzada cerrada temporalmente al trafico excepto para la autoridad	t	1
b7014426-a8e8-4a67-9810-9665b0b1d810	pregunta-dgt-b-011	Calzada reabierta al tráfico	f	2
e165d6c2-7979-4fd4-8d75-fbf8b8083e63	pregunta-dgt-b-011	Calzada en obras o mantenimiento	f	3
1a54d911-b666-4630-8969-5bdfa5946b19	pregunta-dgt-b-012	Si, a mayor velocidad menos capacidad de anticipación	t	1
24d78be3-6b21-4754-b167-6e6366c46d2c	pregunta-dgt-b-012	Depende de las condiciones de la vía	f	2
e80a6a67-e1c5-415b-b882-7a8fe028b752	pregunta-dgt-b-012	No	f	3
095749d2-6611-441b-8fdf-257f214be15c	pregunta-dgt-b-013	No, en ningún caso	f	1
1c002adc-0f76-4bff-8094-8d5e2c023e23	pregunta-dgt-b-013	Si, cuando la iluminación no permita que otros usuarios distinguirnos a una distancia suficiente	t	2
d66739c0-efc7-41e2-8996-55366752f738	pregunta-dgt-b-013	Únicamente las motocicletas deberán dejarlas encendidas	f	3
48edea79-7795-4947-a045-5955f257f489	pregunta-dgt-b-014	La falta de respeto a la prioridad en zona rural	f	1
a2dfa07a-7fde-4f17-9059-b10f67e2d40b	pregunta-dgt-b-014	La falta de respecto a la prioridad en zona urbana	t	2
fe0491af-d101-4c07-b2fa-578d3b32875b	pregunta-dgt-b-014	Los adelantamientos realizados incorrectamente	f	3
21238a5e-1fb3-41de-b72c-5b6f8776ed10	pregunta-dgt-b-015	Obligación de moderar a velocidad	t	1
a423c3c2-a8b4-4b77-901c-ee4894df297c	pregunta-dgt-b-015	Deber de mantenerse lo mas a la izquierda posible de la calzada	f	2
5d998cc1-d326-490f-90d7-18767e87f1fa	pregunta-dgt-b-015	Obligación de no sobrepasa los 50km/hora	f	3
3c0d0e8a-a2be-4c17-9b92-13c7b1f46549	pregunta-dgt-b-016	Si, siempre	t	1
b2324156-821d-4c24-b79e-f9bfba1bd537	pregunta-dgt-b-016	Es recomendable que lo ceda, pero no esta obligado	f	2
0c50b179-2552-48e4-8f15-9945bf929372	pregunta-dgt-b-016	No	f	3
4a572aa1-0f6a-4f18-9163-894e282d1ba8	pregunta-dgt-b-017	Únicamente el alumbrado de posición	f	1
1e2f0108-a0aa-429f-84ae-efb19800a281	pregunta-dgt-b-017	El de posición y el de corto alcance	t	2
b3de7b8d-fac7-45e9-98f2-1abeb3d43ffb	pregunta-dgt-b-017	No es necesario que utilice ningún alumbrado	f	3
e89c620a-b5ef-4ebd-82bc-454d1ffb8b38	pregunta-dgt-b-018	No, ya que la velocidad es mas consciente	f	1
5820cc9c-2039-4dea-a294-4b89bd2b90f2	pregunta-dgt-b-018	Si, siempre	t	2
37ffb5a7-f148-431d-bd01-3426df5232a3	pregunta-dgt-b-018	Únicamente aumentara si hacemos movimientos bruscos	f	3
67ab5a15-b579-4a20-b907-28df86bc4a2d	pregunta-dgt-b-019	Únicamente para los camiones	f	1
9e5cf406-2ec3-4cd3-9361-87512cee5c5e	pregunta-dgt-b-019	Si	f	2
dac57eb0-15c4-4b51-87b8-e667443441c0	pregunta-dgt-b-019	No	t	3
18e34aee-045b-4b26-a472-e47cbf3a2fd1	pregunta-dgt-b-002	aumenta el numero de distracciones al volante	t	1
91f57aee-eeca-4bbe-bdc7-f1f6d6261fa2	pregunta-dgt-b-002	disminuye el numero de distracciones al volante	f	2
8375c390-9ac8-44e6-99ea-3a6da31701ab	pregunta-dgt-b-002	aumenta la capacidad de concentración	f	3
721214f6-889b-44fa-aa75-e962348aab57	pregunta-dgt-b-020	vía y entorno	f	1
56d4a1ba-db3c-4f65-9d22-a8e8621a223f	pregunta-dgt-b-020	vehículo	f	2
04d026ca-4648-4f28-8f77-71cba3e7c6ad	pregunta-dgt-b-020	humano	t	3
6a54cb92-f53a-4771-ba0d-63fc105c1ba5	pregunta-dgt-b-021	la mayor capacidad para controlar el vehículo	f	1
f2223b22-7fb9-4639-b955-23a16fa60e7b	pregunta-dgt-b-021	la percepción de la conducción como algo peligroso	f	2
b1bd04b6-eeab-49a3-ae1f-c71608ae24e1	pregunta-dgt-b-021	la menor percepción del riesgo	t	3
6ebe73ca-5220-4694-8162-ec648afd604e	pregunta-dgt-b-005	la capacidad del conductor para mantener la concentración en el trafico disminuye	t	1
7d9edf23-8839-4863-8b86-42f8d60288ed	pregunta-dgt-b-005	el conductor mantiene la misma concentración en el trafico	f	2
33193afb-042c-42ff-ad51-80b74fc8c5f3	pregunta-dgt-b-005	la capacidad de concentración del conductor aumenta	f	3
caa92a1a-39d3-47e2-b082-9cbd7af8b510	pregunta-dgt-b-006	Los conductores de bicicletas	t	1
dd405fe5-57f3-4a25-be54-69d079922f94	pregunta-dgt-b-006	Los conductores de bicicletas y ciclomotores	f	2
88f04d7b-eae8-432d-9e1b-7b2b46c4d643	pregunta-dgt-b-006	Los peatones y los conductores de bicicletas	f	3
3835d074-95eb-41ac-8bb4-9da07fa1e19e	pregunta-dgt-b-007	Un dispositivo de alumbrado del vehículo	f	1
465fc406-9436-4471-aaed-3d4f61df2574	pregunta-dgt-b-007	Una placa de matricula reflectante	f	2
9e09f4f2-6081-49c0-a0b1-8289c1251abb	pregunta-dgt-b-007	Un dispositivo que refleja la luz procedente de una fuente luminosa	t	3
4a620f89-3af6-493a-9e5e-212438622e90	pregunta-dgt-b-008	A autobuses únicamente	f	1
69f0f94f-bd02-4989-be61-ab662b600902	pregunta-dgt-b-022	Si, pero solo en zonas peatonales	f	1
a5f2b399-0c79-4a4d-90b1-ed3bf6224317	pregunta-dgt-b-008	A tranvías, autobuses regulares y taxis	t	2
58ad685d-ff68-44f3-b340-36e86a9afacd	pregunta-dgt-b-022	Si, siempre que se utilice un dispositivo de manos libres	f	2
0abde28d-32a7-4780-8075-b042dbf3c1a9	pregunta-dgt-b-022	No, esta prohibido usar móviles o escuchar la radio al conducir un patinete	t	3
21fa85ce-0858-4b1c-be59-b9807f814893	pregunta-dgt-b-023	Percepción incorrecta del tiempo y del espacio	t	1
66063d27-62f8-4029-afea-58738255c012	pregunta-dgt-b-023	Disminución de la distancia de detención	f	2
6aefecd7-3769-4ab7-9746-3e24b9e003c5	pregunta-dgt-b-023	Ampliación del campo visual	f	3
4d7d68c9-2eaa-4fa3-a67c-7ded616f1d30	pregunta-dgt-b-050	Detenerse detrás del vehículo policial y permanecer en el interior del turismo	f	1
573a025d-182a-4a26-ae35-d86488143091	pregunta-dgt-b-050	Detenerse en el lado derecho de la calzada y descender del turismo	f	2
b8cb85b8-92a5-418a-a561-9ef67cb2dd06	pregunta-dgt-b-050	Detenerse delante del vehículo policial y permanecer en el interior del turismo	t	3
638dadcb-0ee9-4bce-b66e-251674dff8e3	pregunta-dgt-b-025	Zona e mayor observancia	f	1
3e99aaee-f7a3-4314-8cf7-41744c5af603	pregunta-dgt-b-025	Zona de vigilancia	f	2
4fff0d68-16ef-40bd-b146-f40df6303b35	pregunta-dgt-b-025	Zona de incertidumbre	t	3
cddce2dc-b160-4fb6-8d62-0932ec04a2d8	pregunta-dgt-b-026	1 año	f	1
27de9677-53a3-4474-b685-88c3831aeda4	pregunta-dgt-b-026	3 años	f	2
4d502b07-c42b-4da2-b1b8-1f32e9c96a34	pregunta-dgt-b-026	2 meses	t	3
18ff8ae2-eee1-4511-a3ed-349580800fd8	pregunta-dgt-b-027	Cinturones de seguridad, airbags, reposacabezas y casco	t	1
d40d0fea-0ed5-4914-9539-676874511634	pregunta-dgt-b-027	Frenos, neumáticos, airbags y cinturones de seguridad	f	2
7e523144-9d29-41c4-baf5-003a263a5d85	pregunta-dgt-b-027	Alumbrado, neumáticos, frenos y suspensión	f	3
6d84cf3f-d64f-40b9-8049-b973303ee4d0	pregunta-dgt-b-028	Si, de todo tipo pero con moderación	f	1
7effe869-59ee-4b10-a70e-5fa2019f385a	pregunta-dgt-b-028	Únicamente podremos proporcionarles antinflamatorios	f	2
c16b3d56-994b-4fca-81cc-7b6ed145b047	pregunta-dgt-b-028	No, en ningún caso	t	3
0cb1eda3-786d-4205-adb4-8bec67d89090	pregunta-dgt-b-029	No	t	1
85405a40-986d-4260-9e02-9c65be033fd5	pregunta-dgt-b-029	Si, tiene preferencia en todo tipo de vías	f	2
ae33bd13-3bcf-4b39-a8c3-a9214cb63082	pregunta-dgt-b-029	Solo tiene preferencia en las vías urbanas	f	3
91da78e3-8df1-435e-8450-682e3c658b51	pregunta-dgt-b-051	No, únicamente existe la de estacionamiento prohibido los días impares	f	1
b1a8f442-37c9-4a57-8ff2-630ea950c39a	pregunta-dgt-b-051	Si	t	2
0dfce13b-3c49-4278-b667-684be470cf06	pregunta-dgt-b-051	No solo existe la de estacionamiento prohibido la primera quincena	f	3
790ae47f-fe09-407b-89b1-25e0d2390a7c	pregunta-dgt-b-008	A autobuses y autocares	f	3
ef2d372d-00c8-4902-8ba2-ce9112715537	pregunta-dgt-b-024	Que hay una curva peligrosa a 50km/h	f	1
087350cb-d701-44b4-bf78-b8c2c58bfd07	pregunta-dgt-b-024	Que hay 50 km de curvas	f	2
b591bd3f-c5d3-4f77-9e75-3c05494ae248	pregunta-dgt-b-024	Que en esta curva peligrosa la velocidad máxima permitida es de 50km/h	t	3
5cd5c155-715d-4d0d-b0c2-0cd949ddcd65	pregunta-dgt-b-052	el final de una autovía	t	1
5bd531c1-36da-423a-a637-f97726b1a951	pregunta-dgt-b-052	el principio de una autovía	f	2
da5ecf6a-cd4d-4c4e-b915-44189302ace3	pregunta-dgt-b-052	que se circula por un carril que conduce a una autovía	f	3
f06c2345-d304-4589-abfd-e907a35eba7e	pregunta-dgt-b-053	Moderar la velocidad y si fuera necesario detener el vehículo	t	1
2206c2b0-1531-48ee-94af-55155334c690	pregunta-dgt-b-053	Ninguna, si no vienen vehículos en sentido contrario	f	2
e49d3b64-129b-407d-83cd-6ae46756cbf7	pregunta-dgt-b-053	Mantener la velocidad y estar atento para cumplir con la señalización vertical	f	3
2af12d0e-fb5d-46f9-a8ca-856e8949e750	pregunta-dgt-b-054	Somnolencia	f	1
3a0cf681-0570-47f5-a837-ff26f8ac0871	pregunta-dgt-b-054	Aumento de la capacidad de concentración	f	2
b757fec3-87c0-4b7c-8afe-f07492733d72	pregunta-dgt-b-054	Distracciones y problemas de visión a causa del humo	t	3
38e8c915-0544-40a0-a2f5-215fca30c3ed	pregunta-dgt-b-055	Si, si se puede realizar sin peligro, aunque tenga que invadir el sentido contrario	t	1
164079b5-278c-4dd2-81ec-08c32378cfdd	pregunta-dgt-b-055	No, ya que lo prohíbe la lineal continua	f	2
832f9da3-0a72-424e-b7cb-51509849b3f9	pregunta-dgt-b-055	Si, únicamente su lo hace sin invadir el sentido contrario	f	3
458298c4-be5d-4302-88fa-8eecf366a607	pregunta-dgt-b-056	No, en absoluto	f	1
3be752be-e393-4902-bc4f-48141adbb99b	pregunta-dgt-b-056	Solo si el conductor no esta habituado a consumirlas	f	2
dc568d36-52dd-482a-a728-9fb04eef19f5	pregunta-dgt-b-056	Si, ya que alteran de modo importante las capacidades del conductor	t	3
d31e76ea-ccb1-49e9-a9a1-be3388438a2f	pregunta-dgt-b-057	Dentro de la calzada lo mas posible pagado al arcén derecho	f	1
6a8c5c8d-6fa5-445b-8426-267a6b0216ef	pregunta-dgt-b-057	Fuera de la calzada en el lado izquierdo de la misma	f	2
a22aca3e-9540-4364-bc35-536325428b7c	pregunta-dgt-b-057	Fuera de la calzada en el lado derecho de la misma	t	3
a28fa130-899b-495d-b760-a8c3356776bf	pregunta-dgt-b-058	No, únicamente podrá utilizar la señales ópticas	f	1
648854d0-2b53-40b7-805b-296e653617c8	pregunta-dgt-b-058	Si, pero únicamente envías dentro de poblado	f	2
637f1e8c-0bc8-4b62-8ba2-e31a53e438e3	pregunta-dgt-b-058	Si, para avisar al resto de usuario de la vía de su presencia	t	3
29bd13ac-f489-49ab-8b8f-7532d636ddd6	pregunta-dgt-b-009	Las extremidades inferiores	f	1
b3d58078-0d15-44a2-b42f-802777ce2a26	pregunta-dgt-b-009	El torso	f	2
09890f89-0d29-4643-9ac6-ccf81795c31f	pregunta-dgt-b-009	La cabeza y otras partes vitales del cuerpo	t	3
a1c1e118-848f-4114-82da-471e4f2ce820	pregunta-dgt-b-060	Si, puede estar instalada aunque no se utilice	t	1
26ce8b0e-f5fd-47ce-9944-708efb07df7d	pregunta-dgt-b-060	No esta permitido instalar una baca en un vehículo en ninguna situación	f	2
ec135534-df07-4ae3-aa2d-a4e04378763b	pregunta-dgt-b-060	No, es obligatorio desmontarla cuando no se utilice	f	3
80cad3f3-1d6d-41d8-adf1-f61b70b3bda6	pregunta-dgt-b-059	No	t	1
ba63fa81-07ce-4254-b647-fef92e65d471	pregunta-dgt-b-059	Si, siempre que el herido este consciente	f	2
ac3a0141-aec4-40a6-8d64-6101d845ff60	pregunta-dgt-b-059	Si, hay que sacarlos siempre cuanto antes para evitar que se asfixie	f	3
2ff61ae8-e308-40e2-9120-6b62d43dbee7	pregunta-dgt-b-031	Con el brazo extendido y la palma de la mano hacia atrás	t	1
f9a584e7-6e03-493e-84a1-bad9e5ff78e8	pregunta-dgt-b-031	Moviendo el brazo de arriba a abajo	f	2
fb38f6dd-7760-49bb-8afe-af94fa333ab6	pregunta-dgt-b-031	Advirtiendo con el claxon	f	3
3e3e9e77-55a0-41c5-bdd6-2f3f49eba50d	pregunta-dgt-b-032	No	f	1
033d716e-8f8c-49cd-9ba1-bbecd04eca1d	pregunta-dgt-b-032	Si, porque se incorpora por la derecha	t	2
ab7ae894-2d6d-4005-aafa-9b02c64714c7	pregunta-dgt-b-032	Solo si el vehículo blanco esta destinado a servicio publico	f	3
b8ebe911-74ee-4f92-96a8-5b96bd56815d	pregunta-dgt-b-033	Activa	t	1
0b772cb9-a354-4eeb-b06a-8e45ab37e72f	pregunta-dgt-b-033	Activa y pasiva a la vez	f	2
696bdf36-10d3-4c8d-95fa-a65045ce15f9	pregunta-dgt-b-033	Pasiva	f	3
a154252f-94c4-414b-aecf-cf5007ddb1e0	pregunta-dgt-b-034	Los cuatro neumáticos	f	1
319ee6ad-3a2d-451e-86b1-eab5a3206efe	pregunta-dgt-b-034	Los traseros	f	2
c382d8a4-b150-4be6-9048-103c4e9821a9	pregunta-dgt-b-034	Los delanteros	t	3
849ad007-1695-499d-96fc-ac648e9ebc4f	pregunta-dgt-b-035	Si pero solo puede ser utilizada durante el día	f	1
ae2e702a-f5d2-468d-adce-55b9514a810b	pregunta-dgt-b-035	Si para todos los vehículos	f	2
2e99d59a-bf60-4772-ad70-da0aa6a45a61	pregunta-dgt-b-035	No	t	3
1a872719-1c6c-45c6-98b0-99b710032e0e	pregunta-dgt-b-036	Que maneja el volante del vehículo cuando circula realizando practicas	f	1
1eab299c-289b-4315-b798-b3dc7cf40333	pregunta-dgt-b-036	Que conduce a pie un velocípedo o ciclomotor de dos ruedas	f	2
2b61d550-25cc-4225-a7ae-3d86e6852d34	pregunta-dgt-b-036	Que maneja el mecanismo de dirección o conduce un vehículo	t	3
3cb37c58-606b-4b08-8ea7-01f22418f117	pregunta-dgt-b-037	No	f	1
8294c5b9-224b-42ee-8e22-9c207460f23c	pregunta-dgt-b-037	Si, porque es mejor evitar conducir	f	2
94d5b831-09a5-47d9-9666-bc3d3c002878	pregunta-dgt-b-037	Si, puede aumentar la fatiga	t	3
2e9eb0c8-6d16-42c6-abdb-9bd37afde513	pregunta-dgt-b-038	Si, por razones de seguridad vial o fluidez de la circulación	f	1
c1afaa5b-5d46-4aae-abbe-393e9d3e32aa	pregunta-dgt-b-038	No, podrá ser permanente y con un horario en función de las necesidades de la circulación	t	2
e1182ea1-d6a3-4c6d-97c7-c5aa69ba3edd	pregunta-dgt-b-038	Si, siempre estará habilitado a primera hora de la mañana hasta primera hora de la tarde	f	3
dd8e397d-4ef7-455a-a6b0-a662c5b716d6	pregunta-dgt-b-039	Que el carril de la derecha se desvía	t	1
8d57561e-6c08-44cd-9b2d-3d09018ea4b2	pregunta-dgt-b-039	Que el carril de la derecha es obligatorio para el trafico lento	f	2
7c6565fa-4930-4b95-a35a-5dead465feea	pregunta-dgt-b-039	Que el carril de la derecha finaliza	f	3
94f25be1-d3a7-4aef-9a27-3584286bee88	pregunta-dgt-b-040	debe tener en cuenta las características del vehículo que circula delante	f	1
e92bceb2-ba0e-4beb-a7cc-5dd7cd0f84d1	pregunta-dgt-b-040	debe tener en cuenta la velocidad, exclusivamente	f	2
111a7473-b00a-4410-8584-898cd60e484c	pregunta-dgt-b-040	debe tener en cuenta la velocidad, la visibilidad y el estado de la calzada	t	3
e5e583ff-91d1-48cf-af5d-44925b0f2bea	pregunta-dgt-b-041	Si	t	1
832dc4ea-b7c9-480b-9a39-ddded70f907f	pregunta-dgt-b-041	No, únicamente depende del tipo de alcohol que se ingiera	f	2
7e4d02fd-6b32-4961-922c-cc9b9d37be30	pregunta-dgt-b-041	No, el alcohol solamente afecta en características físicas del conductor	f	3
67d20ac7-dad2-4d58-9e16-6e9eb9e647d0	pregunta-dgt-b-042	Visibilidad reducida	t	1
4bee2686-f2c6-45bb-86b9-c4d7cdcbfa95	pregunta-dgt-b-042	Obstrucción en la calzada	f	2
0d2a9ff2-3eb9-4151-a571-3b3bfb945520	pregunta-dgt-b-042	Proyección de gravilla	f	3
fecb6447-a41b-4bab-91d3-e5358a48dda7	pregunta-dgt-b-043	debe comprobarse, como mínimo, dos veces al año	f	1
0834180a-22fb-4d99-9ede-7e0c0b5685ae	pregunta-dgt-b-043	debe comprobarse con frecuencia y siempre antes de iniciar un viaje largo	t	2
cafaa3a5-3467-43c5-9435-ee81de2750aa	pregunta-dgt-b-043	debe comprobarse cada tres meses	f	3
4fb5b0d1-f99c-4c57-a02f-65b10ee0eb7a	pregunta-dgt-b-044	Con un panel reglamentario en el extremo de la carga	f	1
e0b8dbc9-e49e-4ba9-9acd-277e969a196f	pregunta-dgt-b-044	De noche con una luz roja por la parte trasera	f	2
b91a8253-603c-429d-8405-e2879653180e	pregunta-dgt-b-044	En la motocicletas, no es necesario señalizar la carga	t	3
ac737bf3-4625-45fa-be19-b3e3653bfd73	pregunta-dgt-b-045	Abandonare el carril lo antes posible	t	1
ff829589-ab97-4a26-8a74-9c54b3ff66d2	pregunta-dgt-b-045	Detendré el vehículo a la altura del semáforo	f	2
d7f92f29-5691-407a-a388-5a013b6b32ef	pregunta-dgt-b-045	Cambiare de carril antes de llegar al semáforo	f	3
260ede80-e183-4dc2-91a5-286d0cb90326	pregunta-dgt-b-046	Salida de núcleo urbano	f	1
929f4447-5ac6-40e0-8afa-64a3a4bc273e	pregunta-dgt-b-046	Fin de poblado	t	2
c25bba37-9597-4c35-a518-620c5b53b775	pregunta-dgt-b-046	Salida de poblado	f	3
6ddc5940-3646-455d-85d8-fde4d90d35e2	pregunta-dgt-b-047	Porque es incomodo para el conductor que se le quite el casco	f	1
8b1d72e6-7b62-4739-bb5d-fadd33103b9a	pregunta-dgt-b-047	Porque puede tener mas frio	f	2
2b986624-9d4b-4bab-adf2-9b6da119aaef	pregunta-dgt-b-047	Porque se pueden agravar las posibles lesiones	t	3
aa5fbc98-ce91-4086-b311-ef0e4e090e1d	pregunta-dgt-b-048	En un pedal, con el pie izquierdo	f	1
f3827102-f038-44ff-9313-481dd998f059	pregunta-dgt-b-048	En el manillar con la mano izquierda	f	2
afd7cee9-6e06-458d-b058-f5221b01b69f	pregunta-dgt-b-048	En el manillar con la mano derecha	t	3
08ff94ce-a250-4457-a71d-24e9e1dc502d	pregunta-dgt-b-049	únicamente el propósito de frenar su vehículo	f	1
77015528-ab20-41aa-83f0-9353d6d48543	pregunta-dgt-b-049	solo las maniobras que no impliquen un desplazamiento lateral	f	2
0e0ff655-d0df-4938-8b9c-23d4195c4975	pregunta-dgt-b-049	el propósito de inmovilizar su vehículo o frenar su marcha de forma considerable	t	3
\.


--
-- Data for Name: solicitudes_examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitudes_examen (id, "alumnoId", tipo, estado, "fechaSolicitud", "fechaProgramada", observaciones) FROM stdin;
solicitud-examen-001	33333333-3333-3333-3333-333333333333	TEORICO	PENDIENTE	2026-08-21 10:00:00	\N	Pendiente de revisar el bloque de teoría.
solicitud-examen-002	33333333-3333-3333-3333-333333333333	PRACTICO	PROGRAMADO	2026-08-19 10:00:00	2026-09-18 10:00:00	En espera de realizar la práctica final.
\.


--
-- Data for Name: tarifas_concepto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarifas_concepto (id, permiso, concepto, precio, tipo, descripcion, activa, "createdAt", "updatedAt") FROM stdin;
c864359d-a6b4-4a4a-9435-d99c3e257127	B	Clase Práctica	30.00	FIJO	Clase de circulación de 45 minutos	t	2026-09-07 06:50:07.75	2026-09-07 06:50:07.75
1be87a19-279a-4fa5-93c6-e11139c501f6	B	Psicotécnico	45.00	FIJO	Obligatorio antes de presentarse al examen teórico	t	2026-09-07 15:19:01.239	2026-09-07 15:19:01.239
c5bd550a-a0d3-45c2-aed2-3cc580ee498e	B	Tramitación del expediente	40.00	FIJO	Gastos de gestión de la autoescuela ante la Jefatura de Tráfico	t	2026-09-07 15:20:14.277	2026-09-07 15:20:14.277
10ace89b-f2eb-4505-9478-5a2fe310d11f	B	Gastos por examen práctico	50.00	FIJO	Alquiler de coche de doble mando y acompañamiento del profesor	t	2026-09-07 15:21:29.631	2026-09-07 15:21:29.631
b73b5630-f71f-4eca-95cb-db27f914e84b	C	Psicotécnico C	55.00	FIJO	Reconocimiento médico especifico para conductores profesionales	t	2026-09-07 15:22:56.81	2026-09-07 15:22:56.81
afbac2f7-126b-47d1-a6f1-e9a31a6579fd	C	Clases de Maniobras (Circuito)	50.00	FIJO	Prácticas de aparcamiento, marcha atrás y aproximación en pista	t	2026-09-07 15:24:28.606	2026-09-07 15:24:28.606
c76b4a2f-8260-4315-a20c-16b676a68d98	C	Clases de circulación	70.00	FIJO	Prácticas de conducción en vías abiertas con camión rígido	t	2026-09-07 15:25:28.25	2026-09-07 15:25:28.25
c866269e-c702-42f3-9e84-b7dcc213b0c0	C	Exámenes Prácticos (Pista y Calle)	80.00	FIJO	Tasa de la autoescuela por cada presentación práctica	t	2026-09-07 15:26:39.618	2026-09-07 15:26:39.618
834e187a-9bd7-442a-ad11-98ae0da30a96	C	Curso de CAP inicial (Mercancías)	1000.00	FIJO	Certificado de Aptitud Profesional. Imprescindible para trabajar como conductor. Curso de 140 horas + examen propio	t	2026-09-07 15:28:07.761	2026-09-07 15:28:07.761
104a3e04-4f33-48a4-8474-d19f1b96396f	A	Psicotécnico	40.00	FIJO	Certificado médico de aptitud	t	2026-09-07 15:37:09.092	2026-09-07 15:37:09.092
b85d8563-ada4-451f-bd3b-022b42b65890	A	Tramitación de expediente	45.00	FIJO	Gestión de la autoescuela	t	2026-09-07 15:37:59.761	2026-09-07 15:37:59.761
44230552-46d8-4256-8e33-0817ebf4e8e1	A1	Psicotécnico	50.00	FIJO	Certificado médico obligatorio	t	2026-09-07 15:38:58.711	2026-09-07 15:38:58.711
d2cf80e8-0f6b-41a7-a1bf-eca51fbaea2a	A2	Psicotécnico	50.00	FIJO	Certificado médico obligatorio	t	2026-09-07 15:39:18.721	2026-09-07 15:39:18.721
e5e918f6-84cb-49c3-b432-c6adac7da6c9	A1	Clases de maniobras (Circuito cerrado)	25.00	FIJO	Prácticas en circuito cerrado (precio por sesión de 30 minutos)	t	2026-09-07 15:41:02.925	2026-09-07 15:41:02.925
ca27fc75-5c0d-43da-aae9-6eaa1c7dd804	A2	Clases de maniobras (Circuito cerrado)	25.00	FIJO	Prácticas en circuito cerrado (precio por sesión de 30 minutos)	t	2026-09-07 15:41:20.075	2026-09-07 15:41:20.075
e33d45fe-9e50-4cac-a864-ee1f9674e96b	A1	Clases de circulación (Abierto)	55.00	FIJO	Prácticas en tráfico real con intercomunicador	t	2026-09-07 15:42:33.336	2026-09-07 15:42:33.336
c5c963fe-4604-4d94-98dc-3904d2b465b4	A2	Clases de circulación (Abierto)	55.00	FIJO	Prácticas en tráfico real con intercomunicador	t	2026-09-07 15:42:43.71	2026-09-07 15:42:43.71
bd3f10df-4cc5-4b12-b5a0-9d6fa9fe1187	A1	Derechos de examen (Circuito y circulación)	50.00	FIJO	Cobro de autoescuela por presentación y traslado	t	2026-09-07 15:44:54.139	2026-09-07 15:44:54.139
fe2e136e-8d14-47e2-b0fd-92927be5dfa6	A2	Derechos de examen (Circuito y circulación)	50.00	FIJO	Cobro de autoescuela por presentación y traslado	t	2026-09-07 15:45:05.772	2026-09-07 15:45:05.772
0c77ebcc-437c-4472-92d1-a93d75dc8994	B	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
d3fff776-502e-4970-a998-2d517cb99ecf	A	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
f2d8d056-e88a-4503-adb3-c0ebf8378267	A1	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
25889e0b-02b1-4e05-848c-ec1b0d363de0	A2	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
6fc24e49-7b9f-4f53-9c6b-d485abaf43af	C	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
66e78840-1230-4e33-aad1-d6505b6c26e1	D	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
10dca9eb-2477-40a7-a543-803c883936ea	E	Tasa DGT (Tasa 2.1)	94.05	FIJO	Obligatoria. Da derecho a 2 convocatorias combinadas	t	2026-09-08 16:28:52.071	2026-09-08 16:28:52.071
\.


--
-- Data for Name: tarifas_concepto_historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarifas_concepto_historial (id, "tarifaConceptoId", permiso, concepto, "precioAnterior", "precioNuevo", motivo, "usuarioId", "createdAt") FROM stdin;
\.


--
-- Data for Name: tarifas_matricula; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarifas_matricula (id, licencia, precio, activa, "createdAt", "updatedAt") FROM stdin;
a3985cdf-b151-4349-9769-8500c9144765	B	220.00	t	2026-09-07 06:41:13.241	2026-09-07 08:19:41.652
d3969c92-6c8b-4707-90fa-26936e452d4d	A1	150.00	t	2026-09-07 06:41:13.246	2026-09-07 08:19:41.667
9bc0f462-f301-4a9f-a0ea-46f87d6998fb	A2	180.00	t	2026-09-07 06:41:13.25	2026-09-07 08:19:41.674
2ff21622-1246-4d74-b7ce-2d9429f82f1a	A	300.00	t	2026-09-07 06:41:13.258	2026-09-07 08:19:41.679
f55e1fd6-26a1-4a64-97f7-f0e06b3caa41	C	450.00	t	2026-09-07 06:41:13.261	2026-09-07 08:19:41.682
915bb038-e793-4827-b06f-4e898441df7d	D	550.00	t	2026-09-07 06:41:13.265	2026-09-07 08:19:41.685
74776ec4-ae53-4b81-ac44-e344ceacc717	E	300.00	t	2026-09-07 06:41:13.269	2026-09-07 08:19:41.694
\.


--
-- Data for Name: temarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temarios (id, titulo, descripcion, orden, "tipoLicenciaObjetivo", "documentacionRuta", "claseDirectoVideoUrl") FROM stdin;
temario-002	Señales de Circulación	Señales de advertencia. Señales de reglamento. Señales de indicación y Marcas viales.	2	{B,C}	/api/uploads/temarios/d0c30cb1-763f-41d1-8b7b-6aa7f487fe1c.pdf	\N
temario-003	Semáforos y Agentes	Semáforos. Señales de los agentes. Ordenes verbales. Ordenes gestuales.	3	{B,C}	/api/uploads/temarios/b22dc5c2-343f-4ed1-a56b-7dd4a0fd563b.pdf	\N
temario-004	Vehículo	Partes del vehículo. Luces y dispositivos de alumbrado. Mantenimiento. Carga y remolque. Documentación.	4	{B}	/api/uploads/temarios/556ef3bf-a7f0-4129-85e3-a3a3e7505a12.pdf	\N
temario-005	Usuarios en la Vía	Peatones. Ciclistas. Motoristas. Personas con movilidad reducida. Otros vehículos.	5	{B,C}	/api/uploads/temarios/7afc82e9-7b6d-42d2-8c2d-3307edcd9de2.pdf	\N
temario-006	Seguridad Vial	Factores de riesgo. Velocidad. Alcohol y drogas. Cinturón y SRI. Conducción responsable.	6	{B,C}	/api/uploads/temarios/a037e541-4c6c-4e32-abbf-17560322c68d.pdf	\N
temario-007	Maniobras	Giros. Cambios de sentido. Marcha atrás. Estacionamiento. Incorporación a la circulación.	7	{B}	/api/uploads/temarios/1659ff6d-7984-46f6-9a2c-79a61c4a3f8e.pdf	\N
temario-008	Primeros Auxilios	Actuación ante accidentes. Posición lateral de seguridad. Hemorragias. RCP básica.	8	{B}	/api/uploads/temarios/1713eb5c-7d5b-46bb-a637-a33c6ace24d2.pdf	\N
00447386-974a-4f91-864d-d423adb3c696	Maniobras Camión	Giros. Cambios de sentido. Marcha atrás. Estacionamiento. Maniobras con el camión.	7	{C}	\N	\N
7ffa9f42-0a83-4dd8-8f20-decfb6bfa42b	Carga y Mercancías	Estiba y sujeción. Distribución de cargas. Peso y dimensiones. Transporte de mercancías peligrosas (ADR básico)	8	{C}	\N	\N
bd235cdb-05bd-4877-9141-3211ea60bed6	Conducción eficiente	Ahorro de combustible. Impacto ambiental. Conducción previsora. Tratamiento preventivo.	9	{C}	\N	\N
390365cb-0cb5-4665-bbc2-1b7396d46547	Permisos y Documentación	Permiso de conducir. Documentación del conductor y del vehículo. Inspecciones (ITV). Autorizaciones.	10	{C}	\N	\N
20bad13c-76aa-444a-a2b6-f1cfe1619d87	Vehículo Camión	Partes del vehículo. Luces y dispositivos de alumbrado. Mantenimiento. Carga y remolque. Refrigeración.	4	{C}	\N	\N
temario-001	Normas de Circulación	Reglas Generales. Circulación: sentido y velocidad. Adelantamientos. Paradas y estacionamientos. Prioridades.	1	{B,C}	/api/uploads/temarios/d3fc55ee-1961-447c-9e10-e3a523aee468.pdf	https://www.youtube.com/watch?v=dQw4w9WgXcQ
\.


--
-- Data for Name: temarios_progreso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temarios_progreso (id, "alumnoId", "temarioId", revisado, dominio, "ultimaRevision") FROM stdin;
progreso-temario-001	33333333-3333-3333-3333-333333333333	temario-001	t	90	2026-08-12 10:00:00
progreso-temario-002	33333333-3333-3333-3333-333333333333	temario-002	f	45	2026-08-15 10:00:00
progreso-temario-003	33333333-3333-3333-3333-333333333333	temario-003	t	82	2026-08-16 10:00:00
progreso-temario-004	33333333-3333-3333-3333-333333333333	temario-004	f	55	2026-08-09 10:00:00
progreso-temario-005	33333333-3333-3333-3333-333333333333	temario-005	t	75	2026-08-18 10:00:00
progreso-temario-006	33333333-3333-3333-3333-333333333333	temario-006	f	30	2026-08-04 10:00:00
progreso-temario-007	33333333-3333-3333-3333-333333333333	temario-007	f	40	2026-08-06 10:00:00
progreso-temario-008	33333333-3333-3333-3333-333333333333	temario-008	t	88	2026-08-19 10:00:00
48c1b013-aba2-44ff-8928-ec5c17a29407	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-003	t	80	2026-09-07 14:20:11.781
204b47e6-bf77-4981-930a-801e5c275540	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-001	t	100	2026-09-08 09:54:32.37
a2bcaad1-7624-4f97-bfdb-dc0ba617cc1b	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-002	t	100	2026-09-08 09:55:20.19
d0c5ddf1-0b79-4711-8dca-f57d8f35bd0c	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-004	t	100	2026-09-08 09:55:59.659
04cd5402-495a-4394-9a26-af585fcfd0fa	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-005	t	80	2026-09-08 09:56:55.502
930fe84e-98c0-4253-9909-6a6c830727ff	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-006	t	80	2026-09-08 09:57:57.098
40126be5-16fa-4d07-a7bf-504244e93543	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-007	t	100	2026-09-08 09:58:50.562
3e629bea-5df3-4371-9467-ce02a6d2d790	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-008	t	100	2026-09-08 09:59:30.866
\.


--
-- Data for Name: tests_practica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tests_practica (id, "alumnoId", "temarioId", fecha, resultado, "respuestasCorrectas", "totalPreguntas") FROM stdin;
test-001	33333333-3333-3333-3333-333333333333	temario-001	2026-08-03 10:00:00	APROBADO	18	20
test-002	33333333-3333-3333-3333-333333333333	temario-003	2026-08-04 10:00:00	APROBADO	17	20
test-003	33333333-3333-3333-3333-333333333333	temario-002	2026-08-05 10:00:00	SUSPENDIDO	11	20
test-004	33333333-3333-3333-3333-333333333333	temario-005	2026-08-06 10:00:00	APROBADO	19	20
test-005	33333333-3333-3333-3333-333333333333	temario-006	2026-08-07 10:00:00	SUSPENDIDO	13	20
test-006	33333333-3333-3333-3333-333333333333	temario-008	2026-08-08 10:00:00	APROBADO	16	20
test-007	33333333-3333-3333-3333-333333333333	temario-004	2026-08-09 10:00:00	SUSPENDIDO	12	20
test-008	33333333-3333-3333-3333-333333333333	temario-001	2026-08-10 10:00:00	APROBADO	18	20
test-009	33333333-3333-3333-3333-333333333333	temario-003	2026-08-11 10:00:00	APROBADO	17	20
test-010	33333333-3333-3333-3333-333333333333	temario-002	2026-08-12 10:00:00	SUSPENDIDO	10	20
test-011	33333333-3333-3333-3333-333333333333	temario-005	2026-08-13 10:00:00	APROBADO	19	20
test-012	33333333-3333-3333-3333-333333333333	temario-008	2026-08-14 10:00:00	APROBADO	18	20
419ec06f-331a-4019-9827-0c5bb63398dd	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-003	2026-09-07 14:19:26.755	SUSPENDIDO	3	5
b06ff351-9fb6-4548-8dd5-0332e26b3890	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-003	2026-09-07 14:20:11.771	APROBADO	4	5
502ae144-b778-46b9-9af9-a9efd4bbd798	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-001	2026-09-08 09:54:32.334	APROBADO	5	5
8de43c7f-5c34-4ada-9ce3-f67997dc5698	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-002	2026-09-08 09:55:20.185	APROBADO	5	5
359b2c2c-750d-42d0-821e-5f0d26c27056	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-004	2026-09-08 09:55:59.65	APROBADO	5	5
389f3803-bbe0-4c42-a478-ab26a6bb6d62	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-005	2026-09-08 09:56:55.497	APROBADO	4	5
f9414912-16d7-4a5f-aed7-a05a6eb6ea21	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-006	2026-09-08 09:57:57.093	APROBADO	4	5
aabb058d-58fe-4d47-9583-e756ff8e4725	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-007	2026-09-08 09:58:50.557	APROBADO	5	5
3295fda8-607a-4314-9ac3-c8f29c17d039	74ea708b-d88c-4a1b-ab13-9e16c51a38d4	temario-008	2026-09-08 09:59:30.862	APROBADO	5	5
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, "passwordHash", rol, "fechaCreacion", telefono, dni, "requiereCambioPassword") FROM stdin;
11111111-1111-1111-1111-111111111112	Luis Felipe Fuente Ureta	pandozales@yahoo.es	$2b$10$zObMPvKQuC9di.2z7EuKqeDHqEQXjBtVuBXFch.H/0TKs2vvA.ydq	ADMIN	2026-09-07 06:41:13.044	670710470	72253913B	f
11111111-1111-1111-1111-111111111111	Admin Demo	admin@autoescuela.com	$2b$10$atUPbN3KTsJatFPlMfXtXeHX24lgvIlEnoGWk2VwXE0ccWvYLbspG	ADMIN	2026-09-07 06:41:13.044	600000001	00000000A	f
22222222-2222-2222-2222-222222222222	Profesor Demo	profesor@autoescuela.com	$2b$10$7iCwDqFzyo6JFj9gANfrpuwDx53qzOgyrbQDAZrJuwv1/5pNl0JFm	PROFESOR	2026-09-07 06:41:13.056	600000002	11111111B	f
33333333-3333-3333-3333-333333333333	Alumno Demo	alumno@autoescuela.com	$2b$10$FrSosWUKT.Du5d.bnuwocu8qfveLDfLUWJWJJJWz/8lN3GlA1g4Um	ALUMNO	2026-09-07 06:41:13.06	600000003	22222222C	f
74ea708b-d88c-4a1b-ab13-9e16c51a38d4	David Ruiz Cortes	drc@gmail.com	$2b$10$GCImJE3LsUMH7R1qLjUiKOvHySzXn4Ccb4X7fjsh7Y95BU9xYhsCa	ALUMNO	2026-09-07 07:25:11.933	666339563	54630012F	f
e3a5a66a-e63d-4cee-9ef1-79265fbe4b1a	Sergio Cano Cabezas	cano0085@gmail.com	$2b$10$0KO6rpnc5ys0Bss6KA5L9.0pv/qtGCFGxU/DkBK.papd4/2/H9Nja	PROFESOR	2026-09-07 08:37:58.902	634516593	53563594K	f
a7a94770-62cb-40e4-abd5-3fa8455a900e	Roberto Ruiz Romeral	roberto25@gmail.com	$2b$10$NDergYheZkSu0DZDEgWTiuClBcKbv3EAGLHLLTJoHBdjYHddPyoMe	PROFESOR	2026-09-07 08:38:49.435	638542911	82456691N	f
3849e347-268b-409f-a0e0-072ba912b7ad	Naim Chouriete Ranedo	ncr@gmail.com	$2b$10$t12vydllHxyLmqHfe/JyYufIt49dHcnZEzKfPMPQ3LG1EmBUNuIjO	ALUMNO	2026-09-07 15:12:12.517	669107774	54812245G	f
8444ae56-b039-47cd-9010-77721e2619f9	Adrián Arcas Cano	adri_arcas_cano@gmail.com	$2b$10$qPXKPuaOdFKXQ2O9sgZqqOPtjtwvlwIyAg8DsfKrE5IMxRslyyuiG	ALUMNO	2026-09-07 15:11:09.504	699852103	54589124K	f
0c02fb90-2481-43a5-b6ec-bd56c0b343d7	Iván Álvarez Gonzalez	ivi1985@gmail.com	$2b$10$ftlSNRClfRwSFrMvSlu/AevzjicB1bRVCWNczjkGN60C4cc9xr59C	ALUMNO	2026-09-07 15:09:59.007	652118754	54598201P	f
\.


--
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (id, matricula, marca, modelo, "tipoPermiso", activo, "imagenRuta") FROM stdin;
vehiculo-001	1234-ABC	Seat	Ibiza	B	t	/api/uploads/vehiculos/1bc9207d-1018-4510-a5b6-1da6be01f81d.png
89fc763e-e90f-49c0-b0c4-bd0c2834467b	4312-XYZ	Volvo	FH Series	C	t	/api/uploads/vehiculos/8c0e3634-e0a4-4205-bf83-a030bf5082c2.jpg
d37a9ab4-ef37-48ca-85a8-db8ef13d2712	6652-IJK	Toyota	Yaris	B	t	/api/uploads/vehiculos/a42c76fd-eabc-485a-9e85-3d7265932f1b.png
563df293-8973-42b9-98f7-42a0a7bc89e1	8873-DEF	Honda	CB500F	A2	t	/api/uploads/vehiculos/1a4e4dfd-105a-4f67-ab97-c40d03962b03.png
2f075c40-82df-4e29-835a-2833ec8ab5de	1202-MNO	Mercedes	Actros	C	t	/api/uploads/vehiculos/a757f4a0-d039-4183-b91a-d073408f6ed5.png
85fbbacd-4405-4511-aa0e-287a0c80f2bd	0198-XYZ	Yamaha	MT-07	A2	t	/api/uploads/vehiculos/15113ee7-df82-4be6-80ca-6e4fb8714c4f.png
6c8b3060-9783-460b-ae46-38abf506d4d5	1240-VAL	Dacia	Sandero	B	t	/api/uploads/vehiculos/045d3a27-8095-4b59-ac35-a987675b347a.png
e5afdff1-76e6-46bf-b9fc-993d534307e5	5584-PPT	Man	Lion's City	D	t	/api/uploads/vehiculos/fef93273-e5d4-4ca7-8965-26a1e7a9152e.png
882b9d2d-15e6-4536-9799-e6d2b8464f97	2110-XYZ	Opel	Corsa	B	t	/api/uploads/vehiculos/0b61d3e9-266c-4e97-85f5-869266140afa.png
9cf32b7f-35b4-4552-861f-6184644eb659	5501-MME	Peugeot	208	B	t	/api/uploads/vehiculos/da98e24e-c2f4-464a-bace-70381f959c8a.png
7923aec5-6d4a-4dcf-9aca-8156b940155c	1289-ABC	Iveco	S-Way	C	t	/api/uploads/vehiculos/dcd840b5-2cdf-4e71-92ad-8fd5127e6e3f.png
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: activaciones_cuenta activaciones_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activaciones_cuenta
    ADD CONSTRAINT activaciones_cuenta_pkey PRIMARY KEY (id);


--
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id);


--
-- Name: bonos bonos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bonos
    ADD CONSTRAINT bonos_pkey PRIMARY KEY (id);


--
-- Name: clases_directo clases_directo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_directo
    ADD CONSTRAINT clases_directo_pkey PRIMARY KEY (id);


--
-- Name: clases_practicas clases_practicas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_practicas
    ADD CONSTRAINT clases_practicas_pkey PRIMARY KEY (id);


--
-- Name: compras_bonos compras_bonos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras_bonos
    ADD CONSTRAINT compras_bonos_pkey PRIMARY KEY (id);


--
-- Name: documentos_alumno_archivos documentos_alumno_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_alumno_archivos
    ADD CONSTRAINT documentos_alumno_archivos_pkey PRIMARY KEY (id);


--
-- Name: documentos_alumno documentos_alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_alumno
    ADD CONSTRAINT documentos_alumno_pkey PRIMARY KEY (id);


--
-- Name: examenes_dgt_alumno examenes_dgt_alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_dgt_alumno
    ADD CONSTRAINT examenes_dgt_alumno_pkey PRIMARY KEY (id);


--
-- Name: examenes examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT examenes_pkey PRIMARY KEY (id);


--
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id);


--
-- Name: matriculas_conceptos matriculas_conceptos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas_conceptos
    ADD CONSTRAINT matriculas_conceptos_pkey PRIMARY KEY (id);


--
-- Name: matriculas matriculas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_pkey PRIMARY KEY (id);


--
-- Name: preguntas_dgt preguntas_dgt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas_dgt
    ADD CONSTRAINT preguntas_dgt_pkey PRIMARY KEY (id);


--
-- Name: profesores profesores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_pkey PRIMARY KEY (id);


--
-- Name: promociones promociones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones
    ADD CONSTRAINT promociones_pkey PRIMARY KEY (id);


--
-- Name: respuestas_pregunta_dgt respuestas_pregunta_dgt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_pregunta_dgt
    ADD CONSTRAINT respuestas_pregunta_dgt_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_examen solicitudes_examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_examen
    ADD CONSTRAINT solicitudes_examen_pkey PRIMARY KEY (id);


--
-- Name: tarifas_concepto_historial tarifas_concepto_historial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_concepto_historial
    ADD CONSTRAINT tarifas_concepto_historial_pkey PRIMARY KEY (id);


--
-- Name: tarifas_concepto tarifas_concepto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_concepto
    ADD CONSTRAINT tarifas_concepto_pkey PRIMARY KEY (id);


--
-- Name: tarifas_matricula tarifas_matricula_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_matricula
    ADD CONSTRAINT tarifas_matricula_pkey PRIMARY KEY (id);


--
-- Name: temarios temarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temarios
    ADD CONSTRAINT temarios_pkey PRIMARY KEY (id);


--
-- Name: temarios_progreso temarios_progreso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temarios_progreso
    ADD CONSTRAINT temarios_progreso_pkey PRIMARY KEY (id);


--
-- Name: tests_practica tests_practica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests_practica
    ADD CONSTRAINT tests_practica_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id);


--
-- Name: activaciones_cuenta_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "activaciones_cuenta_expiresAt_idx" ON public.activaciones_cuenta USING btree ("expiresAt");


--
-- Name: activaciones_cuenta_tokenHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "activaciones_cuenta_tokenHash_key" ON public.activaciones_cuenta USING btree ("tokenHash");


--
-- Name: activaciones_cuenta_usedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "activaciones_cuenta_usedAt_idx" ON public.activaciones_cuenta USING btree ("usedAt");


--
-- Name: activaciones_cuenta_usuarioId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "activaciones_cuenta_usuarioId_idx" ON public.activaciones_cuenta USING btree ("usuarioId");


--
-- Name: clases_directo_activa_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clases_directo_activa_idx ON public.clases_directo USING btree (activa);


--
-- Name: clases_directo_permiso_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clases_directo_permiso_idx ON public.clases_directo USING btree (permiso);


--
-- Name: clases_directo_profesorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "clases_directo_profesorId_idx" ON public.clases_directo USING btree ("profesorId");


--
-- Name: clases_practicas_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "clases_practicas_alumnoId_idx" ON public.clases_practicas USING btree ("alumnoId");


--
-- Name: clases_practicas_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clases_practicas_fecha_idx ON public.clases_practicas USING btree (fecha);


--
-- Name: clases_practicas_profesorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "clases_practicas_profesorId_idx" ON public.clases_practicas USING btree ("profesorId");


--
-- Name: clases_practicas_vehiculoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "clases_practicas_vehiculoId_idx" ON public.clases_practicas USING btree ("vehiculoId");


--
-- Name: compras_bonos_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "compras_bonos_alumnoId_idx" ON public.compras_bonos USING btree ("alumnoId");


--
-- Name: compras_bonos_bonoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "compras_bonos_bonoId_idx" ON public.compras_bonos USING btree ("bonoId");


--
-- Name: compras_bonos_fechaCompra_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "compras_bonos_fechaCompra_idx" ON public.compras_bonos USING btree ("fechaCompra");


--
-- Name: documentos_alumno_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documentos_alumno_alumnoId_idx" ON public.documentos_alumno USING btree ("alumnoId");


--
-- Name: documentos_alumno_archivos_documentoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documentos_alumno_archivos_documentoId_idx" ON public.documentos_alumno_archivos USING btree ("documentoId");


--
-- Name: documentos_alumno_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_alumno_estado_idx ON public.documentos_alumno USING btree (estado);


--
-- Name: examenes_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "examenes_alumnoId_idx" ON public.examenes USING btree ("alumnoId");


--
-- Name: examenes_dgt_alumno_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "examenes_dgt_alumno_alumnoId_idx" ON public.examenes_dgt_alumno USING btree ("alumnoId");


--
-- Name: examenes_dgt_alumno_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX examenes_dgt_alumno_fecha_idx ON public.examenes_dgt_alumno USING btree (fecha);


--
-- Name: examenes_dgt_alumno_licencia_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX examenes_dgt_alumno_licencia_idx ON public.examenes_dgt_alumno USING btree (licencia);


--
-- Name: examenes_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX examenes_fecha_idx ON public.examenes USING btree (fecha);


--
-- Name: facturas_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "facturas_alumnoId_idx" ON public.facturas USING btree ("alumnoId");


--
-- Name: facturas_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX facturas_estado_idx ON public.facturas USING btree (estado);


--
-- Name: facturas_fechaEmision_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "facturas_fechaEmision_idx" ON public.facturas USING btree ("fechaEmision");


--
-- Name: facturas_matriculaId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "facturas_matriculaId_key" ON public.facturas USING btree ("matriculaId");


--
-- Name: facturas_numero_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX facturas_numero_key ON public.facturas USING btree (numero);


--
-- Name: matriculas_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "matriculas_alumnoId_idx" ON public.matriculas USING btree ("alumnoId");


--
-- Name: matriculas_conceptos_matriculaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "matriculas_conceptos_matriculaId_idx" ON public.matriculas_conceptos USING btree ("matriculaId");


--
-- Name: matriculas_conceptos_tarifaConceptoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "matriculas_conceptos_tarifaConceptoId_idx" ON public.matriculas_conceptos USING btree ("tarifaConceptoId");


--
-- Name: matriculas_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX matriculas_estado_idx ON public.matriculas USING btree (estado);


--
-- Name: preguntas_dgt_activa_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX preguntas_dgt_activa_idx ON public.preguntas_dgt USING btree (activa);


--
-- Name: preguntas_dgt_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "preguntas_dgt_createdAt_idx" ON public.preguntas_dgt USING btree ("createdAt");


--
-- Name: preguntas_dgt_licencia_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX preguntas_dgt_licencia_idx ON public.preguntas_dgt USING gin (licencia);


--
-- Name: respuestas_pregunta_dgt_preguntaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "respuestas_pregunta_dgt_preguntaId_idx" ON public.respuestas_pregunta_dgt USING btree ("preguntaId");


--
-- Name: solicitudes_examen_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "solicitudes_examen_alumnoId_idx" ON public.solicitudes_examen USING btree ("alumnoId");


--
-- Name: solicitudes_examen_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX solicitudes_examen_estado_idx ON public.solicitudes_examen USING btree (estado);


--
-- Name: solicitudes_examen_tipo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX solicitudes_examen_tipo_idx ON public.solicitudes_examen USING btree (tipo);


--
-- Name: tarifas_concepto_activa_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tarifas_concepto_activa_idx ON public.tarifas_concepto USING btree (activa);


--
-- Name: tarifas_concepto_historial_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tarifas_concepto_historial_createdAt_idx" ON public.tarifas_concepto_historial USING btree ("createdAt");


--
-- Name: tarifas_concepto_historial_permiso_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tarifas_concepto_historial_permiso_idx ON public.tarifas_concepto_historial USING btree (permiso);


--
-- Name: tarifas_concepto_historial_tarifaConceptoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tarifas_concepto_historial_tarifaConceptoId_idx" ON public.tarifas_concepto_historial USING btree ("tarifaConceptoId");


--
-- Name: tarifas_concepto_permiso_concepto_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tarifas_concepto_permiso_concepto_key ON public.tarifas_concepto USING btree (permiso, concepto);


--
-- Name: tarifas_concepto_permiso_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tarifas_concepto_permiso_idx ON public.tarifas_concepto USING btree (permiso);


--
-- Name: tarifas_matricula_licencia_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tarifas_matricula_licencia_key ON public.tarifas_matricula USING btree (licencia);


--
-- Name: temarios_progreso_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "temarios_progreso_alumnoId_idx" ON public.temarios_progreso USING btree ("alumnoId");


--
-- Name: temarios_progreso_temarioId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "temarios_progreso_temarioId_idx" ON public.temarios_progreso USING btree ("temarioId");


--
-- Name: temarios_tipoLicenciaObjetivo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "temarios_tipoLicenciaObjetivo_idx" ON public.temarios USING gin ("tipoLicenciaObjetivo");


--
-- Name: tests_practica_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tests_practica_alumnoId_idx" ON public.tests_practica USING btree ("alumnoId");


--
-- Name: tests_practica_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tests_practica_fecha_idx ON public.tests_practica USING btree (fecha);


--
-- Name: tests_practica_temarioId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tests_practica_temarioId_idx" ON public.tests_practica USING btree ("temarioId");


--
-- Name: usuarios_dni_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_dni_key ON public.usuarios USING btree (dni);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: vehiculos_matricula_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX vehiculos_matricula_key ON public.vehiculos USING btree (matricula);


--
-- Name: activaciones_cuenta activaciones_cuenta_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activaciones_cuenta
    ADD CONSTRAINT "activaciones_cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumnos alumnos_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_id_fkey FOREIGN KEY (id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumnos alumnos_profesorAsignadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT "alumnos_profesorAsignadoId_fkey" FOREIGN KEY ("profesorAsignadoId") REFERENCES public.profesores(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: clases_directo clases_directo_profesorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_directo
    ADD CONSTRAINT "clases_directo_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES public.profesores(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: clases_practicas clases_practicas_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_practicas
    ADD CONSTRAINT "clases_practicas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: clases_practicas clases_practicas_profesorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_practicas
    ADD CONSTRAINT "clases_practicas_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES public.profesores(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: clases_practicas clases_practicas_vehiculoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_practicas
    ADD CONSTRAINT "clases_practicas_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES public.vehiculos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: compras_bonos compras_bonos_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras_bonos
    ADD CONSTRAINT "compras_bonos_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compras_bonos compras_bonos_bonoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras_bonos
    ADD CONSTRAINT "compras_bonos_bonoId_fkey" FOREIGN KEY ("bonoId") REFERENCES public.bonos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documentos_alumno documentos_alumno_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_alumno
    ADD CONSTRAINT "documentos_alumno_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documentos_alumno_archivos documentos_alumno_archivos_documentoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_alumno_archivos
    ADD CONSTRAINT "documentos_alumno_archivos_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES public.documentos_alumno(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: examenes examenes_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT "examenes_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: examenes_dgt_alumno examenes_dgt_alumno_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_dgt_alumno
    ADD CONSTRAINT "examenes_dgt_alumno_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: facturas facturas_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT "facturas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: facturas facturas_matriculaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT "facturas_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES public.matriculas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: matriculas matriculas_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT "matriculas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: matriculas_conceptos matriculas_conceptos_matriculaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas_conceptos
    ADD CONSTRAINT "matriculas_conceptos_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES public.matriculas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: matriculas_conceptos matriculas_conceptos_tarifaConceptoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas_conceptos
    ADD CONSTRAINT "matriculas_conceptos_tarifaConceptoId_fkey" FOREIGN KEY ("tarifaConceptoId") REFERENCES public.tarifas_concepto(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: matriculas matriculas_promocionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT "matriculas_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES public.promociones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: profesores profesores_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_id_fkey FOREIGN KEY (id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: respuestas_pregunta_dgt respuestas_pregunta_dgt_preguntaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_pregunta_dgt
    ADD CONSTRAINT "respuestas_pregunta_dgt_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES public.preguntas_dgt(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes_examen solicitudes_examen_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_examen
    ADD CONSTRAINT "solicitudes_examen_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tarifas_concepto_historial tarifas_concepto_historial_tarifaConceptoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_concepto_historial
    ADD CONSTRAINT "tarifas_concepto_historial_tarifaConceptoId_fkey" FOREIGN KEY ("tarifaConceptoId") REFERENCES public.tarifas_concepto(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: temarios_progreso temarios_progreso_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temarios_progreso
    ADD CONSTRAINT "temarios_progreso_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: temarios_progreso temarios_progreso_temarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temarios_progreso
    ADD CONSTRAINT "temarios_progreso_temarioId_fkey" FOREIGN KEY ("temarioId") REFERENCES public.temarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_practica tests_practica_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests_practica
    ADD CONSTRAINT "tests_practica_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public.alumnos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_practica tests_practica_temarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests_practica
    ADD CONSTRAINT "tests_practica_temarioId_fkey" FOREIGN KEY ("temarioId") REFERENCES public.temarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict lmJE9uKMqERS6eeKCoaiCE0XJAUZupjHG2cKjgASNBvSFEAYsIofe0sGAYZUQJJ

