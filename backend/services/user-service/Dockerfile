# Starting with the official Node.js LTS (Long Term Support) image as it's stable and recommended for most users.
FROM node:lts

# Setting up the working directory in the container. This is where our application code will live inside the container.
WORKDIR /app/user-service

# Copy package.json and package-lock.json into our working directory.
# The package-lock.json ensures that the exact versions of dependencies specified in it are installed, leading to consistent builds.
COPY ./package.json ./package-lock.json ./

# Install the necessary node modules. We install both dependencies and devDependencies because nodemon 
# (a devDependency) might be used to start the service, as seen in package.json.
RUN npm ci

# Copying only the necessary files for user-Service from our service directory into the container. 
# This helps in reducing the container's footprint.
COPY ./models ./models
COPY ./routes ./routes
COPY ./server-UserService.js ./


# This CMD specifies the default command to run when starting a container from this image.
CMD ["node", "./server-UserService.js"]
