# Tasks 007: Color y encargado de tarjeta

- [ ] T1 — Correr en Supabase SQL Editor: `alter table cards add column color text;`
- [ ] T2 — Actualizar `src/components/CardDetailModal.jsx`: selector de
      color (swatches) + selector de encargado (`<select>` con
      `members`).
- [ ] T3 — Actualizar `src/components/CardItem.jsx`: barra de color +
      círculo de iniciales del encargado.
- [ ] T4 — Actualizar `src/components/Column.jsx`: recibir y reenviar
      `members`, resolver username del `assigned_to` por tarjeta.
- [ ] T5 — Actualizar `src/pages/BoardView.jsx`: pasar `members` a
      `Column` y a `CardDetailModal`.
- [ ] T6 — Probar: asignar color a una tarjeta y verlo en la columna,
      quitar el color, asignar un encargado y ver sus iniciales, quitar
      el encargado, confirmar que el selector de encargado solo muestra
      miembros reales del tablero.

## Orden sugerido
T1 → T5 (pasar members primero facilita probar T2-T4) → T2 → T3 → T4 → T6