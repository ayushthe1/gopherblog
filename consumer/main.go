package main

import (
	"log"
	"os"
	"strings"

	"github.com/ayushthe1/consumer/emailSender"
	"github.com/streadway/amqp"
)

func main() {

	amqpServerURL := os.Getenv("AMQP_SERVER_URL")

	// Create a new RabbitMQ connection.
	connectRabbitMQ, err := amqp.Dial(amqpServerURL)
	if err != nil {
		panic(err)

	}
	defer connectRabbitMQ.Close()

	channelRabbitMQ, err := connectRabbitMQ.Channel()
	if err != nil {
		panic(err)
	}
	defer channelRabbitMQ.Close()

	// Subscribing to QueueService1 for getting messages.
	messages, err := channelRabbitMQ.Consume(
		"QueueService1", // queue name
		"MeraConsumer",  // consumer
		true,            // auto-ack
		false,           // exclusive
		false,           // no local
		false,           // no wait
		nil,             // arguments
	)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("*********Successfully connected to RabbitMQ In Consumer********")
	log.Println("*********Waiting for messages******")

	// Make a channel to receive messages into infinite loop.
	forever := make(chan bool)

	go func() {
		log.Println("Inside Go routine")
		for message := range messages {
			// Split the received message body based on the delimiter
			parts := strings.Split(string(message.Body), "\n")
			if len(parts) != 2 {
				log.Println("Invalid message format received")
				continue
			}

			email := parts[0]
			resetURL := parts[1]

			log.Println(" >> Received email in consumer :", email)
			log.Println(" >> Received resetURL in consumer :", resetURL)

			err := emailSender.ForgotPassword(email, resetURL)
			if err != nil {
				log.Println("Error while sending mail in consumer")
			}

			log.Println("***SUCESSFULLY SENT THE PASSWORD RESET_URL TO MAIL")

		}
	}()

	<-forever

	log.Println("****RECAHED THE END OF CONSUMER MAIN.GO***")
}
