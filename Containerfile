# Use the official Node.js image as the base
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /complexity-ai

# Copy the pnpm-lock.yaml and package.json to install dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js app
RUN pnpm build

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["pnpm", "start"]
