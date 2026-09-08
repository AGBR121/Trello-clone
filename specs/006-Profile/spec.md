# Spec 006: Perfiles de usuario (nombre de usuario)

## Estado
Completada ✅

## Contexto
Hasta ahora la app solo conocía el `email` de cada usuario (vía
`auth.users`). Esta spec agrega un nombre de usuario editable, visible
en el header del Dashboard y en la lista de miembros de un tablero, en
vez del email.

## Qué queremos (user stories)

1. **Como usuario nuevo**, al registrarme quiero que se me asigne
   automáticamente un nombre de usuario por defecto (derivado de mi
   email), sin tener que escribirlo en el registro.
2. **Como usuario**, quiero poder cambiar mi nombre de usuario desde el
   Dashboard.
3. **Como usuario**, si el nombre que elijo ya está en uso por otra
   persona, quiero un mensaje claro (no un error técnico).
4. **Como usuario**, en el header del Dashboard quiero ver mi nombre de
   usuario en vez de mi email.
5. **Como usuario dentro de un tablero**, en la lista de "Miembros"
   quiero ver el nombre de usuario de cada persona en vez de su email.

## Fuera de alcance para esta spec
- Foto de perfil / avatar.
- Cambiar el email o la contraseña desde este mismo flujo.
- Validación de contenido del username (groserías, etc.) — solo se
  valida unicidad y formato básico (sin espacios, longitud razonable).

## Criterios de aceptación

- [x] Todo usuario nuevo obtiene un username automático al registrarse
      (derivado de la parte del email antes de la `@`, con sufijo
      numérico si ya existe).
- [x] Existe una UI para editar el username propio.
- [x] Intentar guardar un username ya usado por otra persona muestra un
      mensaje claro de error.
- [x] El header del Dashboard muestra el username, no el email.
- [x] `MembersPanel` muestra el username de cada miembro (con el email
      como respaldo si por alguna razón no tiene username).
- [x] Usuarios que ya existían antes de esta spec también tienen un
      username asignado (migración/backfill).

## Preguntas abiertas (resueltas)
- ¿Reglas de formato del username? → Mínimo 3, máximo 20 caracteres,
  solo letras, números y guion bajo. Validado tanto en el cliente
  (React Hook Form) como implícitamente por la constraint `unique` de
  la base de datos para la unicidad.