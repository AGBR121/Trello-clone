# Spec 002: Modo oscuro

## Estado
Implementación completa, pendiente de prueba final (T7)

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

## Fuera de alcance para esta spec
- Temas personalizados más allá de claro/oscuro (ej. temas de color).
- Sincronizar la preferencia entre dispositivos vía Supabase (se queda en
  `localStorage` local por ahora).

## Criterios de aceptación

- [ ] Existe un botón/toggle de tema accesible desde cualquier pantalla.
- [ ] El tema elegido persiste tras recargar la página.
- [ ] Sin preferencia guardada, se usa `prefers-color-scheme` del sistema.
- [ ] Login, Dashboard y BoardView tienen estilos `dark:` completos, sin
      texto ilegible o fondos que rompan el contraste.

## Decisión técnica
Tailwind v4 usa `prefers-color-scheme` por defecto para `dark:`. Para
permitir un toggle manual controlado por el usuario, se define un
custom variant basado en clase (`.dark` en `<html>`), y un hook
`useTheme` que la controla y persiste en `localStorage`.