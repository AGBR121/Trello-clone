# Plan 001: Autenticación de usuarios

## Enfoque

Usar `supabase-js` directamente (sin librerías extra como Auth UI) para
tener control total del diseño con Tailwind, y un hook `useAuth` que
centralice el estado de sesión.

## Componentes/archivos a crear o modificar

### 1. `src/hooks/useAuth.js`
Hook que expone:
- `user` — usuario actual (o `null`)
- `loading` — true mientras se resuelve la sesión inicial
- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`

Internamente usa `supabase.auth.getSession()` al montar, y se suscribe a
`supabase.auth.onAuthStateChange` para reaccionar a login/logout en vivo.

### 2. `src/components/ProtectedRoute.jsx`
Componente wrapper que:
- Si `loading` → muestra un spinner/mensaje de carga.
- Si no hay `user` → redirige a `/login` (usando `<Navigate />` de
  react-router-dom).
- Si hay `user` → renderiza los children.

### 3. `src/components/PublicOnlyRoute.jsx`
Lo inverso: si ya hay `user`, redirige a `/dashboard` (para que `/login`
no sea accesible estando ya autenticado).

### 4. `src/pages/Login.jsx` (modificar)
- Formulario con email + contraseña.
- Toggle entre modo "iniciar sesión" y "registrarse" (un solo componente,
  dos modos, para no duplicar UI).
- Muestra errores de Supabase de forma legible (traducir mensajes comunes
  al español).
- Botón de submit con estado de loading (deshabilitado mientras procesa).

### 5. `src/pages/Dashboard.jsx` (modificar)
- Agregar botón "Cerrar sesión" que llame a `signOut()`.
- Mostrar el email del usuario actual como saludo.

### 6. `src/App.jsx` (modificar)
- Envolver `/dashboard` y `/board/:boardId` con `<ProtectedRoute>`.
- Envolver `/login` (o `/`) con `<PublicOnlyRoute>`.

## Manejo de errores de Supabase

Mapear los códigos/mensajes más comunes a texto en español:
- `Invalid login credentials` → "Email o contraseña incorrectos."
- `User already registered` → "Ya existe una cuenta con este email."
- Fallback genérico → "Ocurrió un error, intenta de nuevo."

## Persistencia de sesión

Por defecto, `supabase-js` guarda la sesión en `localStorage` y la refresca
automáticamente — no se requiere configuración adicional para que
sobreviva a un F5.

## Riesgos / cosas a validar
- Confirmar que RLS de `boards` (ya definida en la constitución) no
  bloquee la lectura antes de que el usuario tenga tableros creados
  (debería devolver lista vacía, no error).