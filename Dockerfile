# Stage 1: Build the frontend
FROM node:16-alpine as frontend-builder

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the backend
FROM node:16-alpine as backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend .
RUN npm run build

# Stage 3: Final image
FROM node:16-alpine

WORKDIR /app

# Copy the built frontend and backend to the final image
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=backend-builder /app/backend/dist /app/backend/dist
COPY --from=backend-builder /app/backend/package*.json /app/backend/

# Install backend dependencies
RUN cd /app/backend && npm install --only=production

# Expose the port your app runs on
EXPOSE 3000

# Run the backend server
CMD ["node", "backend/dist/server.js"]
