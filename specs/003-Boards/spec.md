# Spec 003: Tableros (Boards)

## Estado
Completada ✅

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
- Editar el nombre de un tablero ya creado.
- Columnas y tarjetas dentro del tablero — spec 004.

## Criterios de aceptación

- [x] El Dashboard muestra los tableros del usuario autenticado (propios
      y donde es miembro), no los de otros usuarios.
- [x] Existe un botón/formulario para crear un tablero con nombre.
- [x] Al crear un tablero, el usuario queda como `owner` automáticamente.
- [x] Click en un tablero navega a `/board/:boardId`.
- [x] El dueño puede eliminar su tablero (con confirmación antes de
      borrar, para evitar borrados accidentales).
- [x] Dashboard vacío (sin tableros) muestra un mensaje/estado vacío, no
      una pantalla en blanco.
- [x] Las políticas RLS de `boards` y `board_members` impiden ver/editar
      tableros ajenos, incluso navegando directo a la URL.

## Preguntas abiertas (resueltas)
- ¿Se puede eliminar un tablero si eres `member` pero no `owner`? →
  No, solo el `owner` puede eliminar. Los miembros solo pueden salir
  (esa acción de "salir del tablero" queda para la spec de colaboración).