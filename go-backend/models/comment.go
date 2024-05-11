package models

type Comment struct {
	Id uint `json:"id"`
	// Title      string    `json:"title" validate:"required"`
	Desc          string `json:"desc" validate:"required"`
	BlogID        string `json:"blogid" validate:"required"`
	CommenterName string `json:"commentername" validate:"required"`
	// UserID string `json:"userid" validate:"required"` // userID of user who posted the comment
	Blog Blog `json:"-";gorm:"foreignkey:BlogID"`
}
