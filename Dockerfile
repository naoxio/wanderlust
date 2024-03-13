# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for the frontend
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy the frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy package.json and package-lock.json for the backend
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy the backend source code
COPY backend ./

# Generate Prisma client
RUN npx prisma generate

# Run database migrations
RUN npx prisma migrate deploy

# Use an official Nginx runtime as the base image
FROM nginx:stable-alpine

# Copy the frontend build files to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the backend build files to a directory in Nginx
COPY --from=build /app/backend /app/backend

# Install Node.js in the Nginx image
RUN apk add --update nodejs npm

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which Nginx will run
EXPOSE 80

# Start Nginx and the backend server
CMD ["sh", "-c", "nginx && cd /app/backend && node dist/index.js"]