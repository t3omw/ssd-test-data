# STAGE 1: Build the React App
# use nodejs & mini linux distribution
FROM node:18-alpine as build-stage
# set home base inside container
WORKDIR /app
COPY package*.json ./
# compile react code
RUN npm install
COPY . .
# compile react code
RUN npm run build

# STAGE 2: Production "Ghost" Image
# get rid off nodejs and switch to nginx
# nodejs is used to build code only, it is not needed to run the site
# Reduces size from 773MB to ~25MB
FROM nginx:alpine
# Copy build output to Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html
# tell docker container will listen on port 80
EXPOSE 80
# start nginx
CMD ["nginx", "-g", "daemon off;"]