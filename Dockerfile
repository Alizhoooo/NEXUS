FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip prepare scripts for production)
RUN npm install --omit=dev --ignore-scripts

# Copy prisma and generate client
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copy application
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/index.js"]