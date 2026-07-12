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

# Prune devDependencies to keep the runner stage lightweight
RUN npm prune --omit=dev


# Stage 3: Lightweight production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Runtime assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Payload CMS needs these at runtime to resolve collections and config
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/src/collections ./src/collections

EXPOSE 3000

CMD ["npm", "run", "start"]
