FROM node:alpine AS development

# Set the environment to development
ENV NODE_ENV development

# Create and set the working directory inside the container
WORKDIR /SYMPly_Care_React/symply_care

# Copy package.json and package-lock.json into the working directory
COPY ./SYMPly_Care_React/package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire application directory into the container
COPY ./SYMPly_Care_React .

# Start the React app
CMD ["npm", "start"]
