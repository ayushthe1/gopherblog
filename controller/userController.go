package controller

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/models"
	util "github.com/ayushthe1/blog-backend/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

func RedisTest(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	key := c.Query("key")

	val, err := database.RedisClient.Get(ctx, key).Result()
	if err != nil {
		c.Status(400)
		log.Println("err in redis", err.Error())
		return c.JSON(fiber.Map{
			"message": "Error in redis while getting key",
		})
	}

	return c.JSON(fiber.Map{
		"message from redis": val,
	})

}

func Signup(c *fiber.Ctx) error {

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

	token, _ := util.GenerateJwt(strconv.Itoa(int(user.Id)))

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"user":    user, // remove this later
		"message": "Account created successfully",
	})
	// c.Redirect("/api/allpost", http.StatusOK)

}

func Login(c *fiber.Ctx) error {
	var data models.User

	log.Println("Inside login")

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Unable to parse body")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": err.Error()})
	}

	// validationErr := validate.Struct(data)
	// if validationErr != nil {
	// 	c.Status(fiber.StatusBadRequest)
	// 	return c.JSON(fiber.Map{"error": validationErr.Error()})

	// }

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

func Logout(c *fiber.Ctx) error {
	c.ClearCookie("jwt")
	log.Println("logged out")
	return c.Redirect("http://localhost:4000/register", http.StatusOK)

}
