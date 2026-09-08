# Spec 007: Color y encargado de tarjeta

## Estado
Borrador

## Contexto
Se agregan dos mejoras visuales/funcionales a las tarjetas del Kanban:
un color de etiqueta (como las labels de Trello) y un encargado
(assignee) elegido entre los miembros del tablero. La columna
`assigned_to` ya existe en el esquema desde el inicio del proyecto,
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
- Múltiples encargados por tarjeta (solo uno, como en Trello clásico).
- Filtrar/agrupar tarjetas por color o encargado — spec futura si se
  necesita.
- Notificar al encargado cuando se le asigna una tarjeta.

## Criterios de aceptación

- [ ] El detalle de una tarjeta permite elegir un color de un set fijo
      (mínimo 6 opciones) o "sin color".
- [ ] El color elegido se ve en la tarjeta dentro de la columna (ej.
      una barra o borde de color).
- [ ] El detalle de una tarjeta permite elegir un encargado de la lista
      de miembros del tablero, o "Sin asignar" (que guarda `null` en
      `assigned_to`, valor por defecto cuando se crea una tarjeta).
- [ ] La tarjeta en la columna muestra alguna indicación visual del
      encargado (ej. iniciales en un círculo).
- [ ] Ambos campos son opcionales y se pueden quitar después de asignados.
- [ ] Solo se puede asignar a alguien que sea miembro del tablero (no
      cualquier usuario del sistema).

## Preguntas abiertas
- ¿Qué colores exactos incluir en el set fijo? → Se define en el plan
  técnico, usando la paleta de Tailwind para consistencia visual con el
  resto de la app.