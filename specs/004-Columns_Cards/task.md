# Tasks 004: Columnas y Tarjetas (Kanban)

- [x] T1 — Correr en Supabase SQL Editor: políticas RLS de `columns` y
      `cards`.
- [x] T2 — Instalar `@dnd-kit/core`, `@dnd-kit/sortable`,
      `@dnd-kit/utilities`.
- [x] T3 — Crear `src/hooks/useColumns.js` (fetch anidado, createColumn,
      deleteColumn, reorderCards).
- [x] T4 — Crear `src/components/CreateColumnForm.jsx`.
- [x] T5 — Crear `src/components/CardItem.jsx` (con `useSortable`).
- [x] T6 — Crear `src/components/Column.jsx` (con `SortableContext` +
      `useDroppable`, incluye `CreateColumnForm`/agregar tarjeta inline).
- [x] T7 — Crear `src/components/CardDetailModal.jsx` (React Hook Form:
      título, descripción, fecha límite; incluye eliminar).
- [x] T8 — Actualizar `src/pages/BoardView.jsx`: `DndContext`, layout de
      columnas con scroll horizontal, `onDragEnd` conectado a
      `reorderCards`.
- [x] T9 — Probar manualmente: crear columna, crear tarjeta, editar
      tarjeta, eliminar tarjeta, eliminar columna, drag dentro de la
      misma columna, drag entre columnas, persistencia tras F5.
- [x] T10 — Confirmar que un usuario sin acceso al tablero no puede leer
      ni modificar columnas/tarjetas ajenas.

## Orden sugerido
T1 → T2 → T3 → T4 y T5 (en paralelo) → T6 → T7 → T8 → T9 → T10

## Incidentes durante la implementación

**Políticas RLS de `columns`/`cards` no se crearon en el primer intento.**
Al correr el bloque de SQL de T1, las políticas no quedaron activas
(verificado con `select * from pg_policies`), causando `403 Forbidden`
al intentar crear una columna. Causa probable: la función
`is_board_member()` (creada en la spec 003) no estaba disponible en esa
sesión del SQL Editor, o una línea previa en el mismo bloque falló y
detuvo la ejecución del resto silenciosamente. Se resolvió re-corriendo
primero la verificación de la función y luego el bloque de políticas por
separado, confirmando cada paso antes de continuar.

**Lección para futuras specs:** al correr SQL con varias sentencias
dependientes entre sí (funciones + políticas), correrlas en bloques
separados y verificar cada una antes de asumir que la siguiente
funcionará.