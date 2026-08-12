# DOMAIN_MODEL.md

## Objetivo

Este documento define el modelo de dominio del sistema de gestión de autoescuela.

Su propósito es identificar las entidades del negocio, sus relaciones, estados y responsabilidades.

No contiene detalles técnicos de implementación ni estructuras físicas de base de datos.

Documentos relacionados:

- FUNCTIONAL_SPECIFICATION.md
- BUSINESS_RULES.md

---

# 1. Contexto de Negocio

La aplicación permite gestionar una autoescuela que combina:

- Formación teórica.
- Formación práctica.
- Gestión administrativa.
- Gestión económica.
- Tramitación de exámenes.
- Gestión de usuarios y permisos.

---

# 2. Bounded Contexts (Dominios)

Actualmente se identifican los siguientes dominios principales:

## 2.1 Identidad y Acceso

Responsabilidades:

- Usuarios
- Roles
- Permisos
- Autenticación

---

## 2.2 Formación Teórica

Responsabilidades:

- Temario
- Material multimedia
- Preguntas
- Tests
- Resultados

---

## 2.3 Formación Práctica

Responsabilidades:

- Profesores
- Vehículos
- Disponibilidad
- Reservas
- Evaluaciones

---

## 2.4 Gestión Comercial

Responsabilidades:

- Matrículas
- Bonos
- Paquetes
- Promociones

---

## 2.5 Facturación y Cobros

Responsabilidades:

- Pagos
- Facturas
- Impagos

---

## 2.6 Exámenes y Tramitaciones

Responsabilidades:

- Convocatorias
- Solicitudes
- Documentación
- Tasas

---

# 3. Entidades Principales

---

# Usuario

Representa cualquier persona que accede al sistema.

## Propiedades

- id
- nombre
- apellidos
- email
- passwordHash
- teléfono
- dniNie
- fechaRegistro
- estado

## Estados

- Activo
- Suspendido
- Bloqueado
- Baja

## Relaciones

- Tiene un Rol.
- Puede generar Auditorías.

---

# Rol

Define los permisos funcionales.

## Tipos Iniciales

- Administrador
- Profesor
- Alumno
- Administrativo
- Soporte

## Relaciones

- Un Rol posee múltiples permisos.
- Un Usuario posee un Rol principal.

---

# Permiso

Representa una capacidad autorizada dentro del sistema.

## Ejemplos

- CrearAlumno
- EditarAlumno
- RegistrarPago
- GestionarVehículos
- CrearExamen

---

# Alumno

Representa al estudiante de la autoescuela.

## Propiedades

- id
- usuarioId
- fechaNacimiento
- permisoObjetivo
- estadoTeorico
- estadoPractico

## Estado Teórico

- Pendiente
- Aprobado
- Caducado

## Estado Práctico

- Pendiente
- EnProceso
- Aprobado
- Suspendido

## Relaciones

- Realiza Tests.
- Reserva Clases Prácticas.
- Realiza
