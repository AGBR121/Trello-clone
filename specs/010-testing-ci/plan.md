# Plan 010: Testing y CI/CD

## Librerías a instalar

```powershell
bun add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- **Vitest** — corredor de tests, integrado nativamente con Vite (mismo
  motor de transformación, configuración compartida).
- **Testing Library** — renderiza componentes y permite consultarlos
  como lo haría un usuario real (por texto visible, rol, etc.), en vez
  de depender de detalles de implementación.
- **jsdom** — simula un DOM de navegador en Node, necesario para que
  Vitest pueda renderizar componentes React sin un navegador real.

## Configuración de Vitest

Se agrega un bloque `test` en `vite.config.js` (Vitest reutiliza la
config de Vite):

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
})
```

`src/test/setup.js` importa los matchers de `@testing-library/jest-dom`
(ej. `toBeInTheDocument()`) para que estén disponibles en todos los
tests sin repetir el import en cada archivo.

## Qué se prueba y por qué

Se prioriza lógica **pura** (funciones sin dependencias externas) sobre
mockear Supabase, porque da la mayor señal de calidad con el menor
esfuerzo de configuración:

1. **Validación de username** (`useProfile.js`, spec 006) — el regex
   `USERNAME_PATTERN` es una función pura fácil de aislar y probar con
   casos límite (muy corto, con espacios, con símbolos).
2. **Formato de fecha** (`CardItem.jsx`, spec 004) — `formatDueDate`
   convierte un string ISO a formato legible en español; se extrae como
   función exportada para poder probarla sin renderizar el componente.
3. **Traducción de errores de auth** (`useAuth.js`, spec 001) —
   `translateAuthError` mapea mensajes de Supabase a español; también
   se exporta para poder probarla de forma aislada.
4. **Componente `ConfirmDialog`** — test de comportamiento: no renderiza
   nada si `open=false`; muestra título/mensaje si `open=true`; llama a
   `onConfirm`/`onCancel` al hacer click en los botones correspondientes.

Nota: para poder probar `formatDueDate` y `translateAuthError` de forma
aislada, hay que agregarles `export` en sus archivos (actualmente son
funciones internas no exportadas).

## Error Boundary

Un componente de clase (los Error Boundaries de React solo funcionan
como clases, no hooks) que envuelve `<App />` en `main.jsx`, capturando
cualquier error de render no controlado y mostrando una pantalla de
recuperación con opción de recargar, en vez de una pantalla en blanco.

## GitHub Actions

`.github/workflows/ci.yml` — se dispara en push y pull request a la
rama principal. Usa `oven-sh/setup-bun` (acción oficial de Bun) para
instalar dependencias con el mismo gestor de paquetes del proyecto.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run test -- --run
      - run: bun run build
```

Nota: `bun run test -- --run` fuerza a Vitest a correr una sola vez y
salir (por defecto, en modo interactivo se queda escuchando cambios),
que es lo que necesita un entorno de CI.

## Componentes/archivos a crear o modificar

1. `vite.config.js` (modificar) — agregar bloque `test`.
2. `src/test/setup.js` (nuevo).
3. `src/hooks/useProfile.test.js` (nuevo).
4. `src/components/CardItem.jsx` (modificar) — exportar `formatDueDate`.
5. `src/components/CardItem.test.js` (nuevo).
6. `src/hooks/useAuth.jsx` (modificar) — exportar `translateAuthError`.
7. `src/hooks/useAuth.test.js` (nuevo).
8. `src/components/ConfirmDialog.test.jsx` (nuevo).
9. `src/components/ErrorBoundary.jsx` (nuevo).
10. `src/main.jsx` (modificar) — envolver `<App />` con `ErrorBoundary`.
11. `.github/workflows/ci.yml` (nuevo).
12. `package.json` (modificar manualmente) — agregar script `"test": "vitest"`.

## Riesgos / cosas a validar
- Confirmar que el workflow de CI realmente falle (❌ visible en
  GitHub) si se rompe algo a propósito, para verificar que no está mal
  configurado y "pasando en falso".
- El paso de lint en CI asume que ya existe un script `lint` en
  `package.json` (viene por defecto con el scaffold de Vite + ESLint
  que se eligió al crear el proyecto).