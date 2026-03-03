FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build engine types
RUN npm run build || true

EXPOSE 3001

# Production start
CMD ["node", "src/index.js"]
