# Tasks 003: Tableros (Boards)

- [x] T1 — Correr en Supabase SQL Editor: políticas RLS de
      `board_members` (select + insert).
- [x] T2 — Correr en Supabase SQL Editor: función RPC `create_board`.
- [x] T3 — Crear `src/hooks/useBoards.js`.
- [x] T4 — Crear `src/components/ConfirmDialog.jsx` (genérico,
      reutilizable).
- [x] T5 — Crear `src/components/BoardCard.jsx`.
- [x] T6 — Crear `src/components/CreateBoardModal.jsx`.
- [x] T7 — Actualizar `src/pages/Dashboard.jsx`: listar boards, botón
      crear, estado vacío.
- [x] T8 — Actualizar `src/pages/BoardView.jsx`: traer tablero por id,
      manejar "no encontrado", aplicar dark mode (cierra T6/T7 de
      spec 002).
- [x] T9 — Probar manualmente: crear tablero, verlo en la lista, entrar
      a él, eliminarlo, y confirmar que un tablero ajeno no es accesible
      por URL directa.

## Orden sugerido
T1 → T2 (SQL primero, todo depende de esto) → T3 → T4 → T5 y T6 (en
paralelo) → T7 → T8 → T9

## Incidentes durante la implementación

**Recursión infinita en RLS de `board_members`.** La política original de
`select` consultaba `board_members` dentro de su propia condición,
causando un ciclo que Postgres cortaba con un 500 Internal Server Error.
Se resolvió creando una función `is_board_member()` con `security definer`
que rompe el ciclo (ver `plan.md` para el SQL corregido). Lección para
futuras políticas: evitar que una política de la tabla X consulte la
misma tabla X directamente; usar una función `security definer` en su
lugar.