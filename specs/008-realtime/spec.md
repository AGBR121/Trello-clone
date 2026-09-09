# Spec 008: Cambios en tiempo real

## Estado
Borrador

## Contexto
Hasta ahora, si dos personas tienen abierto el mismo tablero, los
cambios de una no se reflejan en la pantalla de la otra hasta que
recargue manualmente (F5). Esta spec usa Supabase Realtime para que
crear/editar/eliminar/mover columnas y tarjetas se vea reflejado en
vivo para todos los que tengan ese tablero abierto.

## Qué queremos (user stories)

1. **Como usuario viendo un tablero**, si otro miembro crea una columna,
   quiero verla aparecer sin recargar la página.
2. **Como usuario**, si otro miembro crea, edita o elimina una tarjeta,
   quiero ver el cambio reflejado en vivo.
3. **Como usuario**, si otro miembro arrastra una tarjeta a otra columna
   o la reordena, quiero ver el nuevo orden reflejado en vivo.
4. **Como usuario**, si otro miembro elimina una columna, quiero que
   desaparezca de mi pantalla sin recargar.
5. **Como usuario**, los cambios en tiempo real solo deben llegarme si
   soy miembro de ese tablero (no debo recibir eventos de tableros
   ajenos).

## Fuera de alcance para esta spec
- Indicador de "quién está viendo el tablero ahora" (presence) — se
  podría agregar después con el mismo mecanismo de Supabase Realtime.
- Cursores en vivo o edición colaborativa carácter por carácter dentro
  de un mismo campo de texto (ej. dos personas editando la descripción
  de la misma tarjeta a la vez) — fuera de alcance, se resuelve con
  "el último que guarda gana", como ya ocurre hoy.
- Resolución de conflictos avanzada (ej. mostrar una advertencia si
  alguien más editó la tarjeta mientras la tenías abierta).

## Criterios de aceptación

- [ ] Abrir el mismo tablero en dos pestañas/navegadores distintos (o
      dos cuentas) muestra los cambios de una en la otra sin recargar.
- [ ] Crear una columna se refleja en vivo en la otra sesión.
- [ ] Crear, editar y eliminar una tarjeta se refleja en vivo.
- [ ] Arrastrar una tarjeta (dentro o entre columnas) se refleja en vivo
      con el orden correcto.
- [ ] Eliminar una columna se refleja en vivo.
- [ ] Un usuario sin acceso al tablero no recibe ningún evento de él
      (verificado por las políticas RLS ya existentes, que Supabase
      Realtime respeta).

## Decisión técnica (adelanto, se detalla en plan.md)
Se agrega `board_id` directamente a la tabla `cards` (antes solo se
sabía indirectamente vía `column_id → columns.board_id`), para poder
filtrar los canales de Realtime de forma simple y directa por tablero.