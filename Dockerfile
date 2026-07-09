# ---- Build stage ----
FROM node:24-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

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
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc prisma.config.ts ./

RUN pnpm install --frozen-lockfile

# Copy built output from build stage
COPY --from=build /app/.output .output

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "run", "start"]
