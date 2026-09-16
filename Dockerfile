# ---- Etapa 1: build ----
FROM oven/bun:1 AS build
WORKDIR /app

# Copiar solo los manifiestos primero para aprovechar el cache de capas
# de Docker: si package.json no cambia, no se reinstalan dependencias.
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Vite inyecta estas variables en el bundle DURANTE el build, no en
# tiempo de ejecución. Deben pasarse como --build-arg al construir la
# imagen (ver README para el comando completo).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN bun run build

# ---- Etapa 2: producción ----
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
