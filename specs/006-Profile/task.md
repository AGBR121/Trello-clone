# Tasks 006: Perfiles de usuario (nombre de usuario)

- [x] T1 — Correr en Supabase SQL Editor: crear tabla `profiles` + RLS
      (select/insert/update).
- [x] T2 — Correr en Supabase SQL Editor: función y trigger
      `handle_new_user`.
- [x] T3 — Correr en Supabase SQL Editor: backfill de usuarios existentes
      sin perfil.
- [x] T4 — Correr en Supabase SQL Editor: recrear `get_board_members`
      con `username` incluido (drop + create).
- [x] T5 — Crear `src/hooks/useProfile.js`.
- [ ] T6 — Crear `src/components/EditProfileModal.jsx`.
- [ ] T7 — Actualizar `src/pages/Dashboard.jsx`: mostrar username +
      botón editar perfil.
- [ ] T8 — Actualizar `src/components/MembersPanel.jsx`: mostrar
      username en vez de email.
- [ ] T9 — Probar: registrar un usuario nuevo y confirmar username
      automático, editar username propio, intentar un username
      duplicado, ver username reflejado en Dashboard y en Miembros de
      otro tablero.

## Orden sugerido
T1 → T2 → T3 → T4 (SQL primero, en ese orden exacto) → T5 → T6 → T7 →
T8 → T9