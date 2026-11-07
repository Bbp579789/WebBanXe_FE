FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build the Vite app (will use .env present)
RUN bun run build

# Serve the app
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist
RUN bun add -g serve

# Open both possible ports
EXPOSE 5173

CMD ["sh", "-c", "serve -s dist -l 5173"]