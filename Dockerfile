# Multi-stage build for AWS Cost Dashboard
# Stage 1: Build React frontend
FROM node:18-alpine AS client-builder
WORKDIR /app/App

# Copy App package files
COPY App/package*.json ./

# Install App dependencies
RUN npm ci --legacy-peer-deps

# Copy App source
COPY App/ ./

# Build production bundle
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install server dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server code
COPY App/server/ ./server/

# Copy built React app from builder stage
COPY --from=client-builder /app/App/build ./App/build

# Note: server code is at ./server/ (copied from App/server/)
# React build is at ./App/build/ (copied from builder stage)

# Create non-root user for security (use 10001 to avoid conflict with base image UID 1000)
RUN addgroup -g 10001 appuser && \
    adduser -D -u 10001 -G appuser appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3001

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/index.js"]

