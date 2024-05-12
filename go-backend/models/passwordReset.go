package models

import "time"

type PasswordReset struct {
	Id     uint `json:"id"`
	UserID int  `json:"userid" validate:"required"`
	User   User `json:"user";gorm:"foreignkey:UserID"`
	// Token is only set when a passwordReset is created
	Token     string
	Tokenhash string
	ExpiresAt time.Time
}
