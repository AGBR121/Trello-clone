# Spec 002: Modo oscuro

## Estado
Completada ✅ (actualizada tras ajuste de paleta de color)

## Contexto
La app debe soportar tema claro/oscuro de forma global, controlable por el
usuario (no solo `prefers-color-scheme` del sistema), y persistente entre
sesiones.

## Qué queremos (user stories)

1. **Como usuario**, quiero poder alternar entre modo claro y oscuro con un
   botón visible en la interfaz.
2. **Como usuario**, quiero que mi preferencia se recuerde la próxima vez
   que entre a la app (persistencia en `localStorage`).
3. **Como usuario nuevo** (sin preferencia guardada), quiero que la app
   respete el tema de mi sistema operativo por defecto.
4. **Como usuario**, quiero que todas las pantallas (login, dashboard,
   tablero) se vean bien en ambos modos, sin contrastes rotos.
5. **Como usuario**, quiero que el modo oscuro use tonos de gris/negro
   neutros, sin matices de color (ej. sin el tinte azulado típico de
   paletas como "slate").

## Fuera de alcance para esta spec
- Temas personalizados más allá de claro/oscuro (ej. temas de color).
- Sincronizar la preferencia entre dispositivos vía Supabase (se queda en
  `localStorage` local por ahora).

## Criterios de aceptación

- [x] Existe un botón/toggle de tema accesible desde cualquier pantalla.
- [x] El tema elegido persiste tras recargar la página.
- [x] Sin preferencia guardada, se usa `prefers-color-scheme` del sistema.
- [x] Login, Dashboard y BoardView tienen estilos `dark:` completos, sin
      texto ilegible o fondos que rompan el contraste.
- [x] La paleta de grises en modo oscuro es neutra (`neutral` de
      Tailwind), sin tinte azulado.

## Decisión técnica
Tailwind v4 usa `prefers-color-scheme` por defecto para `dark:`. Para
permitir un toggle manual controlado por el usuario, se definió un
custom variant basado en clase (`.dark` en `<html>`), y un hook
`useTheme` que la controla y persiste en `localStorage`.

**Actualización posterior:** la paleta inicial usaba `slate` para todos
los fondos/bordes/textos en `dark:`, pero esa paleta tiene un tinte
azulado perceptible. Se migró toda clase `dark:*-slate-*` a
`dark:*-neutral-*` (gris verdadero, sin tinte de color) en todo el
proyecto. El modo claro conserva `slate` sin cambios — el ajuste fue
exclusivo del modo oscuro. Ver `.specify/memory/constitution.md` para
la regla permanente de qué paleta usar en adelante.