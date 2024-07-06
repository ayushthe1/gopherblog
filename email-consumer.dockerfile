FROM golang:1.18-alpine as builder 
WORKDIR /app
COPY ./email-consumer/go.mod ./email-consumer/go.sum ./
RUN go mod download
COPY ./email-consumer .
RUN go build -o email-consumer
CMD ["./email-consumer"]