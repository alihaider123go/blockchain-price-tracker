# Use Node.js 20.11.1 base image
FROM node:20.11.1-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .
COPY .env .env
# Generate Prisma Client code
RUN npx prisma generate

EXPOSE 3300

# Command to run the app
CMD ["npm", "run", "start:migrate:dev"]