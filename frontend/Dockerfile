FROM node:20-slim

WORKDIR /app

# Copy dependency configuration files first to optimize layer caching
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
