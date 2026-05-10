FROM node:20-bookworm

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
    libssl3 \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm install

# Copy prisma and generate client
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copy application
COPY . .

# Build frontend
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/index.js"]