# Use the official Node.js image as the base image
FROM node:20.11.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your application is running on
EXPOSE 3000

# Command to run the application
CMD ["node", "src/index.js"]
