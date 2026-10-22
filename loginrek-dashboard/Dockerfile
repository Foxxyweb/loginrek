# syntax=docker/dockerfile:1.7
# =============================================================================
# loginrek-dashboard — AdonisJS (API + Dashboard Inertia React)
# Image dibangun di GitHub Actions lalu di-push ke GHCR. VPS hanya pull.
# =============================================================================

ARG NODE_VERSION=24-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /app

# ---- Semua dependency (untuk build) ----------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- Build: compile TS + bundle Vite --------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

# ---- Dependency production saja -------------------------------------------
FROM base AS prod-deps
COPY --from=build /app/build/package.json /app/build/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# ---- Runtime ---------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333 \
    TZ=UTC

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/build ./

USER node
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3333/health >/dev/null || exit 1

CMD ["node", "bin/server.js"]
