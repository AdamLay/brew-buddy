# ---- Build stage ----
FROM node:24-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Use --ignore-scripts to skip the prisma engine build during install
# The binaries are downloaded at runtime by Prisma
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma client (downloads engines)
RUN npx prisma generate

# Build the app — outputs to .output/
RUN pnpm build

# ---- Production stage ----
FROM node:24-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/prisma prisma
COPY package.json pnpm-lock.yaml .npmrc prisma.config.ts ./

# Install deps without scripts (Prisma engines download at runtime)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy built output from build stage
COPY --from=build /app/.output .output

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "run", "start"]
