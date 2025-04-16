# Use a modern LTS Node.js version
FROM node:18-slim as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and lock file first for better caching
COPY package*.json tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN cd server && \
    npm ci && \
    npx tsc -p tsconfig.prod.json

# Generate a build manifest
RUN buildDateTime=$(date +%s) && \
    echo "{\"name\": \"Qdoc\", \"buildDateTime\": \"${buildDateTime}\"}" > manifest.json

# Run the build process and move necessary files
RUN npm run build && \
    mkdir -p dist/env && \
    cp -R build dist/

# Install production dependencies only
RUN cp manifest.json server/package*.json ./dist/ && \
    cd ./dist && npm ci --omit=dev

# Set ownership
RUN chown -R node /usr/src/app

# Use a lighter final image
FROM node:18-slim as final

# Set working directory
WORKDIR /usr/src/app

# Copy the built application
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/start_server.sh ./start_server.sh

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["./start_server.sh"]
