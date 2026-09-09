# Tasks 008: Cambios en tiempo real

- [x] T1 — Correr en Supabase SQL Editor: agregar `board_id` a `cards`
      (nullable) + backfill + `set not null`.
- [x] T2 — Correr en Supabase SQL Editor: reemplazar policy de `cards`
      para usar `board_id` directo (drop + create).
- [x] T3 — Habilitar Realtime para `columns` y `cards` (SQL
      `alter publication` o toggle en Database → Replication).
- [x] T4 — Actualizar `src/hooks/useColumns.js`: incluir `board_id` en
      el insert de `createCard`.
- [x] T5 — Actualizar `src/hooks/useColumns.js`: agregar suscripción a
      Realtime (canal por tablero, debounce de refetch).
- [ ] T6 — Probar: abrir el mismo tablero en dos pestañas/cuentas
      distintas y verificar que crear/editar/eliminar/mover columnas y
      tarjetas se refleje en vivo en ambas.
- [ ] T7 — Confirmar que un usuario sin acceso al tablero no recibe
      eventos.

## Orden sugerido
T1 → T2 → T3 (SQL y configuración primero) → T4 → T5 → T6 → T7

## Notas de prueba para T6
Usa dos ventanas normales (no necesariamente incógnito) con dos cuentas
distintas logueadas, o la misma cuenta en dos pestañas si solo quieres
confirmar el mecanismo básico antes de probar con multi-usuario real.