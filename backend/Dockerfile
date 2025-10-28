# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of backend code
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["npm", "start"]
