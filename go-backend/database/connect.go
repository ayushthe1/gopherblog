package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ayushthe1/blog-backend/models"
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
		panic("Could not connect to the database")
	} else {
		log.Println("connect successfully")
	}
	DB = database
	database.AutoMigrate(
		&models.User{},
		&models.Blog{},
		&models.Comment{},
	)

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("Error connecting to Redis:", err)
		return
	}
	fmt.Println("Successfully connected to Redis:", pong)

	RedisClient = rdb

}
