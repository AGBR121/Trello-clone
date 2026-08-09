# Tasks 003: Tableros (Boards)

- [ ] T1 — Correr en Supabase SQL Editor: políticas RLS de
      `board_members` (select + insert).
- [ ] T2 — Correr en Supabase SQL Editor: función RPC `create_board`.
- [x] T3 — Crear `src/hooks/useBoards.js`.
- [ ] T4 — Crear `src/components/ConfirmDialog.jsx` (genérico,
      reutilizable).
- [ ] T5 — Crear `src/components/BoardCard.jsx`.
- [ ] T6 — Crear `src/components/CreateBoardModal.jsx`.
- [ ] T7 — Actualizar `src/pages/Dashboard.jsx`: listar boards, botón
      crear, estado vacío.
- [ ] T8 — Actualizar `src/pages/BoardView.jsx`: traer tablero por id,
      manejar "no encontrado", aplicar dark mode (cierra T6/T7 de
      spec 002).
- [ ] T9 — Probar manualmente: crear tablero, verlo en la lista, entrar
      a él, eliminarlo, y confirmar que un tablero ajeno no es accesible
      por URL directa.

## Orden sugerido
T1 → T2 (SQL primero, todo depende de esto) → T3 → T4 → T5 y T6 (en
paralelo) → T7 → T8 → T9