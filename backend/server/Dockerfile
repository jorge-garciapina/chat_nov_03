# Starting with the official Node.js LTS (Long Term Support) image as it's stable and recommended for most users.
FROM node:lts

# Define the working directory for our Apollo GraphQL server inside the container.
WORKDIR /app/server

# Copy the package.json and package-lock.json first to make use of Docker cache for npm install.
# This will help in faster builds when our server code changes but our dependencies do not.
COPY ./package.json ./package-lock.json ./

# Install the server dependencies.
RUN npm ci

# Copy the Apollo Server setup and related GraphQL files.
COPY ./serverGraphQL.js ./
COPY ./graphql ./graphql

# While the Apollo GraphQL server might require some environment variables (like DB connections, API keys, or connections to other services), 
# they shouldn't be hardcoded in the Dockerfile or embedded in the Docker image. 
# Instead, these values should be passed at runtime, preferably using tools like `docker-compose` or Kubernetes Secrets.

# Default command to start our Apollo GraphQL server.
CMD ["node", "./serverGraphQL.js"]
