FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire client application
COPY . .

# Expose Vite port
EXPOSE 5173

# Run Vite in dev mode with host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
