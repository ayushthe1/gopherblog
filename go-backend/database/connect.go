package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ayushthe1/blog-backend/models"
	rabbit "github.com/ayushthe1/blog-backend/rabbitmq"
	"github.com/joho/godotenv"
	redis "github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var RedisClient *redis.Client

func Connect() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error load .env file")
	}
	dsn := os.Getenv("DSN")

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("***********************FAIL******************* ")
		panic("Could not connect to the database")
	} else {
		log.Println("connect to mysql successfully")
	}

	log.Println("***********************CONNECTED TO MYSQL DATABASE******************* ")
	DB = database
	database.AutoMigrate(
		&models.User{},
		&models.Blog{},
		&models.Comment{},
		&models.PasswordReset{},
	)

	redisAddress := os.Getenv("REDIS_ADDRESS")
	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err = rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("Error connecting to Redis:", err)
		return
	}
	log.Println("***********************CONNECTED TO REDIS********************* ")

	RedisClient = rdb

	// Declare a queue in RabitMQ
	rabbitMQConnection := rabbit.Connect()
	defer rabbitMQConnection.Close()

	channelRabbitMQ, err := rabbitMQConnection.Channel()
	if err != nil {
		log.Println("Error opening a channel in RabbitMq :", err.Error())
		return
	}

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
		log.Println("Error Declaring Queue in RabbitMq :", err.Error())
		return
	}
	log.Println("************DECLARED A QUEUE IN RABBITMQ****************")

}
