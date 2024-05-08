package controller

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

func Register(c *fiber.Ctx) error {

	var data models.User
	var userData models.User
	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Unable to parse bodyy")
		fmt.Println(err.Error())
		return err
	}

	validationErr := validate.Struct(data)
	if validationErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": validationErr.Error()})

	}

	//Check if email already exist in database
	database.DB.Where("email=?", strings.TrimSpace(data.Email)).First(&userData)
	if userData.Id != 0 {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Email already exist",
		})

	}

	user := models.User{
		FirstName: data.FirstName,
		LastName:  data.LastName,
		Phone:     data.Phone,
		Email:     strings.TrimSpace(data.Email),
	}
	user.SetPassword(data.Password)
	err := database.DB.Create(&user)
	if err != nil {
		log.Println(err)
	}
	c.Status(200)
	return c.JSON(fiber.Map{
		"user":    user, // remove this later
		"message": "Account created successfullys",
	})

}

func Login(c *fiber.Ctx) error {
	var data models.User

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Unable to parse body")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": err.Error()})
	}

	validationErr := validate.Struct(data)
	if validationErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": validationErr.Error()})

	}

	var user models.User
	database.DB.Where("email=?", data.Email).First(&user)
	if user.Id == 0 {
		c.Status(404)
		return c.JSON(fiber.Map{
			"message": "Email Address doesn't exit, kindly create an account",
		})
	}
	if err := user.ComparePassword(data.Password); err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	token, err := util.GenerateJwt(strconv.Itoa(int(user.Id)))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return nil
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "you have successfully login",
		"user":    user,
	})

}
