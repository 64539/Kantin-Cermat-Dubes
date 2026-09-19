# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json, package-lock.json, and Prisma schema
COPY package*.json ./
COPY prisma ./prisma

# Install only production dependencies
RUN npm install --omit=dev

# Generate Prisma client for production (ensures binary compatibility in the final image)
RUN npx prisma generate

# Copy the compiled application code from the builder stage
COPY --from=builder /app/dist ./dist

# Create a directory for uploads and ensure proper permissions
RUN mkdir -p uploads && chown -R node:node uploads

# Expose the application port
EXPOSE 3000

# Run the application as non-root user
USER node

# Start the application
CMD ["npm", "run", "start:prod"]
