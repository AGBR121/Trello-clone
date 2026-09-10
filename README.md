# Trello Clone

A collaborative task management app in the style of Trello, built with **React + Vite + Tailwind CSS** on the frontend and **Supabase** (Postgres + Auth + Realtime) as the backend.

This project was built following a **Spec-Driven Development** methodology ([Spec Kit](https://github.com/github/spec-kit)): every feature was first documented as a specification, then as a technical plan, and finally broken down into tasks before writing any code. The full history — including real bugs and how they were fixed — lives in the [`specs/`](./specs) folder.

> Note: the specs, code comments, and commit history are in Spanish, since that's the language the project was developed in. This README is in English to make the project accessible to a wider audience.

## Features

- **Authentication** with Supabase Auth (sign up, login, logout, protected routes, session persistence)
- **Boards** — create, list, delete, with access control via Row Level Security
- **Full Kanban board** — columns and cards with **drag & drop** (within a column and across columns), using [`@dnd-kit`](https://dndkit.com)
- **Multi-user collaboration** — invite members by email, remove members, leave a board
- **User profiles** — editable, unique username, auto-assigned on sign up
- **Card color and assignee** — color labels and assignment to a board member
- **Real-time updates** — Supabase Realtime syncs columns and cards across every open session of the same board
- **Dark mode** — user-controlled, persistent, with a neutral gray palette

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form |
| Drag & drop | @dnd-kit/core, @dnd-kit/sortable |
| Routing | React Router |
| Backend | Supabase (Postgres, Auth, Realtime, RLS) |
| Package manager | bun |

## Project structure

```
src/
├── components/     # Reusable UI (BoardCard, Column, CardItem, modals, etc.)
├── hooks/          # Data and state logic (useAuth, useBoards, useColumns, ...)
├── lib/            # Supabase client
├── pages/          # Views (Login, Dashboard, BoardView)
├── App.jsx
└── main.jsx

specs/              # Specs, technical plans, and tasks for each feature (in Spanish)
.specify/
└── memory/
    └── constitution.md   # Project principles and architecture decisions
```

## Running it locally

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd trello-clone
bun install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and copy your **Project URL** and **anon public key** from *Project Settings → API*.

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create the database schema

In the Supabase **SQL Editor**, run the migrations documented in each `specs/00X-*/plan.md`, in order, or check the schema summary below. Remember to enable **Realtime** for the `columns` and `cards` tables (Database → Replication), required for spec 008.

### 4. Run in development

```bash
bun run dev
```

## Database schema (summary)

| Table | Purpose |
|---|---|
| `boards` | Boards, with `owner_id` |
| `board_members` | Many-to-many user↔board relationship, with `role` |
| `columns` | A board's columns, with `position` |
| `cards` | A column's cards, with `position`, `color`, `assigned_to`, `board_id` |
| `profiles` | Public username, 1:1 with `auth.users` |

Every table has **Row Level Security** enabled. Access is resolved through `security definer` functions (`is_board_member`, `get_board_members`, `invite_member_by_email`) to avoid both infinite recursion in policies and direct client access to `auth.users`, which Supabase doesn't expose to the client.

## Methodology: Spec-Driven Development

Every feature in this project went through this flow, documented in `specs/`:

1. **`spec.md`** — what's being built and why (user stories, acceptance criteria, what's out of scope)
2. **`plan.md`** — how it's built (technical decisions, SQL, component architecture)
3. **`tasks.md`** — broken down into concrete steps, checked off as completed

Several specs include an **incidents** section documenting real bugs found during implementation and how they were resolved

The project's constitution (`.specify/memory/constitution.md`) gathers the architecture principles agreed on and updated throughout development.

## Spec list

| # | Spec | Status |
|---|---|---|
| 001 | Authentication | ✅ |
| 002 | Dark mode | ✅ |
| 003 | Boards | ✅ |
| 004 | Columns and cards (Kanban) | ✅ |
| 005 | Collaboration | ✅ |
| 006 | User profiles | ✅ |
| 007 | Card color and assignee | ✅ |
| 008 | Real-time updates | ✅ |

## License

Portfolio project, free to use.