# STAGE 1: Build the React App
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Production "Ghost" Image
# Reduces size from 773MB to ~25MB
FROM nginx:alpine
# Copy build output to Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]