# Tasks 010: Testing y CI/CD

- [x] T1 — Instalar Vitest + Testing Library + jsdom (`bun add -D`).
- [x] T2 — Configurar `vite.config.js` (bloque `test`) y crear
      `src/test/setup.js`.
- [x] T3 — Agregar script `"test": "vitest"` a `package.json`.
- [x] T4 — Exportar `USERNAME_PATTERN`/validación de `useProfile.js` y
      escribir `useProfile.test.js`.
- [x] T5 — Exportar `formatDueDate` de `CardItem.jsx` y escribir
      `CardItem.test.js`.
- [x] T6 — Exportar `translateAuthError` de `useAuth.js` y escribir
      `useAuth.test.js`.
- [x] T7 — Escribir `ConfirmDialog.test.jsx`.
- [x] T8 — Crear `src/components/ErrorBoundary.jsx` y envolver `<App />`
      en `main.jsx`.
- [x] T9 — Crear `.github/workflows/ci.yml`.
- [x] T10 — Probar: correr `bun run test` localmente y confirmar que
      todo pasa; hacer push a GitHub y confirmar que el workflow corre
      y muestra ✅; romper algo a propósito (ej. un test) y confirmar
      que el workflow falla visiblemente (❌).

## Orden sugerido
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10

## Notas de verificación de T10

- **Local (verificado):** `bun run test` → 4 archivos de test, 21 tests
  pasan. `bun run lint` → sin errores.
- **GitHub (mecanismo):** `ci.yml` se dispara en cada push/PR a `main`
  con los pasos lint + test + build e inyecta las
  `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` desde los Secrets del
  repositorio. El estado se ve en la pestaña *Actions*.