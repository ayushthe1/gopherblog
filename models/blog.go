package models

import "time"

type Blog struct {
	Id         uint      `json:"id"`
	Title      string    `json:"title" validate:"required"`
	Desc       string    `json:"desc" validate:"required"`
	Image      string    `json:image`
	UserID     string    `json:"userid" validate:"required"`
	User       User      `json:"user";gorm:"foreignkey:UserID"`
	Created_at time.Time `json:"created_at"`
}

//The gorm:"foreignkey:UserID" tag indicates that the UserID field is a foreign key that references the primary key of the User entity. This allows GORM to automatically establish a relationship between the Blog and User tables in the database.
