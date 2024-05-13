package rabbit

import (
	"log"
	"os"

	"github.com/streadway/amqp"
)

var RabbitMQConnection *amqp.Connection

func Connect() *amqp.Connection {
	amqpServerURL := os.Getenv("AMQP_SERVER_URL")

	// Create a new RabbitMQ connection.
	connectRabbitMQ, err := amqp.Dial(amqpServerURL)
	if err != nil {
		panic(err)
	}
	// defer connectRabbitMQ.Close()

	RabbitMQConnection = connectRabbitMQ
	return RabbitMQConnection

}

func PublishToQueue(email string, resetURL string) error {

	combinedMessage := email + "\n" + resetURL

	rabbitMQConnection := Connect()
	defer rabbitMQConnection.Close()

	channelRabbitMQ, err := rabbitMQConnection.Channel()
	if err != nil {
		return err
	}
	log.Println("CONNECTED TO RABBITMQ IN rabbit.go file in backend")
	defer channelRabbitMQ.Close()

	_, err = channelRabbitMQ.QueueDeclare(
		"QueueService1", // queue name
		true,            // durable
		false,           // auto delete
		false,           // exclusive
		false,           // no wait
		nil,             // arguments
	)

	if err != nil {
		return err
	}

	log.Println("Successfully declared queue in go-backend")

	// Create a message to publish.
	message := amqp.Publishing{
		ContentType: "text/plain",
		Body:        []byte(combinedMessage),
	}

	// Attempt to publish a message to the queue.
	if err := channelRabbitMQ.Publish(
		"",              // exchange
		"QueueService1", // queue name
		false,           // mandatory
		false,           // immediate
		message,         // message to publish
	); err != nil {
		return err
	}

	log.Println("**SUCCESSFULLY PUBLISHED MSG TO QUEUE IN go-backend.go")

	return nil
}
