# Use an official Node.js runtime as the base image
FROM node:18

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

# Expose the port on which the backend server will run
EXPOSE 3000

# Expose the port on which the frontend will be served
EXPOSE 8080

# Set environment variables if required
# ENV DATABASE_URL=your-database-url

# Run database migrations
RUN npx prisma migrate deploy

# Install a lightweight web server globally
RUN npm install -g http-server

# Start the backend server and the frontend web server
CMD ["sh", "-c", "npm start & http-server ../dist -p 8080"]