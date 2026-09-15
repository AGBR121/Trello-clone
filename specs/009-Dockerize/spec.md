# Spec 009: Dockerización

## Estado
Borrador

## Contexto
El proyecto es una SPA de React/Vite que se conecta a Supabase (backend
externo, gestionado, no se dockeriza). Dockerizar aquí significa
empaquetar el **build de producción del frontend** en una imagen que
sirva los archivos estáticos, para poder correrlo de forma reproducible
en cualquier máquina o desplegarlo en cualquier plataforma que acepte
contenedores.

## Qué queremos

1. **Como desarrollador**, quiero poder construir una imagen Docker del
   frontend con un solo comando.
2. **Como desarrollador**, quiero que la imagen final sea liviana (no
   incluir `node_modules` de desarrollo, herramientas de build, etc. en
   la imagen que corre en producción).
3. **Como desarrollador**, quiero poder pasar las variables de entorno
   de Supabase al momento de construir la imagen (ya que Vite las
   inyecta en tiempo de build, no de ejecución).
4. **Como desarrollador**, quiero que las rutas de React Router
   funcionen correctamente dentro del contenedor (recargar `/dashboard`
   no debe dar 404).
5. **Como desarrollador**, quiero un `docker-compose.yml` simple para
   levantar el contenedor con un solo comando en desarrollo/demo local.

## Fuera de alcance para esta spec
- Dockerizar Supabase (es un servicio externo gestionado, no aplica).
- Orquestación multi-contenedor compleja (no hay backend propio que
  dockerizar en este proyecto).
- CI/CD automatizado para construir/publicar la imagen (queda como
  posible spec futura).

## Criterios de aceptación

- [ ] `docker build` genera una imagen funcional del frontend.
- [ ] La imagen final no incluye código fuente sin compilar ni
      dependencias de desarrollo (build multi-stage).
- [ ] Las variables de Supabase se pasan como build args, documentado
      claramente en el README.
- [ ] Navegar directo a una ruta como `/dashboard` dentro del
      contenedor (no solo `/`) funciona sin dar 404.
- [ ] `docker-compose up` levanta el contenedor y la app es accesible
      en el navegador.

## Preguntas abiertas
- ¿Servidor de archivos estáticos a usar dentro del contenedor? → Nginx,
  por ser el estándar más liviano y probado para servir SPAs.