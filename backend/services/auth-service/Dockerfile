# Using the official Node.js LTS (Long Term Support) image because it is stable and recommended for most users.
FROM node:lts

# Setting the working directory in the container to /app/auth-service. This is where our application code will reside inside the container.
WORKDIR /app/auth-service

# --- Extracted from the folders/files structure ---
# Copying package.json and package-lock.json into our working directory.
# The package-lock.json file ensures that the exact versions of dependencies specified in it are installed, leading to consistent builds.
COPY ./package.json ./package-lock.json ./

# --- Extracted from the package.json file ---
# Installing the necessary node modules. Both dependencies and devDependencies are installed because nodemon,
# (a devDependency) is used to start the service, as specified in the package.json file.
RUN npm ci

# --- Extracted from the folders/files structure ---
# Copying only the necessary files for auth-service from our service directory into the container.
# This minimizes the container's size.
COPY ./models ./models
COPY ./routes ./routes
COPY ./validation ./validation
COPY ./server-AuthService.js ./


# The CMD directive specifies the default command to run when starting a container from this image.
# --- Extracted from the package.json file ---
# Based on the package.json file, the script to start the auth-service is "start-auth-service".
CMD ["node", "./server-AuthService.js"]
