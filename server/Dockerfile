FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server application
COPY . .

# Expose server port (must match PORT in .env)
EXPOSE 3001

# Run with nodemon for development
CMD ["npm", "run", "dev"]
