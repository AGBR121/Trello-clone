# Spec 009: Dockerización

## Estado
Completada ✅

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
   de Supabase al momento de construir la imagen.
4. **Como desarrollador**, quiero que las rutas de React Router
   funcionen correctamente dentro del contenedor.
5. **Como desarrollador**, quiero un `docker-compose.yml` simple para
   levantar el contenedor con un solo comando.

## Fuera de alcance para esta spec
- Dockerizar Supabase (servicio externo gestionado).
- Orquestación multi-contenedor compleja.
- CI/CD automatizado para construir/publicar la imagen.

## Criterios de aceptación

- [x] `docker build` genera una imagen funcional del frontend.
- [x] La imagen final no incluye código fuente sin compilar ni
      dependencias de desarrollo (build multi-stage).
- [x] Las variables de Supabase se pasan como build args, documentado
      claramente en el README.
- [x] Navegar directo a una ruta como `/dashboard` dentro del
      contenedor funciona sin dar 404.
- [x] `docker-compose up` levanta el contenedor y la app es accesible
      en el navegador.

## Decisión técnica
Nginx (imagen `nginx:alpine`) como servidor de archivos estáticos en la
etapa final del build multi-stage, por ser liviano y el estándar para
servir SPAs. Ver `plan.md` para el detalle sobre variables de entorno
de Vite en build time.