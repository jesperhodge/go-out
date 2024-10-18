# Use a base image with Node.js installed
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the pnpm-lock.yaml from the parent directory
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json and pnpm-workspace.yaml from the current directory
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

RUN pnpm run prisma:generate
# Build the NestJS application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["pnpm", "run", "start:prod"]