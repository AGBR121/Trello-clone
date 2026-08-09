# Plan 003: Tableros (Boards)

## Base de datos: políticas RLS pendientes

Las políticas de `boards` ya existen (definidas junto con la constitución).
Faltan las de `board_members`, necesarias para que la política de `boards`
funcione correctamente (recuerda que "ver tableros donde soy miembro"
depende de poder leer `board_members`).

```sql
alter table board_members enable row level security;

-- Un usuario puede ver las filas de board_members de tableros donde
-- también aparece (para saber quién más está en sus tableros).
create policy "Ver miembros de mis tableros"
on board_members for select
using (
  board_id in (
    select board_id from board_members where user_id = auth.uid()
  )
);

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

## Creación de un tablero: transacción lógica

Crear un tablero requiere DOS inserts (uno en `boards`, otro en
`board_members` con rol `owner`). Usamos una función de Postgres (RPC)
para que ambos ocurran juntos de forma atómica, en vez de dos llamadas
separadas desde el cliente (que podrían fallar a medias):

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

## Componentes/archivos a crear o modificar

### 1. `src/hooks/useBoards.js`
Hook que expone:
- `boards` — lista de tableros del usuario (con loading/error)
- `createBoard(name)` — llama al RPC `create_board`, refresca la lista
- `deleteBoard(boardId)` — borra (solo funciona si RLS lo permite, es
  decir, si eres el owner)

Trae los boards con un `select` que ordena por `created_at desc`.

### 2. `src/components/BoardCard.jsx`
Tarjeta visual de un tablero en la lista del Dashboard: nombre, y botón
de eliminar (solo visible si el usuario es el owner — comparamos
`board.owner_id === user.id`).

### 3. `src/components/CreateBoardModal.jsx`
Modal simple con un input de texto y botón "Crear" — al confirmar, llama
a `createBoard(name)` del hook.

### 4. `src/components/ConfirmDialog.jsx`
Componente genérico reutilizable de confirmación ("¿Seguro que quieres
eliminar X?" con botones Cancelar/Confirmar). Se usará aquí para borrar
tableros, y probablemente después para borrar tarjetas/columnas también.

### 5. `src/pages/Dashboard.jsx` (modificar)
- Usa `useBoards` para traer y mostrar la lista con `BoardCard`.
- Botón "Nuevo tablero" que abre `CreateBoardModal`.
- Estado vacío si `boards.length === 0`.
- Cada `BoardCard` navega a `/board/:id` con `useNavigate` o `<Link>`.

### 6. `src/pages/BoardView.jsx` (modificar)
- Por ahora, solo trae el tablero por `boardId` desde Supabase y muestra
  su nombre (las columnas/tarjetas vienen en la spec 004).
- Si el fetch falla por RLS (tablero ajeno) o no existe, muestra un
  mensaje "Tablero no encontrado o sin acceso" en vez de un error crudo.
- Aplicar `dark:` (pendiente de la spec 002, T6/T7).

## Manejo de errores
- Si `create_board` falla (ej. nombre vacío), mostrar mensaje en el modal.
- Si `deleteBoard` falla (ej. ya no eres owner, o error de red), mostrar
  un mensaje de error sin remover la tarjeta de la UI hasta confirmar
  éxito del backend.