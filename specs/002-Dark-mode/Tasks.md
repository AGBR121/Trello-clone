# Tasks 002: Modo oscuro

- [x] T1 — Habilitar custom variant `dark` basado en clase en
      `src/index.css`.
- [x] T2 — Crear `src/hooks/useTheme.js` (estado, persistencia en
      localStorage, detección de preferencia del sistema).
- [x] T3 — Crear `src/components/ThemeToggle.jsx`.
- [x] T4 — Aplicar `dark:` a `src/pages/Login.jsx` + agregar `ThemeToggle`.
- [x] T5 — Aplicar `dark:` a `src/pages/Dashboard.jsx` + agregar
      `ThemeToggle`.
- [x] T6 — Aplicar `dark:` a `src/pages/BoardView.jsx` + agregar
      `ThemeToggle`.
- [x] T7 — Probar: toggle persiste tras F5, respeta preferencia del
      sistema en primera visita, sin contrastes rotos en ninguna pantalla.
- [x] T8 — (Post-lanzamiento) Migrar paleta de grises de `dark:` de
      `slate` a `neutral` en todo `src/` (find & replace con regex:
      `dark:([a-zA-Z0-9:_-]*?)slate-` → `dark:$1neutral-`).
- [x] T9 — Verificar que no quede ningún `dark:*-slate-*` en el proyecto
      (`grep -roP 'dark:[a-zA-Z0-9:_-]*?slate-' src/`) y que el modo
      claro conserve `slate` sin cambios.

## Incidentes / cambios posteriores al cierre inicial

**Ajuste de paleta de color en dark mode.** Después de cerrar esta spec
la primera vez, se decidió que el tono azulado de la paleta `slate` no
era el look deseado para el modo oscuro. Se migró a `neutral` (gris
verdadero) mediante un find & replace con regex aplicado a todo
`src/**/*.jsx`, cuidando de solo afectar clases prefijadas con `dark:`
para no tocar el modo claro. Documentado como regla permanente en la
constitución (sección 3, punto 6).