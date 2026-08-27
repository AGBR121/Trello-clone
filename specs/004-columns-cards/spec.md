# Spec 004: Columnas y Tarjetas (Kanban)

## Estado
Borrador

## Contexto
Con tableros funcionando (spec 003), esta es la feature central del
proyecto: convertir `BoardView` en un tablero Kanban real, con columnas
y tarjetas que se pueden crear, editar, y reordenar por drag & drop
(tanto dentro de una columna como entre columnas distintas).

## Qué queremos (user stories)

1. **Como usuario dentro de un tablero**, quiero ver sus columnas
   ordenadas horizontalmente (ej. "Por hacer", "En progreso", "Hecho").
2. **Como usuario**, quiero poder crear una columna nueva dándole un
   nombre.
3. **Como usuario**, quiero poder eliminar una columna (y con ella, sus
   tarjetas — con confirmación previa).
4. **Como usuario**, dentro de cada columna quiero ver sus tarjetas y
   poder crear una nueva con título (descripción y fecha límite
   opcionales).
5. **Como usuario**, quiero poder hacer click en una tarjeta para
   ver/editar su detalle completo (título, descripción, fecha límite).
6. **Como usuario**, quiero poder eliminar una tarjeta (con confirmación).
7. **Como usuario**, quiero poder arrastrar una tarjeta para reordenarla
   dentro de la misma columna.
8. **Como usuario**, quiero poder arrastrar una tarjeta de una columna a
   otra.
9. **Como usuario**, el nuevo orden de tarjetas y columnas debe
   persistir (guardarse en Supabase), no perderse al recargar.

## Fuera de alcance para esta spec
- Reordenar columnas por drag & drop (solo tarjetas por ahora; se puede
  agregar después con el mismo patrón).
- Asignar tarjetas a otros usuarios — spec de colaboración.
- Comentarios o etiquetas de color en tarjetas.
- Tiempo real (que dos usuarios vean cambios en vivo) — spec separada.

## Criterios de aceptación

- [ ] Las columnas de un tablero se muestran ordenadas por `position`.
- [ ] Se puede crear una columna con nombre.
- [ ] Se puede eliminar una columna (con confirmación, avisando que se
      pierden sus tarjetas).
- [ ] Las tarjetas de cada columna se muestran ordenadas por `position`.
- [ ] Se puede crear una tarjeta con título (descripción/fecha opcionales).
- [ ] Se puede abrir el detalle de una tarjeta y editar sus campos.
- [ ] Se puede eliminar una tarjeta (con confirmación).
- [ ] Arrastrar una tarjeta dentro de la misma columna actualiza su
      `position` y persiste tras F5.
- [ ] Arrastrar una tarjeta a otra columna actualiza su `column_id` y
      `position`, y persiste tras F5.
- [ ] Un usuario sin acceso al tablero (RLS) no puede ver ni modificar
      sus columnas/tarjetas, ni siquiera vía llamadas directas a la API.

## Decisión técnica (adelanto, se detalla en plan.md)
Se usa `@dnd-kit/core` + `@dnd-kit/sortable` para el drag & drop, por su
soporte de accesibilidad (teclado, lectores de pantalla) y madurez frente
a alternativas más nuevas.

## Preguntas abiertas
- ¿Límite de columnas o tarjetas por tablero? → No por ahora, se revisa
  si se vuelve un problema de rendimiento real.