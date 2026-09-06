# Plan 005: Colaboración (invitar miembros)

## El problema central

`board_members.user_id` es un `uuid` que referencia `auth.users`, pero
**Supabase no expone `auth.users` al cliente vía la API REST normal**
(ni siquiera con RLS, es un esquema separado y protegido). Esto significa
que no podemos hacer `supabase.from('users').select()` para buscar a
alguien por email, ni para mostrar el email de cada miembro en la lista.

## La solución: funciones RPC `security definer`

Igual que hicimos con `create_board`, usamos funciones que corren con
privilegios elevados y sí pueden leer `auth.users` internamente, pero
solo devuelven exactamente lo que el cliente necesita (nunca exponen la
tabla completa).

### 1. Invitar por email

```sql
create or replace function invite_member_by_email(_board_id uuid, _email text)
returns text -- devuelve un código de resultado simple para traducir en el cliente
language plpgsql
security definer
as $$
declare
  target_user_id uuid;
  is_owner boolean;
  already_member boolean;
begin
  -- Solo el owner puede invitar.
  select exists (
    select 1 from boards where id = _board_id and owner_id = auth.uid()
  ) into is_owner;

  if not is_owner then
    return 'not_owner';
  end if;

  -- Buscar el usuario por email en auth.users.
  select id into target_user_id
  from auth.users
  where email = _email
  limit 1;

  if target_user_id is null then
    return 'user_not_found';
  end if;

  select exists (
    select 1 from board_members
    where board_id = _board_id and user_id = target_user_id
  ) into already_member;

  if already_member then
    return 'already_member';
  end if;

  insert into board_members (board_id, user_id, role)
  values (_board_id, target_user_id, 'member');

  return 'ok';
end;
$$;
```

### 2. Listar miembros con su email

```sql
create or replace function get_board_members(_board_id uuid)
returns table (user_id uuid, email text, role text)
language sql
security definer
stable
as $$
  select bm.user_id, au.email, bm.role
  from board_members bm
  join auth.users au on au.id = bm.user_id
  where bm.board_id = _board_id
    and is_board_member(_board_id); -- solo si el que llama también es miembro
$$;
```

## Políticas RLS adicionales en `board_members`

Ya existen `select` e `insert` (desde la spec 003). Faltan `delete`:

```sql
create policy "Remover miembros (owner remueve, miembro se auto-remueve)"
on board_members for delete
using (
  user_id = auth.uid() -- un miembro puede salirse a sí mismo
  or board_id in (select id from boards where owner_id = auth.uid()) -- o el owner remueve a cualquiera
);
```

Nota: la función `invite_member_by_email` ya valida ownership internamente
antes de insertar, así que no depende únicamente de la policy de insert
existente — es una capa de defensa adicional con mensajes de error claros
en vez de que Postgres simplemente rechace el insert sin contexto.

## Componentes/archivos a crear o modificar

### 1. `src/hooks/useBoardMembers.js`
- `members` (vía `get_board_members` RPC)
- `inviteMember(email)` (vía `invite_member_by_email` RPC, traduce el
  código de resultado a mensaje en español)
- `removeMember(userId)`
- `leaveBoard()` (remueve al propio usuario actual)

### 2. `src/components/MembersPanel.jsx`
- Lista de miembros con email + badge de rol.
- Si `isOwner`: input para invitar por email + botón remover por fila.
- Si no es owner: botón "Salir del tablero" (con `ConfirmDialog`).
- Se abre como un panel lateral o modal desde `BoardView` (botón
  "Miembros" en el header).

### 3. `src/pages/BoardView.jsx` (modificar)
- Botón "Miembros" en el header que abre `MembersPanel`.
- Necesita saber si el usuario actual es owner del tablero actual
  (comparar `board.owner_id === user.id`).
- Si el usuario se sale del tablero (`leaveBoard`), redirigir a
  `/dashboard` inmediatamente (ya no tiene acceso).

## Manejo de errores (traducción de códigos RPC)

| Código de `invite_member_by_email` | Mensaje al usuario |
|---|---|
| `not_owner` | "Solo el dueño puede invitar." |
| `user_not_found` | "No existe una cuenta con ese email." |
| `already_member` | "Esta persona ya es miembro del tablero." |
| `ok` | (éxito, refrescar lista de miembros) |

## Riesgos / cosas a validar
- Confirmar que `get_board_members` no exponga la lista si el que llama
  no es miembro del tablero (ya cubierto con el `is_board_member` dentro
  del `where`).
- Si el owner se remueve a sí mismo por error (no debería ser posible
  desde la UI, pero validar a nivel de RLS también): la política de
  `delete` permite `user_id = auth.uid()` para cualquiera, incluido el
  owner. Se decide dejarlo así por simplicidad — si el owner se quita a
  sí mismo, sigue siendo `owner_id` en `boards` así que no pierde control
  real del tablero, solo su propia fila en `board_members` (esto se
  revisa si causa confusión en la práctica).