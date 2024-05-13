package controller

import (
	"log"
	"net/http"
	"net/url"

	rabbit "github.com/ayushthe1/blog-backend/rabbitmq"
	util "github.com/ayushthe1/blog-backend/utils"
	"github.com/gofiber/fiber/v2"
)

type Email struct {
	From      string
	To        string
	Subject   string
	Plaintext string
	HTML      string
}

// #QWER
func ProcessForgotPassword(c *fiber.Ctx) error {

	var data struct {
		Email string `json:"email" validate:"required"`
	}

	if err := c.BodyParser(&data); err != nil {
		log.Println("Unable to parse body in forgetPasswordController")
		log.Println(err.Error())
		return err
	}

	validationErr := validate.Struct(data)
	if validationErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error in validation fpC": validationErr.Error()})

	}
	log.Println("validation in PFP done successfully")

	// using the password reset util to create a new password reset token
	pwReset, err := util.CreatePasswordReset(data.Email)
	if err != nil {
		c.Status(501)
		return c.JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	log.Println(" CreatePasswordReset function called successfully")
	log.Println("pwReset : ", pwReset)

	vals := url.Values{
		"token": {pwReset.Token},
	}

	// encode the token in url (CHANGE THE URL LATER IN PROD)
	resetURL := "https://ayushsharma.co.in/reset-pw?" + vals.Encode()

	// DELEGATE THIS TO RABBITMQ
	// send the mail to the user with the reset_url
	// err = util.ForgotPassword(data.Email, resetURL)
	// if err != nil {
	// 	log.Println(err)
	// 	c.Status(501)
	// 	return c.JSON(fiber.Map{
	// 		"error in util.ForgotPassword ": err.Error(),
	// 	})
	// }

	err = rabbit.PublishToQueue(data.Email, resetURL)
	if err != nil {
		msg := "Error : Publishing email & resetURL to queue"
		log.Println(msg)
		return err
	}

	log.Println("** PROCESSFORGOTPASSWORD (AND SO PUBLISHING TO QUEUE) EXECUTED SUCESSFULLY **")

	c.Status(200)
	return c.JSON(fiber.Map{
		"msg": "Password reset email was sent successfully",
	})
}

// #koko
// handler to process the password reset form (it will already have the token in it)
func ProcessResetPassword(c *fiber.Ctx) error {

	var data struct {
		Token string `json:"token" validate:"required"`
		// user's new password they want to update
		Password string `json:"password" validate:"required"`
	}

	if err := c.BodyParser(&data); err != nil {
		log.Println("Unable to parse body in ProcessResetPassword")
		log.Println(err.Error())
		c.Status(http.StatusBadRequest)
		return c.JSON(fiber.Map{
			"error": "Unable to parse body in ProcessResetPassword",
		})
	}

	validationErr := validate.Struct(data)
	if validationErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error in validation in ProcessResetPassword": validationErr.Error()})

	}

	log.Println("Token and new password is : ", data)

	user, err := util.ConsumeToken(data.Token)
	if err != nil {
		log.Println("Error consume token")
		c.Status(http.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// update the password with new password
	err = util.UpdatePassword(user.Id, data.Password)
	if err != nil {
		log.Println("error while updating password")
		c.Status(http.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"error while updating password": err.Error(),
		})
	}

	log.Println("*******PASSWORD SUCCESSFULLY UPDATED********")

	c.Status(200)
	return c.JSON(fiber.Map{
		"Success": "Password Updated successfully",
	})

}
