# Starting with the official Node.js LTS (Long Term Support) image as it's stable and recommended for most users.
FROM node:lts

# Setting up the working directory in the container for the conversation service.
WORKDIR /app/conversation-service

# Copy package.json and package-lock.json into our working directory.
COPY ./package.json ./package-lock.json ./

# Install the necessary node modules.
RUN npm ci

# Copying only the necessary files for conversation-Service from our service directory into the container. 
COPY ./models ./models
COPY ./routes ./routes
COPY ./server-ConversationService.js ./

# As mentioned previously, we won't copy "privateValues.env" into our Docker image for security reasons. 
# Instead, the values will be passed at runtime.

# This CMD specifies the default command to run when starting a container from this image.
CMD ["node", "./server-ConversationService.js"]
