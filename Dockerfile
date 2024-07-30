# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remixuser

# Copy built assets from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Change to non-root user
USER remixuser

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthcheck || exit 1

# Start the application
CMD ["bun", "run", "start"]
