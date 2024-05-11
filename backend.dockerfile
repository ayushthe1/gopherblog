FROM golang:1.18-alpine as builder 
WORKDIR /app
COPY ./go-backend/go.mod ./go-backend/go.sum ./
RUN go mod download
COPY ./go-backend .
RUN go build
CMD ["./blog-backend"]