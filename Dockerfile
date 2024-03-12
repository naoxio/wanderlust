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

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

# Stage 3: Final image
FROM node:16-alpine

WORKDIR /app

COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=backend-builder /app/backend/dist /app/backend/dist
COPY --from=backend-builder /app/backend/package*.json /app/backend/

RUN cd /app/backend && npm install --only=production

EXPOSE 3000

CMD ["node", "backend/dist/server.js"]
