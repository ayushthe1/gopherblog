# Stage 1: Build the Go binary
FROM golang:1.18-alpine as builder

WORKDIR /app

# Copy only the Go module files first to leverage Docker cache
COPY ./go-backend/go.mod ./go-backend/go.sum ./

# Download Go dependencies
RUN go mod download

# Copy the rest of the application source code
COPY ./go-backend .

# Copy the .env file
COPY ./go-backend/.env ./.env

# Build the Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/blog-backend

# Stage 2: Create the final lightweight image
FROM alpine:latest

WORKDIR /app

# Copy the built Go binary and .env file from the previous stage
COPY --from=builder /app/blog-backend /app/blog-backend
COPY --from=builder /app/.env /app/.env

RUN mkdir /app/uploads
# Run the Go binary
CMD ["/app/blog-backend"]
