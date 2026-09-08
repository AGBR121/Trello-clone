# Spec 007: Color y encargado de tarjeta

## Estado
Completada ✅

## Contexto
Se agregan dos mejoras visuales/funcionales a las tarjetas del Kanban:
un color de etiqueta (como las labels de Trello) y un encargado
(assignee) elegido entre los miembros del tablero. La columna
`assigned_to` ya existía en el esquema desde el inicio del proyecto,
pero nunca se usó en la UI hasta ahora.

## Qué queremos (user stories)

1. **Como usuario**, quiero poder asignarle un color a una tarjeta desde
   su detalle, eligiendo entre un set fijo de colores predefinidos.
2. **Como usuario**, quiero ver ese color reflejado visualmente en la
   tarjeta dentro del tablero (no solo al abrir el detalle).
3. **Como usuario**, quiero poder asignar una tarjeta a uno de los
   miembros del tablero (incluyéndome a mí mismo).
4. **Como usuario**, quiero ver quién es el encargado de una tarjeta de
   un vistazo, sin tener que abrir su detalle.
5. **Como usuario**, quiero poder quitarle el color o el encargado a una
   tarjeta (volver a "sin color" / "sin asignar").

## Fuera de alcance para esta spec
- Colores personalizados (código hex libre) — solo un set fijo predefinido.
- Múltiples encargados por tarjeta.
- Filtrar/agrupar tarjetas por color o encargado.
- Notificar al encargado cuando se le asigna una tarjeta.

## Criterios de aceptación

- [x] El detalle de una tarjeta permite elegir un color de un set fijo
      (7 opciones) o "sin color".
- [x] El color elegido se ve en la tarjeta dentro de la columna (barra
      superior de color).
- [x] El detalle de una tarjeta permite elegir un encargado de la lista
      de miembros del tablero, o "Sin asignar" (guarda `null`).
- [x] La tarjeta en la columna muestra un círculo con las iniciales del
      encargado.
- [x] Ambos campos son opcionales y se pueden quitar después de asignados.
- [x] Solo se puede asignar a alguien que sea miembro del tablero (el
      selector solo se llena con `members` de ese tablero específico).

## Decisión técnica
Colores fijos en hexadecimal (paleta Tailwind tono 400), guardados
directo en `cards.color` como texto. Se renderizan con `style` inline
en vez de clases de Tailwind, ya que Tailwind no puede generar clases
dinámicas para colores arbitrarios provenientes de datos.