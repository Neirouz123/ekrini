# Multi-stage Dockerfile for service-maintenance

# Development stage
FROM node:18-alpine AS dev
WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm ci

# Copy shared utilities if needed
COPY ../../backend/shared/ ./shared/

# Copy service-specific files
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Expose service port
EXPOSE 3007

# Default dev command
CMD ["nodemon", "src/app.js"]

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy shared utilities and service files
COPY ../../backend/shared/ ./shared/
COPY . .

# Fix ownership and switch to non-root
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3007

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3007/health', (res) => { if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } }).on('error', () => { process.exit(1); });"

CMD ["node", "src/app.js"]
