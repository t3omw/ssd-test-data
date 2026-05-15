# Use Node image to build and run the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Start the app
CMD ["npm", "start"]