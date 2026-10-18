# Base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy packages
COPY packages/database ./packages/database

# Copy API app
COPY apps/api ./apps/api

# Install dependencies (ignoring scripts initially)
RUN npm ci --ignore-scripts

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the API
RUN npm run build --workspace=api

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose port
EXPOSE 4000

# Non-root user
USER node

# Start server
CMD ["node", "apps/api/dist/main"]
