# Spec 008: Cambios en tiempo real

## Estado
Completada ✅

## Contexto
Hasta ahora, si dos personas tenían abierto el mismo tablero, los
cambios de una no se reflejaban en la pantalla de la otra hasta que
recargara manualmente (F5). Esta spec usa Supabase Realtime para que
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
   soy miembro de ese tablero.

## Fuera de alcance para esta spec
- Indicador de presencia ("quién está viendo el tablero ahora").
- Cursores en vivo o edición colaborativa carácter por carácter.
- Resolución de conflictos avanzada.

## Criterios de aceptación

- [x] Abrir el mismo tablero en dos pestañas/navegadores distintos
      muestra los cambios de una en la otra sin recargar.
- [x] Crear una columna se refleja en vivo en la otra sesión.
- [x] Crear, editar y eliminar una tarjeta se refleja en vivo.
- [x] Arrastrar una tarjeta (dentro o entre columnas) se refleja en vivo
      con el orden correcto.
- [x] Eliminar una columna se refleja en vivo.
- [x] Un usuario sin acceso al tablero no recibe eventos de él.

## Decisión técnica
Se agregó `board_id` directamente a la tabla `cards` (antes solo se
sabía indirectamente vía `column_id → columns.board_id`), para poder
filtrar los canales de Realtime de forma simple y directa por tablero.
Se usó estrategia de "refetch completo" en cada evento en vez de
reconciliar cambios puntuales, por simplicidad. Ver `plan.md` para el
incidente de `REPLICA IDENTITY FULL` necesario para eventos DELETE.