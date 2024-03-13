# Stage 1: Build frontend
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build backend
FROM node:18 AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend ./
RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy

# Stage 3: Final image with Nginx
FROM nginx:stable-alpine
WORKDIR /app
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=backend /app/backend /app/backend
RUN apk add --update nodejs npm
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Install pm2 for managing Node.js processes
RUN npm install -g pm2

# Start Nginx and the backend server using pm2
CMD ["sh", "-c", "nginx && pm2-runtime start /app/backend/dist/index.js"]
