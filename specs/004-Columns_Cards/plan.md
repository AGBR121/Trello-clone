# Plan 004: Columnas y Tarjetas (Kanban)

## Base de datos: políticas RLS de `columns` y `cards`

Aplicando la lección de la spec 003 (evitar que una política de la tabla X
consulte X misma), usamos la función `is_board_member()` que ya existe
para resolver acceso vía el tablero padre.

```sql
alter table columns enable row level security;
alter table cards enable row level security;

-- COLUMNS: ver/crear/editar/borrar si soy miembro del tablero dueño.
create policy "Acceso a columnas de mis tableros"
on columns for all
using ( is_board_member(board_id) )
with check ( is_board_member(board_id) );

-- CARDS: el acceso depende del tablero de la columna a la que pertenece
-- la tarjeta, no de un campo directo, así que resolvemos vía subquery
-- a columns (no es recursivo: cards -> columns, no cards -> cards).
create policy "Acceso a tarjetas de mis tableros"
on cards for all
using (
  column_id in (
    select id from columns where is_board_member(board_id)
  )
)
with check (
  column_id in (
    select id from columns where is_board_member(board_id)
  )
);
```

## Manejo de `position` (orden)

Estrategia simple y suficiente para el volumen de datos esperado
(decenas de tarjetas por columna, no miles): al soltar una tarjeta,
recalculamos las posiciones como enteros consecutivos (0, 1, 2, ...)
de todas las tarjetas afectadas (columna origen y columna destino si
son distintas), y las actualizamos con una sola llamada batch a
Supabase (`upsert`).

Esto evita la complejidad de "posiciones fraccionarias" (ej. insertar
en 1.5), que es innecesaria a esta escala y añade riesgo de bugs.

## Componentes/archivos a crear o modificar

### 1. `src/hooks/useColumns.js`
- `columns` (con sus `cards` anidadas en cada una, para simplificar el
  render del tablero completo de una sola consulta)
- `createColumn(boardId, name)`
- `deleteColumn(columnId)`
- `reorderCards({ cardId, sourceColumnId, destColumnId, newIndex })` —
  la función central que llama dnd-kit al soltar una tarjeta; recalcula
  y persiste las posiciones afectadas.

Carga inicial: una consulta a `columns` con `select('*, cards(*)')`
ordenando ambos por `position`.

### 2. `src/components/Column.jsx`
- Header con nombre de columna + botón eliminar (con `ConfirmDialog`).
- Lista de `CardItem` envuelta en `SortableContext` de dnd-kit
  (estrategia `verticalListSortingStrategy`).
- Botón "+ Agregar tarjeta" al final que abre un input inline (no modal,
  para agilidad de uso tipo Trello real).
- La columna en sí es un `useDroppable` (para poder soltar una tarjeta
  en una columna vacía).

### 3. `src/components/CardItem.jsx`
- Tarjeta individual: usa `useSortable` de dnd-kit.
- Muestra título, y opcionalmente un indicador de fecha límite si existe.
- Click abre `CardDetailModal`.

### 4. `src/components/CardDetailModal.jsx`
- Formulario (React Hook Form) con título, descripción (textarea), fecha
  límite (input date).
- Botón guardar y botón eliminar (con `ConfirmDialog`).

### 5. `src/components/CreateColumnForm.jsx`
- Input inline al final del tablero ("+ Agregar columna"), similar
  patrón al de agregar tarjeta.

### 6. `src/pages/BoardView.jsx` (modificar)
- Envuelve todo el área de columnas en `<DndContext>` de dnd-kit.
- `onDragEnd` calcula origen/destino y llama a `reorderCards`.
- Layout horizontal con scroll (`flex overflow-x-auto`) para las
  columnas.

## Librerías a instalar

```powershell
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Estrategia de Optimistic UI

Al soltar una tarjeta, actualizamos el estado local (`columns`) de
inmediato para que la animación se sienta fluida, y en paralelo
disparamos la persistencia a Supabase. Si la persistencia falla,
revertimos el estado local al orden anterior y mostramos un error breve
(toast o mensaje inline).

## Riesgos / cosas a validar
- Confirmar que la política `for all` en `columns`/`cards` no permita que
  un `member` sin rol `owner` borre cosas que no debería — por ahora
  todo miembro puede editar/crear/borrar columnas y tarjetas (como en
  Trello real); si se quiere restringir por rol, se ajusta en una spec
  posterior.
- El recálculo de `position` debe ser atómico por columna afectada para
  evitar condiciones de carrera si dos personas arrastran al mismo
  tiempo (aceptamos este riesgo por ahora; se resuelve con realtime +
  locks en una spec futura si se vuelve necesario).