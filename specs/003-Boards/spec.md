# Spec 003: Tableros (Boards)

## Estado
Borrador

## Contexto
Con autenticación resuelta (spec 001), el siguiente paso es que un usuario
pueda crear, ver y entrar a sus tableros. Esta spec cubre el CRUD básico de
`boards` y su listado en el Dashboard — todavía no incluye columnas ni
tarjetas (eso será una spec separada, 004-columns-cards).

## Qué queremos (user stories)

1. **Como usuario autenticado**, quiero ver en el Dashboard la lista de
   tableros donde soy dueño o miembro.
2. **Como usuario**, quiero poder crear un tablero nuevo dándole un nombre.
3. **Como usuario**, al crear un tablero, quiero quedar automáticamente
   como su dueño (`owner_id` + fila en `board_members` con rol `owner`).
4. **Como usuario**, quiero poder hacer click en un tablero de la lista y
   navegar a su vista (`/board/:boardId`).
5. **Como dueño de un tablero**, quiero poder eliminarlo.
6. **Como usuario**, si el Dashboard no tiene tableros aún, quiero ver un
   estado vacío claro invitándome a crear el primero (no una lista en
   blanco sin contexto).
7. **Como usuario**, si intento acceder a `/board/:boardId` de un tablero
   que no es mío y no soy miembro, quiero ser bloqueado (RLS) y ver un
   mensaje claro, no un error técnico.

## Fuera de alcance para esta spec
- Invitar a otros usuarios a un tablero — spec separada (005-collaboration).
- Editar el nombre de un tablero ya creado (se puede agregar rápido después
  si se necesita, pero no es parte del criterio de aceptación aquí).
- Columnas y tarjetas dentro del tablero — spec 004.

## Criterios de aceptación

- [ ] El Dashboard muestra los tableros del usuario autenticado (propios
      y donde es miembro), no los de otros usuarios.
- [ ] Existe un botón/formulario para crear un tablero con nombre.
- [ ] Al crear un tablero, el usuario queda como `owner` automáticamente.
- [ ] Click en un tablero navega a `/board/:boardId`.
- [ ] El dueño puede eliminar su tablero (con confirmación antes de
      borrar, para evitar borrados accidentales).
- [ ] Dashboard vacío (sin tableros) muestra un mensaje/estado vacío, no
      una pantalla en blanco.
- [ ] Las políticas RLS de `boards` y `board_members` impiden ver/editar
      tableros ajenos, incluso navegando directo a la URL.

## Preguntas abiertas
- ¿Se puede eliminar un tablero si eres `member` pero no `owner`? →
  No, solo el `owner` puede eliminar. Los miembros solo pueden salir
  (esa acción de "salir del tablero" queda para la spec de colaboración).