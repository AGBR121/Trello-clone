# Plan 003: Tableros (Boards)

## Base de datos: políticas RLS de board_members

```sql
alter table board_members enable row level security;

-- NOTA (fix aplicado durante implementación): la versión original de
-- esta política causaba recursión infinita porque su subquery
-- consultaba board_members dentro de una política de la propia tabla
-- board_members (Postgres detecta el ciclo y responde 500 Internal
-- Server Error). Se resolvió con una función security definer que
-- rompe el ciclo, ya que se ejecuta saltándose RLS internamente.

create or replace function is_board_member(_board_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from board_members
    where board_id = _board_id and user_id = auth.uid()
  );
$$;

create policy "Ver miembros de mis tableros"
on board_members for select
using ( is_board_member(board_id) );

-- Solo el dueño del tablero puede agregar miembros directamente
-- (la UI de invitación vendrá en la spec de colaboración; por ahora
-- esta política solo permite que el propio owner se auto-inserte
-- al crear el tablero).
create policy "Insertar membresía al crear tablero"
on board_members for insert
with check (
  user_id = auth.uid()
  or board_id in (select id from boards where owner_id = auth.uid())
);
```

**Lección para specs futuras:** evitar que una política RLS de la tabla X
consulte la misma tabla X dentro de su propia condición. Si se necesita,
usar una función `security definer` para romper el ciclo.

## Creación de un tablero: función RPC atómica

```sql
create or replace function create_board(board_name text)
returns uuid
language plpgsql
security definer
as $$
declare
  new_board_id uuid;
begin
  insert into boards (name, owner_id)
  values (board_name, auth.uid())
  returning id into new_board_id;

  insert into board_members (board_id, user_id, role)
  values (new_board_id, auth.uid(), 'owner');

  return new_board_id;
end;
$$;
```

Se llama desde el cliente con `supabase.rpc('create_board', { board_name })`.

## Componentes/archivos creados

1. **`src/hooks/useBoards.js`** — `boards`, `loading`, `error`,
   `createBoard(name)`, `deleteBoard(boardId)`, `refetch`.
2. **`src/components/BoardCard.jsx`** — tarjeta de tablero, navega al
   click, botón eliminar solo visible para el owner (con hover), usa
   `ConfirmDialog`.
3. **`src/components/CreateBoardModal.jsx`** — formulario con React
   Hook Form, validación de nombre requerido y máximo 60 caracteres.
4. **`src/components/ConfirmDialog.jsx`** — diálogo de confirmación
   genérico y reutilizable, con variant `danger`.
5. **`src/pages/Dashboard.jsx`** — conecta `useBoards`, `BoardCard`,
   `CreateBoardModal`; maneja loading/error/estado vacío.
6. **`src/pages/BoardView.jsx`** — trae el tablero por `boardId` con
   `.maybeSingle()`, maneja "no encontrado o sin acceso" (cubre tablero
   inexistente y bloqueo por RLS con el mismo mensaje), dark mode
   completo.

## Manejo de errores
- `create_board` fallido → error inyectado en el campo `name` del form
  vía `setError` de React Hook Form.
- `deleteBoard` fallido → mensaje de error, la tarjeta no se remueve de
  la UI hasta confirmar éxito del backend.
- Tablero inexistente o ajeno → mismo mensaje genérico ("no encontrado o
  sin acceso"), para no filtrar información sobre si el tablero existe
  pero pertenece a otro usuario.