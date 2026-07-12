# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Mock credentials for build-time type verification only
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/jkosi
ENV PAYLOAD_SECRET=docker_build_secret_key_mock

RUN npm run build

# Stage 3: Production Runner (Standalone, Secure Non-Root User)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create a secure non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js public assets and static files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Next.js standalone output (includes pruned runtime node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Explicitly copy configuration and collections.
# This prevents runtime path resolution crashes since Payload CMS reads these dynamically.
COPY --from=builder --chown=nextjs:nodejs /app/payload.config.ts ./payload.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/collections ./src/collections
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations

# Switch to the non-root user for security
USER nextjs

EXPOSE 3000

# Start the standalone Next.js server. 
# Database migrations run automatically on start via `prodMigrations: migrations` in payload.config.ts.
CMD ["node", "server.js"]
