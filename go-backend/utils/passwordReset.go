package util

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/models"
	"github.com/go-mail/mail/v2"
)

type Email struct {
	From      string
	To        string
	Subject   string
	Plaintext string
	HTML      string
}

type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

const (
	// DefaultSender is the default email address to send emails from.
	DefaultSender = "keshavkumarr07@gmail.com"
)

// #hexo
func CreatePasswordReset(email string) (*models.PasswordReset, error) {

	log.Println("Entered CreatePasswordReset")
	var userData models.User

	//Check if email already exist in database
	database.DB.Where("email=?", strings.TrimSpace(email)).First(&userData)
	if userData.Id == 0 {
		msg := "Email don't exists in PasswordResetService"
		return nil, fmt.Errorf(msg)

	}
	log.Println("Email Check in CreatePasswordReset done successfully")

	bytesPerToken := 32

	token, err := String(bytesPerToken)
	if err != nil {
		return nil, fmt.Errorf("create: %w", err)
	}

	// duration for which the password reset is valid for
	duration := 10 * time.Minute

	pwReset := new(models.PasswordReset)
	pwReset.UserID = int(userData.Id)
	pwReset.Token = token
	pwReset.Tokenhash = hash(token)
	pwReset.ExpiresAt = time.Now().Add(duration)

	dberr := database.DB.Create(&pwReset)
	if dberr.Error != nil {
		// Handle error from DB.Create()
		msg := "Error while creating pwReset in DB"
		log.Println(msg)
		return nil, fmt.Errorf("%s: %w", msg, dberr.Error)
	}

	log.Println("Create pwReset in CreatePasswordReset done successfully")
	log.Println("pwReset is : ", pwReset)

	return pwReset, nil

}

// Bytes generates and returns a slice of random bytes of length 'n'
func Bytes(n int) ([]byte, error) {
	b := make([]byte, n)
	nread, err := rand.Read(b) // generate random bytes and fill the slice b with them
	if err != nil {
		return nil, fmt.Errorf("bytes: %w", err)
	}
	if nread < n {
		return nil, fmt.Errorf("bytes: didn't read enough random bytes")
	}

	return b, nil
}

// string returns a random string using crypto/rand
// n is the number of bytes being used to generate random string
func String(n int) (string, error) {
	b, err := Bytes(n) // b is like [23,4,5,12,99,..nth]
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil // return something like 'Obfmp8X6dQ=='
}

// function for hashing the token
func hash(token string) string {
	tokenHash := sha256.Sum256([]byte(token))
	return base64.URLEncoding.EncodeToString(tokenHash[:])
}

// #sept
func ForgotPassword(to string, resetURL string) error {
	log.Println("Inside util.ForgetPassword")
	email := Email{
		Subject:   "Reset your password",
		To:        to,
		Plaintext: "To reset your password, please visit the following link: " + resetURL,
		HTML: `<p> To reset your password, please visit the 
		following link: <a href="` + resetURL + `">` + resetURL + `</a></p>`,
	}

	err := Send(email)
	if err != nil {
		return fmt.Errorf("forgot password email: %w", err)
	}

	return nil

}

// #tifo
func Send(email Email) error {

	log.Println("Inside util.Send")

	var config = SMTPConfig{
		Host:     os.Getenv("SMTP_HOST"),
		Username: os.Getenv("SMTP_USERNAME"),
		Password: os.Getenv("SMTP_PASSWORD"),
	}
	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr)
	config.Port = port

	log.Println("SMTP Config is : ", config.Host, " ", config.Username, " ", config.Password)

	msg := mail.NewMessage()
	msg.SetHeader("To", email.To)
	msg.SetHeader("Subject", email.Subject)
	msg.SetHeader("From", DefaultSender)

	switch {
	case email.Plaintext != "" && email.HTML != "":
		msg.SetBody("text/plain", email.Plaintext)
		msg.AddAlternative("text/html", email.HTML)
	case email.Plaintext != "":
		msg.SetBody("text/plain", email.Plaintext)
	case email.HTML != "":
		msg.SetBody("text/html", email.HTML)
	}

	dialer := mail.NewDialer(config.Host, config.Port, config.Username, config.Password)

	err = dialer.DialAndSend(msg)
	if err != nil {
		return fmt.Errorf("error in dialandsend: %w", err)
	}

	log.Println("***********PASSWORD RESET EMAIL SENT****************")
	return nil
}

// #mino
func ConsumeToken(token string) (*models.User, error) {
	tokenHash := hash(token)

	var user models.User
	var pwReset models.PasswordReset

	// lookup both the password reset token and its associated user
	database.DB.Where("tokenhash=?", tokenHash).Preload("User").First(&pwReset)

	// check if the passwordReset is not expired
	if time.Now().After(pwReset.ExpiresAt) {
		return nil, fmt.Errorf("token expired: %v", token)
	}

	user.Id = pwReset.User.Id
	user.FirstName = pwReset.User.FirstName
	user.LastName = pwReset.User.LastName

	log.Println("user in consume token is :", user)

	// delete the token
	result := database.DB.Delete(&pwReset)
	if result.Error != nil {
		log.Println("Error while deleting token : ", result.Error.Error())
		return nil, result.Error
	}

	return &user, nil
}

// Util function to update the password of a user
func UpdatePassword(userID uint, newPassword string) error {

	db := database.DB

	// Retrieve the user record from the database based on the ID
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return err // Handle error
	}

	// Update the password field with the new password
	user.SetPassword(newPassword)

	// Save the updated user record back to the database
	if err := db.Save(&user).Error; err != nil {
		return err
	}

	return nil
}
