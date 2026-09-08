# Tasks 005: Colaboración (invitar miembros)

- [x] T1 — Correr en Supabase SQL Editor: función `invite_member_by_email`.
- [x] T2 — Correr en Supabase SQL Editor: función `get_board_members`.
- [x] T3 — Correr en Supabase SQL Editor: policy de `delete` en
      `board_members`.
- [x] T4 — Crear `src/hooks/useBoardMembers.js`.
- [x] T5 — Crear `src/components/MembersPanel.jsx`.
- [x] T6 — Actualizar `src/pages/BoardView.jsx`: botón "Miembros" en el
      header, conectar `MembersPanel`, manejar salida del tablero
      (redirect a `/dashboard`).
- [ ] T7 — Probar: invitar por email válido, email no registrado, email
      ya miembro, remover un miembro (como owner), salir de un tablero
      (como miembro), confirmar que un no-owner no puede invitar/remover
      (ni siquiera llamando el RPC directamente).

## Orden sugerido
T1 → T2 → T3 (SQL primero) → T4 → T5 → T6 → T7

## Notas de prueba para T7
Para probar de extremo a extremo necesitas 2 cuentas de usuario distintas
(puedes usar dos emails diferentes, o el mismo proveedor con un alias
tipo `tucorreo+test@gmail.com` si Supabase lo acepta sin problema).