# Constitución del Proyecto: Trello Clone

## 1. Propósito

Aplicación de gestión de tareas colaborativa estilo Trello, construida como
proyecto de portafolio para demostrar competencias full stack: autenticación,
base de datos relacional, tiempo real, y buenas prácticas de desarrollo.

## 2. Stack Tecnológico (no negociable)

- **Frontend:** React 19 + Vite
- **Estilos:** Tailwind CSS v4 (utility-first, sin CSS custom salvo casos
  justificados)
- **Backend/DB:** Supabase (Postgres + Auth + Realtime)
- **Routing:** React Router
- **Drag & drop:** @dnd-kit/core
- **Gestor de paquetes:** bun

## 3. Principios de arquitectura

1. **Row Level Security siempre activo.** Ninguna tabla en Supabase se crea
   sin políticas RLS. No se confía en la validación del cliente para
   seguridad de datos.
2. **El cliente de Supabase vive en `src/lib/supabaseClient.js`.** Ningún
   componente instancia su propio cliente.
3. **Separación por capas:**
   - `components/` → UI reutilizable, sin lógica de negocio pesada
   - `hooks/` → lógica de datos y estado (ej. `useBoards`, `useAuth`)
   - `pages/` → vistas que componen componentes + hooks
   - `lib/` → clientes externos y utilidades puras
4. **Estado del servidor vs estado local.** Los datos que vienen de Supabase
   se manejan con hooks dedicados (o React Query si se introduce más
   adelante); el estado puramente de UI (modales abiertos, drag en curso)
   vive en `useState` local.
5. **Optimistic UI donde tenga sentido** (ej. mover una tarjeta), pero
   siempre reconciliando con la respuesta real de Supabase.

## 4. Estándares de código

- Componentes funcionales con hooks, sin clases.
- Nombres de archivos de componentes en PascalCase (`BoardView.jsx`).
- Nombres de hooks con prefijo `use` (`useBoards.js`).
- Variables de entorno con prefijo `VITE_` y nunca commiteadas
  (`.env` en `.gitignore`).
- Sin `console.log` en código que se mergea a la rama principal.

## 5. Definición de "hecho" (Definition of Done)

Una feature se considera completa cuando:

1. Funciona en local contra Supabase real (no mocks).
2. Tiene políticas RLS correctas y probadas (un usuario no puede ver/editar
   datos de otro usuario sin permiso).
3. Es responsive (funciona en móvil y desktop).
4. No rompe features existentes.
5. Tiene manejo de estados de carga y error visibles para el usuario.

## 6. Fuera de alcance (por ahora)

- Aplicación móvil nativa.
- Internacionalización (i18n).
- Modo offline.

## 7. Versionado de esta constitución

- **v1.0.0** — versión inicial.