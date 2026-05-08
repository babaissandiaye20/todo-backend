# syntax=docker/dockerfile:1.7

###############################################################################
# Stage 1 — builder: install all deps, generate Prisma client, compile TS
###############################################################################
FROM node:20-alpine AS builder

# OpenSSL is required by the Prisma engine binary on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy manifest + Prisma schema first to maximize Docker layer cache.
# `npm ci` will be re-run only when one of these files changes.
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (dev + prod) needed for the build
RUN npm ci --no-audit --no-fund

# Generate the Prisma client (creates the typed client + engine binaries)
RUN npx prisma generate

# Copy build configuration and source code
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# Compile TypeScript -> dist/
RUN npm run build


###############################################################################
# Stage 2 — runner: minimal production image
###############################################################################
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000

# Create a non-root user (security: never run app as root)
RUN addgroup -S nestjs && adduser -S -G nestjs nestjs

# Install ONLY production dependencies (prisma CLI is in dependencies for `migrate deploy`)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy the generated Prisma client from the builder
# (engine binaries live under @prisma/client and .prisma)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled application + Prisma schema/migrations (needed by migrate deploy)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Drop privileges
RUN chown -R nestjs:nestjs /app
USER nestjs

EXPOSE 4000

# Apply pending migrations, then launch the app.
# `prisma migrate deploy` is idempotent and non-interactive — safe to run on every boot.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
