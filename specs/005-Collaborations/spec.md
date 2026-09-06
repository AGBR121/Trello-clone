# Spec 005: Colaboración (invitar miembros)

## Estado
Borrador

## Contexto
Hasta ahora `board_members` solo se pobló automáticamente al crear un
tablero (el creador queda como `owner`). Esta spec permite que el owner
invite a otras personas por email, que aparezcan en una lista de
miembros, y que un miembro pueda salir de un tablero.

## Qué queremos (user stories)

1. **Como owner de un tablero**, quiero invitar a alguien escribiendo su
   email, para que pueda ver y editar el tablero.
2. **Como owner**, si el email no corresponde a ningún usuario
   registrado, quiero un mensaje claro indicándolo (no un error técnico).
3. **Como owner**, si esa persona ya es miembro, quiero un mensaje claro
   en vez de una fila duplicada o un error de base de datos.
4. **Como usuario dentro de un tablero**, quiero ver la lista de todos
   los miembros (email + rol: dueño/miembro).
5. **Como owner**, quiero poder remover a un miembro del tablero.
6. **Como miembro** (no owner), quiero poder salir de un tablero
   voluntariamente.
7. **Como usuario**, en el Dashboard quiero distinguir visualmente los
   tableros donde soy dueño de aquellos donde soy invitado (ya lo
   mostramos parcialmente en `BoardCard` desde la spec 003).

## Fuera de alcance para esta spec
- Roles intermedios (ej. "editor" vs "solo lectura") — por ahora todo
  miembro tiene los mismos permisos que el owner sobre columnas/tarjetas,
  excepto eliminar el tablero o gestionar miembros.
- Notificaciones por email al invitar (Supabase no envía email custom
  fácilmente sin configurar SMTP propio; queda fuera de alcance).
- Invitar por link compartible (solo por email exacto de un usuario ya
  registrado).

## Criterios de aceptación

- [ ] Existe una UI (dentro de `BoardView`) donde el owner puede escribir
      un email e invitar.
- [ ] Invitar a un email no registrado muestra "No existe una cuenta con
      ese email."
- [ ] Invitar a alguien que ya es miembro muestra "Esta persona ya es
      miembro del tablero."
- [ ] La lista de miembros muestra email y rol de cada uno.
- [ ] El owner puede remover a cualquier miembro (no a sí mismo desde
      ahí; eliminar el tablero completo ya cubre ese caso).
- [ ] Un miembro (no owner) ve un botón "Salir del tablero" y al usarlo
      pierde acceso inmediatamente.
- [ ] Solo el owner ve la UI de invitar/remover miembros.
- [ ] Un usuario no puede invitar a nadie a un tablero del que no es
      owner (verificado por RLS, no solo ocultando el botón en la UI).

## Preguntas abiertas
- ¿Qué pasa si el owner se remueve a sí mismo? → No se permite; el
  owner solo puede irse eliminando el tablero completo (ya existe).