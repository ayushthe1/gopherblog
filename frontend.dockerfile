# Stage 1: Build the frontend
FROM node:alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY ./react-frontend/package.json ./react-frontend/package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application source code
COPY ./react-frontend .

# Build the frontend
RUN npm run build

# Stage 2: Create the final lightweight image
FROM node:alpine

WORKDIR /app

# Copy the built frontend from the previous stage
COPY --from=builder /app/build /app/build

# Install serve globally
RUN npm install -g serve --force

# Expose port 4000 (optional, depending on your requirements)
EXPOSE 4000

# Run serve to serve the built frontend
CMD ["serve", "-s", "build", "-l", "4000"]
