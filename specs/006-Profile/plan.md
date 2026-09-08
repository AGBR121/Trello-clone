# Plan 006: Perfiles de usuario (nombre de usuario)

## Tabla nueva: `profiles`

No podemos agregar columnas a `auth.users` (es un esquema gestionado por
Supabase), así que creamos una tabla propia relacionada 1:1 por `id`.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- El username no es información sensible (es lo que otros miembros de
-- un tablero compartido van a ver), así que se permite lectura a
-- cualquier usuario autenticado, no solo a quienes comparten tablero.
create policy "Cualquier usuario autenticado puede ver perfiles"
on profiles for select
using ( auth.role() = 'authenticated' );

create policy "Un usuario puede crear su propio perfil"
on profiles for insert
with check ( id = auth.uid() );

create policy "Un usuario puede editar su propio perfil"
on profiles for update
using ( id = auth.uid() )
with check ( id = auth.uid() );
```

## Trigger: crear perfil automáticamente al registrarse

```sql
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := split_part(new.email, '@', 1);
  final_username := base_username;

  while exists (select 1 from profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into profiles (id, username) values (new.id, final_username);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
```

Este trigger se dispara automáticamente cada vez que Supabase Auth
inserta un nuevo usuario (al registrarse), sin que el cliente tenga que
hacer nada extra.

## Backfill: usuarios que ya existían antes de esta spec

El trigger solo aplica a usuarios nuevos. Los que ya se registraron en
specs anteriores necesitan su perfil creado manualmente una sola vez:

```sql
insert into profiles (id, username)
select id, split_part(email, '@', 1)
from auth.users
where id not in (select id from profiles);
```

Nota: esta consulta simple no maneja colisiones de username entre los
usuarios existentes (asumimos que en este proyecto de desarrollo son
pocos usuarios de prueba). Si hay colisión, se ajusta manualmente.

## Actualizar `get_board_members` para incluir username

Como cambia el tipo de retorno de la función, hay que borrarla y
recrearla (no basta con `create or replace` cuando cambian las columnas
de salida):

```sql
drop function get_board_members(uuid);

create function get_board_members(_board_id uuid)
returns table (user_id uuid, email text, username text, role text)
language sql
security definer
stable
as $$
  select bm.user_id, au.email, p.username, bm.role
  from board_members bm
  join auth.users au on au.id = bm.user_id
  left join profiles p on p.id = bm.user_id
  where bm.board_id = _board_id
    and is_board_member(_board_id);
$$;
```

## Componentes/archivos a crear o modificar

### 1. `src/hooks/useProfile.js`
- `profile` (username propio del usuario actual)
- `updateUsername(newUsername)` — valida formato en el cliente, y
  traduce el error de unicidad de Postgres (`23505 duplicate key`) a un
  mensaje claro.

### 2. `src/components/EditProfileModal.jsx`
- Formulario (React Hook Form) con un solo campo: username.
- Validación: 3-20 caracteres, solo letras/números/guion bajo.

### 3. `src/pages/Dashboard.jsx` (modificar)
- Reemplazar el email mostrado en el header por `profile.username`.
- Agregar botón/ícono de editar que abre `EditProfileModal`.

### 4. `src/components/MembersPanel.jsx` (modificar)
- Mostrar `member.username` en vez de `member.email` (con fallback a
  email si `username` viniera nulo, aunque no debería pasar).

## Manejo de errores
- Username duplicado al guardar → Postgres devuelve error de constraint
  único (código `23505`); se traduce a "Ese nombre de usuario ya está
  en uso."
- Formato inválido → validado antes de enviar, con mensaje de React
  Hook Form.

## Riesgos / cosas a validar
- Confirmar que el trigger se dispare correctamente probando un
  registro nuevo después de aplicar esta spec.
- Confirmar que el backfill cubrió a todos los usuarios de prueba
  creados en specs anteriores (verificar con
  `select count(*) from auth.users` vs `select count(*) from profiles`).