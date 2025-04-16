FROM node:20.11.1

WORKDIR /qdoc

# Copy package files
COPY package*.json tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production

# Expose the port your app runs on
EXPOSE 8010

ENV NODE_ENV=production

RUN chmod +x ./scripts/start_server.sh

CMD ["./scripts/start_server.sh"]