# Using a Node.js image to build a React app
FROM node:lts AS build-stage

# Set up the working directory for the React app
WORKDIR /app/frontend

# Copy the package.json and package-lock.json files
COPY ./package.json ./package-lock.json ./

# Install the node modules
RUN npm ci

# Copy the rest of the frontend code
COPY ./public ./public
COPY ./src ./src

# Build the React app
RUN npm run build

# Using an NGINX image to serve the React app
FROM nginx:alpine

# Copy the custom nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app to the NGINX html directory
COPY --from=build-stage /app/frontend/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
