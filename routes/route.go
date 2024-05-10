package routes

import (
	"github.com/ayushthe1/blog-backend/controller"
	"github.com/ayushthe1/blog-backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/api/register", controller.Signup)
	app.Post("/api/login", controller.Login)

	// display all posts on the home page for all users
	// app.Get("/api/")

	app.Use(middleware.IsAuthenticate)
	app.Post("/api/post", controller.CreatePost)
	app.Get("/api/allpost", controller.AllPost)
	app.Get("/api/allpost/:id", controller.DetailPost)
	app.Put("/api/updatepost/:id", controller.UpdatePost)
	app.Get("/api/uniquepost", controller.UniquePost)
	app.Delete("/api/deletepost/:id", controller.DeletePost)
	app.Post("/api/upload-image", controller.Upload)
	app.Post("/api/logout", controller.Logout)
	app.Static("/api/uploads", "./uploads")

}
