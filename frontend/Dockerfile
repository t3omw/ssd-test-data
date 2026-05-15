# STAGE 1: Build the React App
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Production "Ghost" Image
# This reduces size from 773MB to ~25MB
FROM nginx:alpine
# Copy the build output to Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copy a custom nginx config if you have one, or use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]