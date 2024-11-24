# Use a lightweight Node.js image
FROM node:alpine AS development

# Set the environment to development
ENV NODE_ENV development

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the default React port (3000)
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
