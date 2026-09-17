# Trello Clone

A collaborative task management app in the style of Trello, built with **React + Vite + Tailwind CSS** on the frontend and **Supabase** (Postgres + Auth + Realtime) as the backend.

This project was built following a **Spec-Driven Development** methodology ([Spec Kit](https://github.com/github/spec-kit)): every feature was first documented as a specification, then as a technical plan, and finally broken down into tasks before writing any code. The full history — including real bugs and how they were fixed — lives in the [`specs/`](./specs) folder.

> Note: the specs, code comments, and commit history are in Spanish, since that's the language the project was developed in. This README is in English to make the project accessible to a wider audience.

## Live demo

> [https://trello-clone-phi-smoky.vercel.app/](https://trello-clone-phi-smoky.vercel.app/)

Prefer deploying to **Vercel** for a zero-config setup — it runs `bun run build` and serves the static output. The Docker image in this repo is an alternative for self-hosting or container-based environments (see [Running with Docker](#running-with-docker)). The repository is at [github.com/AGBR121/Trello-clone](https://github.com/AGBR121/Trello-clone).

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
| Testing | Vitest + Testing Library |
| Linting | ESLint (flat config) |
| CI/CD | GitHub Actions workflow |
| Backend | Supabase (Postgres, Auth, Realtime, RLS) |
| Package manager | bun (npm also works) |

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

> The project is developed with **bun**, but npm works too — a `package-lock.json` is maintained alongside `bun.lock`. Use whichever you prefer; commands below use bun.

### 1. Requirements

- **Node.js** 20.19+ or 22.12+ — required by Vite 8 when installing with npm.
- **Bun** (latest) — required by CI and used throughout the project's tooling.

### 2. Clone and install dependencies

```bash
git clone https://github.com/AGBR121/Trello-clone.git
cd trello-clone
bun install
```

To install with npm instead: `npm install`.

### 3. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and copy your **Project URL** and **anon public key** from *Project Settings → API*.

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Create the database schema

In the Supabase **SQL Editor**, run the migrations documented in each `specs/00X-*/plan.md`, in order, or check the schema summary below. Remember to enable **Realtime** for the `columns` and `cards` tables (Database → Replication), required for spec 008.

### 5. Run in development

```bash
bun run dev
```

### 6. Available scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the Vite dev server with HMR |
| `bun run build` | Build the production bundle to `dist/` |
| `bun run lint` | Run ESLint over the whole project |
| `bun run test` | Run the Vitest suite (add `-- --run` for a single pass) |
| `bun run preview` | Preview the production build locally |

All commands work with npm too by swapping `bun run` for `npm run`.

## Running with Docker

The project also includes a multi-stage `Dockerfile` that builds a production-optimized image of the frontend (Nginx serving the Vite build). This isn't required for the Vercel deployment mentioned in the [Live demo](#live-demo) section — it's there to show the app can also be self-hosted or run in any container-based environment.

> **Important:** Vite bakes `VITE_*` environment variables into the JS bundle **at build time**, not at container runtime. This means Supabase credentials must be passed as **build args**, and any change to them requires rebuilding the image — restarting the container alone won't pick up new values.

### Option A: docker compose (recommended)

Make sure you have a `.env` file in the project root (the same one used for local development):

```bash
docker compose up --build
```

The app will be available at `http://localhost:8080`.

### Option B: plain Docker

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your_anon_key \
  -t trello-clone .

docker run -p 8080:80 trello-clone
```

Routing is handled by an included `nginx.conf` that falls back to `index.html` for any unmatched path, so reloading a client-side route like `/dashboard` works correctly instead of returning a 404.

## Database schema (summary)

| Table | Purpose |
|---|---|
| `boards` | Boards, with `owner_id` |
| `board_members` | Many-to-many user↔board relationship, with `role` |
| `columns` | A board's columns, with `position` |
| `cards` | A column's cards, with `position`, `color`, `assigned_to`, `board_id` |
| `profiles` | Public username, 1:1 with `auth.users` |

Every table has **Row Level Security** enabled. Access is resolved through `security definer` functions (`is_board_member`, `get_board_members`, `invite_member_by_email`) to avoid both infinite recursion in policies and direct client access to `auth.users`, which Supabase doesn't expose to the client.

## How it works: state vs. realtime

The UI state is **server-driven**. The app has no local data layer — hooks like `useBoards`, `useColumns`, and `useCards` fetch from Supabase and expose mutations (create/delete/update/move). After every mutation, the author's session updates from the mutation's response, while **Supabase Realtime** broadcasts the change to every other open session of the same board, keeping columns and cards in sync automatically.

This means the frontend never guesses at state: it always reflects what's in Postgres, and collaboration works without building a custom websocket layer. The trade-off is that every write is a round-trip to the database, which is fine for a kanban app but is worth knowing before scaling realtime-heavy features.

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
| 009 | Dockerization | ✅ |
| 010 | Testing & CI/CD | ✅ |

## License

Portfolio project, free to use — see the [MIT License](./LICENSE).