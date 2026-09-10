# Trello Clone

Aplicación de gestión de tareas colaborativa estilo Trello, construida con **React + Vite + Tailwind CSS** en el frontend y **Supabase** (Postgres + Auth + Realtime) como backend.

Este proyecto se desarrolló siguiendo una metodología de **Spec-Driven Development** ([Spec Kit](https://github.com/github/spec-kit)): cada feature se documentó primero como especificación, luego como plan técnico, y finalmente se desglosó en tareas antes de escribir código. El historial completo — incluyendo errores reales y cómo se resolvieron — vive en la carpeta [`specs/`](./specs).

## Features

- **Autenticación** completa con Supabase Auth (registro, login, logout, rutas protegidas, persistencia de sesión)
- **Tableros** — crear, listar, eliminar, con control de acceso por Row Level Security
- **Kanban completo** — columnas y tarjetas con **drag & drop** (dentro de una columna y entre columnas), usando [`@dnd-kit`](https://dndkit.com)
- **Colaboración multi-usuario** — invitar miembros por email, remover miembros, salir de un tablero
- **Perfiles de usuario** — nombre de usuario editable y único, asignado automáticamente al registrarse
- **Color y encargado por tarjeta** — etiquetas de color y asignación a un miembro del tablero
- **Cambios en tiempo real** — Supabase Realtime sincroniza columnas y tarjetas entre todas las sesiones abiertas de un mismo tablero
- **Modo oscuro** — controlado por el usuario, persistente, con paleta de grises neutros

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite |
| Estilos | Tailwind CSS v4 |
| Formularios | React Hook Form |
| Drag & drop | @dnd-kit/core, @dnd-kit/sortable |
| Routing | React Router |
| Backend | Supabase (Postgres, Auth, Realtime, RLS) |
| Gestor de paquetes | bun |

## Estructura del proyecto

```
src/
├── components/     # UI reutilizable (BoardCard, Column, CardItem, modales, etc.)
├── hooks/          # Lógica de datos y estado (useAuth, useBoards, useColumns, ...)
├── lib/            # Cliente de Supabase
├── pages/          # Vistas (Login, Dashboard, BoardView)
├── App.jsx
└── main.jsx

specs/              # Especificaciones, planes técnicos y tareas de cada feature
.specify/
└── memory/
    └── constitution.md   # Principios y decisiones de arquitectura del proyecto
```

## Cómo correrlo localmente

### 1. Clonar e instalar dependencias

```bash
git clone <url-de-tu-repo>
cd trello-clone
bun install
```

### 2. Configurar Supabase

Crea un proyecto en [supabase.com](https://supabase.com) y copia tu **Project URL** y **anon public key** desde *Project Settings -> API*.

Crea un archivo `.env` en la raíz:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Crear el esquema de base de datos

En el **SQL Editor** de Supabase, corre en orden las migraciones documentadas en cada `specs/00X-*/plan.md`, o consulta el resumen de tablas más abajo. Recuerda habilitar **Realtime** para las tablas `columns` y `cards` (Database → Replication), necesario para la spec 008.

### 4. Correr en desarrollo

```bash
bun run dev
```

## Esquema de base de datos (resumen)

| Tabla | Propósito |
|---|---|
| `boards` | Tableros, con `owner_id` |
| `board_members` | Relación muchos-a-muchos usuario↔tablero, con `role` |
| `columns` | Columnas de un tablero, con `position` |
| `cards` | Tarjetas de una columna, con `position`, `color`, `assigned_to`, `board_id` |
| `profiles` | Nombre de usuario público, 1:1 con `auth.users` |

Todas las tablas tienen **Row Level Security** activo. El acceso se resuelve con funciones `security definer` (`is_board_member`, `get_board_members`, `invite_member_by_email`) para evitar tanto la recursión infinita en políticas como el acceso directo a `auth.users`, que Supabase no expone al cliente.

## Metodología: Spec-Driven Development

Cada feature del proyecto pasó por este flujo, documentado en `specs/`:

1. **`spec.md`** — qué se construye y por qué (user stories, criterios de aceptación, qué queda fuera de alcance)
2. **`plan.md`** — cómo se construye (decisiones técnicas, SQL, arquitectura de componentes)
3. **`tasks.md`** — desglose en pasos concretos, marcados a medida que se completan

Varias specs incluyen una sección de **incidentes** documentando bugs reales encontrados durante la implementación y cómo se resolvieron.

La constitución del proyecto (`.specify/memory/constitution.md`) reúne los principios de arquitectura acordados y actualizados a lo largo del desarrollo.

## Lista de specs

| # | Spec | Estado |
|---|---|---|
| 001 | Autenticación | ✅ |
| 002 | Modo oscuro | ✅ |
| 003 | Tableros | ✅ |
| 004 | Columnas y tarjetas (Kanban) | ✅ |
| 005 | Colaboración | ✅ |
| 006 | Perfiles de usuario | ✅ |
| 007 | Color y encargado de tarjeta | ✅ |
| 008 | Cambios en tiempo real | ✅ |

## Licencia

Proyecto de portafolio de uso libre.