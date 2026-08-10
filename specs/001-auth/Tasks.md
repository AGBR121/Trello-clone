# Tasks 001: Autenticación de usuarios

- [x] T1 — Crear `src/hooks/useAuth.js` con estado de sesión y funciones
      `signUp`, `signIn`, `signOut`.
- [x] T2 — Crear `src/components/ProtectedRoute.jsx`.
- [x] T3 — Crear `src/components/PublicOnlyRoute.jsx`.
- [x] T4 — Reescribir `src/pages/Login.jsx` con formulario funcional
      (modo login/registro) usando `useAuth`.
- [x] T5 — Actualizar `src/pages/Dashboard.jsx`: saludo con email + botón
      de cerrar sesión.
- [x] T6 — Actualizar `src/App.jsx`: envolver rutas con `ProtectedRoute` /
      `PublicOnlyRoute`.
- [x] T7 — Probar manualmente: registro, login, logout, F5 con sesión
      activa, acceso directo a `/dashboard` sin sesión.
- [x] T8 — Confirmar en el dashboard de Supabase que los usuarios de
      prueba aparecen en Authentication → Users.
- [x] T9 — (Post-lanzamiento) Refactorizar `Login.jsx` para usar
      React Hook Form, por consistencia con el resto del proyecto
      (decisión tomada en la spec 003).

## Orden sugerido
T1 → T2 y T3 (en paralelo, son independientes) → T4 → T5 → T6 → T7 → T8