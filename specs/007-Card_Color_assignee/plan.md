# Plan 007: Color y encargado de tarjeta

## Base de datos: una sola columna nueva

`assigned_to` ya existe en `cards` desde el esquema original (referencia
a `auth.users`). Solo falta agregar `color`:

```sql
alter table cards add column color text;
```

No se requieren cambios de RLS: la política `for all` de `cards` (spec
004) ya cubre cualquier columna de la tabla, incluida esta nueva.

## Set de colores fijo

Usamos hexadecimales de la paleta de Tailwind (tono 400, buen contraste
tanto en modo claro como oscuro) para consistencia visual:

| Nombre | Hex |
|---|---|
| Rojo | `#f87171` |
| Naranja | `#fb923c` |
| Amarillo | `#facc15` |
| Verde | `#4ade80` |
| Azul | `#60a5fa` |
| Morado | `#c084fc` |
| Rosa | `#f472b6` |
| (ninguno) | `null` |

Se guarda el hex directamente en `cards.color` (más simple que un enum
o tabla aparte, y suficiente para el alcance de esta spec).

## De dónde sale la lista de miembros para asignar

No se necesita una consulta nueva: `BoardView` ya usa `useBoardMembers`
para el panel de "Miembros" (spec 005), que trae `user_id` + `username`
de cada miembro. Se pasa esa misma lista como prop hacia abajo:
`BoardView` → `Column` → `CardItem` (para mostrar iniciales) y
`BoardView` → `CardDetailModal` (para el selector de encargado).

## Componentes/archivos a modificar

### 1. `src/components/CardDetailModal.jsx`
- Nueva prop `members` (lista de miembros del tablero).
- Selector de color: fila de botones circulares (swatches) + opción
  "Sin color". Se maneja con `useState` local (no `register` de RHF,
  ya que no es un input de texto) y se incluye en el payload de
  `onSubmit` junto con los campos del formulario.
- Selector de encargado: un `<select>` nativo con las opciones de
  `members` (mostrando `username`) + opción "Sin asignar".

### 2. `src/components/CardItem.jsx`
- Nueva prop `assigneeUsername` (ya resuelto por el padre, para no
  repetir lógica de búsqueda en cada tarjeta).
- Si `card.color` existe: una barra delgada de color en la parte
  superior de la tarjeta (`style={{ backgroundColor: card.color }}`,
  ya que son colores arbitrarios, no clases de Tailwind precompiladas).
- Si hay encargado: un círculo con las iniciales del username, en la
  esquina de la tarjeta.

### 3. `src/components/Column.jsx`
- Recibe `members` y lo reenvía a cada `CardItem` (resolviendo el
  username del `assigned_to` de cada tarjeta antes de pasarlo).

### 4. `src/pages/BoardView.jsx`
- Pasa `members` (ya disponible de `useBoardMembers`) hacia `Column` y
  hacia `CardDetailModal`.

## Por qué colores como estilo inline y no clases de Tailwind

Tailwind necesita ver las clases completas en el código fuente para
generarlas en el build; no puede generar `bg-[#f87171]` dinámico desde
una variable sin configuración adicional (safelist). Como los colores
son datos que vienen de la base de datos, se usa `style={{ backgroundColor: color }}`
con hexadecimales directos — más simple y confiable que pelear con el
purga de CSS de Tailwind.

## Riesgos / cosas a validar
- Confirmar que solo aparezcan como opciones de encargado los miembros
  reales del tablero (no todos los usuarios del sistema) — ya se cumple
  porque el `<select>` solo se llena con el array `members`, que viene
  de `get_board_members` (spec 005), acotado a ese tablero.
- Si se remueve a un miembro del tablero (spec 005) mientras tiene
  tarjetas asignadas, esas tarjetas quedan con un `assigned_to` que ya
  no es miembro. No se limpia automáticamente en esta spec (edge case
  aceptado por ahora; se revisaría con un trigger si se vuelve un
  problema real).