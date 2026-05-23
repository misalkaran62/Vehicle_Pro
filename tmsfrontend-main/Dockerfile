# Stage 1: Build Angular Application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Angular project files to the container
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production --project tms

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine

# Copy the built Angular app from the builder stage to the Nginx default public directory
COPY --from=builder /app/dist/tms /usr/share/nginx/html

# Expose port 80 for the server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
