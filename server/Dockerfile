# Use a standard Node.js image
FROM node:20-slim

# Create and define the working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Cloud Run expects the app to listen on the PORT environment variable
# We default to 5000 but it will be overridden by the runtime
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the server
CMD [ "npm", "start" ]
