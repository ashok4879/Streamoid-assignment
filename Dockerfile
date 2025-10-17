# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies inside container (Linux)
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose port
EXPOSE 8000

# Start the app
CMD ["node", "server.js"]
