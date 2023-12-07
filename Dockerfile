# Dockerfile that creates instructures for the Docker enginue to build the image for my fragments mircoservice

# Stage 0: Install the base dependencies (Alpine Linux + Node)
# Specifices the explicit base image.
FROM node:18-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 AS dependencies

# Metadata about the image
LABEL maintainer="J.P. Ostiano <jostiano1@myseneca.ca>" \ 
      description="Fragments node.js mircoservice"

#Environment Variables:
# When run code in a production way
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into working directory
COPY package.json package-lock.json ./

# Copy all files into /app dir and change the ownership to the user node
COPY --chown=node:node . /app/

# Install depdencies, but the exact versions of the dependencies only
RUN npm ci --only=production && \
    npm uninstall sharp && \
    npm install --os=linuxmus1 --cpu=x64 sharp

# Copy src to /app/src/
COPY ./src ./src
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

############################################################
# Stage 1: Build and run the server
FROM node:18-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 AS production

# We default to use port 8080 in our service
ENV PORT=8080

# Use /app as our working directory
WORKDIR /app

# Copy the dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app
# Copy the source code into the image
# COPY . .
# Copy src to /app/src/
COPY ./src ./src

# Defining Health Check
HEALTHCHECK --interval=15s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:${PORT} || exit 1

USER node

# Start the container by running our code:
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080
############################################################
