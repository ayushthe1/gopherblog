package controller

import (
	"log"
	"strconv"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/models"
	"github.com/gofiber/fiber/v2"
)

// Return all comments associated with a blog
func GetAllComments(c *fiber.Ctx) error {
	var comments []models.Comment

	blogid, _ := strconv.Atoi(c.Params("id"))
	log.Println("The blogID is :", blogid)

	// database.DB.Preload("Blog").Offset(-1).Limit(-1).Find(&comments)
	database.DB.Where("blog_id=?", blogid).Preload("Blog").Find(&comments)

	log.Println("Returning Comments")

	return c.JSON(fiber.Map{
		"data": comments,
	})

}

func CreateComment(c *fiber.Ctx) error {
	var commentPost models.Comment

	if err := c.BodyParser(&commentPost); err != nil {
		log.Println("Unable to parse body")
		return err
	}

	if err := database.DB.Create(&commentPost).Error; err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Invalid comment payload",
		})
	}

	log.Println("comment created successfully")
	return c.JSON(fiber.Map{
		"message": "Comment is live",
	})
}
