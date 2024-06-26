package main

import (
	"fmt"
	"log"
	"os"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	database.Connect()
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env files")
	}
	port := os.Getenv("PORT")
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://gopherblog.ayushsharma.co.in, https://api.ayushsharma.co.in, http://localhost:4000 ",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	routes.Setup(app)
	fmt.Println("Server listening on port", port)
	app.Listen(":" + port)
}
