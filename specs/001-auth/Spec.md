# Spec 001: Autenticación de usuarios

## Estado
Completada ✅

## Contexto
La aplicación necesita identificar quién es cada usuario para poder asociar
tableros, membresías y permisos (RLS). Esta es la primera feature porque
todo lo demás depende de tener un usuario autenticado.

## Qué queremos (user stories)

1. **Como visitante**, quiero poder registrarme con email y contraseña para
   crear una cuenta.
2. **Como usuario registrado**, quiero poder iniciar sesión con email y
   contraseña para acceder a mis tableros.
3. **Como usuario autenticado**, quiero poder cerrar sesión.
4. **Como visitante no autenticado**, si intento entrar a `/dashboard` o
   `/board/:id`, quiero ser redirigido automáticamente a `/login`.
5. **Como usuario autenticado**, si voy a `/login` manualmente, quiero ser
   redirigido a `/dashboard` (ya no tiene sentido ver el login).
6. **Como usuario**, quiero ver un mensaje de error claro si mi email o
   contraseña son incorrectos, o si el email ya está registrado.

## Fuera de alcance para esta spec
- Login social (Google, GitHub, etc.) — se puede agregar después.
- Recuperación de contraseña — spec separada.
- Verificación de email obligatoria — Supabase la maneja por default,
  no se personaliza en esta fase.

## Criterios de aceptación

- [ ] Un usuario nuevo puede registrarse con email/contraseña válidos.
- [ ] Un usuario registrado puede iniciar sesión y llega a `/dashboard`.
- [ ] Un usuario puede cerrar sesión y vuelve a `/login`.
- [ ] Rutas protegidas (`/dashboard`, `/board/:id`) redirigen a `/login`
      si no hay sesión activa.
- [ ] `/login` redirige a `/dashboard` si ya hay sesión activa.
- [ ] Errores de auth (credenciales inválidas, email duplicado) se muestran
      al usuario en la UI, no solo en consola.
- [ ] La sesión persiste al recargar la página (no se pierde el login al
      hacer F5).

## Preguntas abiertas
- ¿Contraseña mínima de cuántos caracteres? → Se usará el mínimo de
  Supabase (6 caracteres) por ahora.
- ¿Confirmación de email obligatoria antes de poder iniciar sesión? →
  Se deja el comportamiento default de Supabase (activado), se puede
  desactivar en el dashboard de Supabase si se quiere agilizar pruebas.