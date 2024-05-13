package routes

import (
	"github.com/ayushthe1/blog-backend/controller"
	"github.com/ayushthe1/blog-backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/api/register", controller.Signup)
	app.Post("/api/login", controller.Login)
	app.Get("/api/allpost", controller.AllPost)
	app.Get("/api/allpost/:id", controller.DetailPost)
	app.Get("/api/comments/:id", controller.GetAllComments)
	app.Post("/api/comments", controller.CreateComment) // Allow unsigned users to also post as anonymous

	// app.Get("/rabbitmq", controller.TestRabbitMQ)

	app.Post("/api/forget-pw", controller.ProcessForgotPassword)
	app.Post("/api/reset-pw", controller.ProcessResetPassword)

	app.Static("/api/uploads", "./uploads")
	app.Get("/redistest", controller.RedisTest) // for testing, remove later

	// Authenticated Routes
	app.Use(middleware.IsAuthenticate)
	app.Post("/api/post", controller.CreatePost)
	app.Put("/api/updatepost/:id", controller.UpdatePost)
	app.Get("/api/uniquepost", controller.UniquePost)
	app.Delete("/api/deletepost/:id", controller.DeletePost)
	app.Post("/api/upload-image", controller.Upload)
	app.Post("/api/logout", controller.Logout)

}
