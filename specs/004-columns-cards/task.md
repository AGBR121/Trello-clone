# Tasks 004: Columnas y Tarjetas (Kanban)

- [x] T1 — Correr en Supabase SQL Editor: políticas RLS de `columns` y
      `cards`.
- [x] T2 — Instalar `@dnd-kit/core`, `@dnd-kit/sortable`,
      `@dnd-kit/utilities`.
- [x] T3 — Crear `src/hooks/useColumns.js` (fetch anidado, createColumn,
      deleteColumn, reorderCards).
- [ ] T4 — Crear `src/components/CreateColumnForm.jsx`.
- [ ] T5 — Crear `src/components/CardItem.jsx` (con `useSortable`).
- [ ] T6 — Crear `src/components/Column.jsx` (con `SortableContext` +
      `useDroppable`, incluye `CreateColumnForm`/agregar tarjeta inline).
- [ ] T7 — Crear `src/components/CardDetailModal.jsx` (React Hook Form:
      título, descripción, fecha límite; incluye eliminar).
- [ ] T8 — Actualizar `src/pages/BoardView.jsx`: `DndContext`, layout de
      columnas con scroll horizontal, `onDragEnd` conectado a
      `reorderCards`.
- [ ] T9 — Probar manualmente: crear columna, crear tarjeta, editar
      tarjeta, eliminar tarjeta, eliminar columna, drag dentro de la
      misma columna, drag entre columnas, persistencia tras F5.
- [ ] T10 — Confirmar que un usuario sin acceso al tablero no puede leer
      ni modificar columnas/tarjetas ajenas (probar con RLS, ej. vía
      otra cuenta o llamada directa a la API).

## Orden sugerido
T1 → T2 → T3 → T4 y T5 (en paralelo) → T6 → T7 → T8 → T9 → T10