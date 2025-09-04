# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json* pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN corepack enable || true
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and node_modules
COPY --from=builder /app ./

# Next.js production server
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start", "--", "-p", "8080"]
