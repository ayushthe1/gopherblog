package controller

import (
	"fmt"
	"log"
	"math/rand"

	"github.com/ayushthe1/blog-backend/models"
	"github.com/gofiber/fiber/v2"
)

var letters = []rune("abcdefghijklmnopqrsuvwxyz")

func randLetter(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func Upload(c *fiber.Ctx) error {
	log.Println("Inside Upload")
	form, err := c.MultipartForm()
	if err != nil {
		log.Println("error while mulyipartfomr", err.Error())
		return err
	}

	var blogpost models.Blog
	if err := c.BodyParser(&blogpost); err != nil {
		fmt.Println("Unable to parse body in Upload")
		return err
	}

	log.Println("blog struct is :", blogpost.Desc, blogpost.Title, blogpost.UserID)

	files := form.File["image"]
	fileName := ""

	// userid := c.Params("userid")
	// log.Println(userid)

	for _, file := range files {

		fileName = randLetter(5) + "-" + file.Filename
		if err := c.SaveFile(file, "./uploads/"+fileName); err != nil {
			log.Println("error while saving image :", err.Error())
			return err
		}
	}

	log.Println("File successfully created")
	return c.JSON(fiber.Map{
		"url": "http://localhost:3000/api/uploads/" + fileName,
	})

}
