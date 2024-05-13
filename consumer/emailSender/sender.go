package emailSender

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-mail/mail/v2"
	"github.com/joho/godotenv"
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

// #sept
func ForgotPassword(to string, resetURL string) error {
	log.Println("Inside sender.ForgetPassword")
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

	log.Println("Inside sender.Send")

	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	err = godotenv.Load(filepath.Join(pwd, ".env"))
	if err != nil {
		log.Println("Error while loading .env file")
		return err
	}

	var config = SMTPConfig{
		Host:     os.Getenv("SMTP_HOST"),
		Username: os.Getenv("SMTP_USERNAME"),
		Password: os.Getenv("SMTP_PASSWORD"),
	}
	portStr := os.Getenv("SMTP_PORT")
	port, _ := strconv.Atoi(portStr)
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
