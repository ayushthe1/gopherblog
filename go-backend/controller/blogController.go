package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math"
	"strconv"
	"time"

	"github.com/ayushthe1/blog-backend/database"
	"github.com/ayushthe1/blog-backend/models"
	util "github.com/ayushthe1/blog-backend/utils"
	"github.com/gofiber/fiber/v2"

	"gorm.io/gorm"
)

func CreatePost(c *fiber.Ctx) error {
	log.Println("Inside create post")
	var blogpost models.Blog
	if err := c.BodyParser(&blogpost); err != nil {
		fmt.Println("Unable to parse body")
		return err
	}

	blogpost.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

	if err := database.DB.Create(&blogpost).Error; err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Invalid payload",
		})
	}

	log.Println("blog created successfully")
	return c.JSON(fiber.Map{
		"message": "Congratulation!, Your post is live",
	})

}

func AllPost(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit := 10
	offset := (page - 1) * limit
	var total int64
	var getblog []models.Blog

	// Retrieve data from redis, if not available then from mysql
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cachedData, errR := database.RedisClient.Get(ctx, "products").Bytes()
	if cachedData != nil {
		if err := json.Unmarshal(cachedData, &getblog); err != nil {
			log.Println("Error unmarshalling cached data:", err)
			return err
			// Handle unmarshalling error
			// For example, fallback to fetching from MySQL
		}
		log.Println("Getting data from redis")
	}

	if errR != nil {
		log.Println("getting data from mysql")
		database.DB.Preload("User").Offset(offset).Limit(limit).Find(&getblog)
		database.DB.Model(&models.Blog{}).Count(&total)

		cachedProducts, err := json.Marshal(getblog)
		if err != nil {
			log.Println("Error marshalling getblog")
			return err
		}

		// cache data for 10 sec
		err = database.RedisClient.Set(ctx, "products", cachedProducts, 10*time.Second).Err()

		if err != nil {
			log.Println("err in redis all post", err.Error())
			return err
		}
		log.Println("Data cached in redis")
	}

	// database.DB.Preload("User").Offset(offset).Limit(limit).Find(&getblog)
	// database.DB.Model(&models.Blog{}).Count(&total)
	return c.JSON(fiber.Map{
		"data": getblog,
		"meta": fiber.Map{
			"total":     total,
			"page":      page,
			"last_page": math.Ceil(float64(int(total) / limit)),
		},
	})

}

func DetailPost(c *fiber.Ctx) error {
	blogid, _ := strconv.Atoi(c.Params("id"))
	var blogpost models.Blog
	database.DB.Where("id=?", blogid).Preload("User").First(&blogpost)
	log.Println(blogpost.Created_at)
	return c.JSON(fiber.Map{
		"data": blogpost,
	})

}

//?  add logic to update the image which is received
func UpdatePost(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	blog := models.Blog{
		Id: uint(id),
	}

	if err := c.BodyParser(&blog); err != nil {
		fmt.Println("Unable to parse body")
	}
	database.DB.Model(&blog).Updates(blog)
	return c.JSON(fiber.Map{
		"message": "post updated successfully",
	})

}

// return posts created by that user only
func UniquePost(c *fiber.Ctx) error {
	log.Println("inside unique post")
	cookie := c.Cookies("jwt")
	id, err := util.Parsejwt(cookie)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	var blog []models.Blog
	// database.DB.Model(&blog).Where("user_id=?", id).Preload("User").Find(&blog)
	database.DB.Where("user_id=?", id).Preload("User").Find(&blog)

	return c.JSON(blog)

}
func DeletePost(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	blog := models.Blog{
		Id: uint(id),
	}
	deleteQuery := database.DB.Delete(&blog)
	if errors.Is(deleteQuery.Error, gorm.ErrRecordNotFound) {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Opps!, record Not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "post deleted Succesfully",
	})

}
