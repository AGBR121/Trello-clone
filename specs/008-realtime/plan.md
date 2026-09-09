# Plan 008: Cambios en tiempo real

## Por qué denormalizar `board_id` en `cards`

Supabase Realtime filtra canales con condiciones simples tipo
`columna=eq.valor` sobre **una sola tabla a la vez** — no soporta
filtrar `cards` por el `board_id` de su columna padre sin tener esa
columna directamente en `cards`. Agregarla resuelve esto y, de paso,
simplifica la política RLS de `cards` (ya no depende de una subquery a
`columns`).

## Migración de base de datos

```sql
-- 1. Agregar la columna (nullable primero, para poder hacer backfill).
alter table cards add column board_id uuid references boards(id);

-- 2. Backfill: llenarla a partir de la columna padre de cada tarjeta.
update cards
set board_id = columns.board_id
from columns
where cards.column_id = columns.id;

-- 3. Ahora que todas las filas tienen valor, hacerla obligatoria.
alter table cards alter column board_id set not null;
```

## Actualizar política RLS de `cards` (simplificada)

```sql
drop policy "Acceso a tarjetas de mis tableros" on cards;

create policy "Acceso a tarjetas de mis tableros"
on cards for all
using ( is_board_member(board_id) )
with check ( is_board_member(board_id) );
```

Nota: ahora es idéntica en estructura a la de `columns` — consistente y
más fácil de mantener.

## Habilitar Realtime en las tablas

Por defecto, Supabase no transmite cambios de una tabla hasta que se
agrega explícitamente a la publicación de Realtime:

```sql
alter publication supabase_realtime add table columns;
alter publication supabase_realtime add table cards;
```

(Alternativa equivalente: Database → Replication en el dashboard de
Supabase, activando el toggle para `columns` y `cards`.)

## Actualizar `createCard` para incluir `board_id`

En `useColumns.js`, la función `createCard` ya tiene acceso a `boardId`
(es un parámetro del hook), así que solo hay que incluirlo en el insert:

```js
await supabase.from('cards').insert({
  column_id: columnId,
  board_id: boardId, // nuevo
  title: title.trim(),
  // ...resto igual
})
```

## Suscripción a cambios en tiempo real

Dentro de `useColumns(boardId)`, se agrega un `useEffect` adicional que
abre un canal de Supabase Realtime escuchando cambios en `columns` y
`cards` filtrados por `board_id`, y en cualquier evento simplemente
vuelve a pedir todo el árbol con `fetchColumns()`.

**Por qué "refetch completo" en vez de aplicar el cambio puntual:**
es una estrategia más simple y menos propensa a bugs de sincronización
(duplicados, órdenes inconsistentes) que reconciliar cada evento
individualmente contra el estado optimista local. Con el volumen de
datos de este proyecto (decenas de tarjetas), el costo de un refetch
completo es despreciable.

```js
useEffect(() => {
  if (!boardId) return

  const channel = supabase
    .channel(`board-${boardId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` },
      () => fetchColumns()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
      () => fetchColumns()
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [boardId, fetchColumns])
```

## Evitar refetches duplicados/excesivos (debounce simple)

Un `reorderCards` genera varios `upsert` casi simultáneos (una fila por
tarjeta afectada), lo que dispararía varios eventos de Realtime y varios
`fetchColumns()` seguidos. Se agrega un debounce corto (150ms) para
agrupar ráfagas de eventos en una sola llamada.

## Componentes/archivos a modificar

### 1. `src/hooks/useColumns.js`
- Recibe `boardId` (ya lo recibe).
- `createCard` incluye `board_id` en el insert.
- Nuevo `useEffect` con la suscripción a Realtime (con debounce).

### 2. Sin cambios necesarios en componentes de UI
Como el mecanismo es "refetch completo → mismo estado `columns` de
siempre", ningún componente (`Column`, `CardItem`, `BoardView`, etc.)
necesita saber que existe Realtime — simplemente reciben datos
actualizados como si el usuario hubiera recargado la página.

## Riesgos / cosas a validar
- Confirmar que Realtime esté habilitado para `columns` y `cards` en el
  dashboard de Supabase (paso manual, no solo SQL — verificar en
  Database → Replication).
- Confirmar que un usuario removido de un tablero (spec 005) deje de
  recibir eventos de inmediato (debería funcionar automáticamente,
  ya que Realtime respeta RLS y la policy usa `is_board_member`).
- Vigilar performance: si el tablero crece mucho (cientos de tarjetas),
  el refetch completo en cada evento podría notarse. No es un problema
  al alcance actual del proyecto.

## Incidente: eventos DELETE no llegaban con el filtro por board_id

**Síntoma:** crear/editar tarjetas se reflejaba en tiempo real
correctamente, pero eliminar una tarjeta (o columna) NO se reflejaba en
otras sesiones abiertas del mismo tablero.

**Causa:** por defecto, Postgres usa `REPLICA IDENTITY DEFAULT`, que
solo incluye la clave primaria en el "registro anterior" (`old record`)
cuando ocurre un `DELETE`. Como el filtro de Realtime es
`board_id=eq.<boardId>` y ese campo no viene incluido en el evento de
borrado, Supabase no puede evaluar el filtro contra ese registro y
descarta el evento silenciosamente (sin error visible en el cliente).

**Solución:**

```sql
alter table cards replica identity full;
alter table columns replica identity full;
```

Esto hace que Postgres incluya todos los campos de la fila (no solo la
PK) en los eventos de `DELETE`/`UPDATE`, permitiendo que el filtro por
`board_id` se evalúe correctamente.

**Lección para futuras specs con Realtime filtrado:** si se agrega un
filtro de Realtime sobre una columna que no es la clave primaria,
`REPLICA IDENTITY FULL` es necesario en esa tabla para que los eventos
`DELETE` (y `UPDATE` con filtro) lleguen correctamente.