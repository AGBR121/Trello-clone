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
- [x] T6 — Probar: abrir el mismo tablero en dos pestañas/cuentas
      distintas y verificar que crear/editar/eliminar/mover columnas y
      tarjetas se refleje en vivo en ambas.
- [x] T7 — Confirmar que un usuario sin acceso al tablero no recibe
      eventos.

## Orden sugerido
T1 → T2 → T3 (SQL y configuración primero) → T4 → T5 → T6 → T7

## Incidentes durante la implementación

**Eventos DELETE no llegaban con el filtro por `board_id`.** Ver detalle
completo en `plan.md`. Causa: `REPLICA IDENTITY DEFAULT` de Postgres no
incluye columnas no-PK en el registro eliminado, así que el filtro de
Realtime no podía evaluarse y el evento se descartaba silenciosamente.
Se resolvió con `alter table ... replica identity full;` en `cards` y
`columns`.

**Lección para futuras specs:** cualquier filtro de Realtime sobre una
columna que no sea la clave primaria requiere `REPLICA IDENTITY FULL`
en esa tabla para que los eventos `DELETE`/`UPDATE` filtrados lleguen
correctamente.