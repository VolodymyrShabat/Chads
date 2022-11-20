package helpers

import (
	"errors"
	"net/http"
	"strconv"

	"go.uber.org/zap"

	"github.com/gin-gonic/gin"
)

type Message struct {
	Message string `json:"message"`
}

func ErrorResponse(c *gin.Context, statusCode int, message string) {
	zap.L().Error(message)
	c.AbortWithStatusJSON(statusCode, Message{message})
}

func GetPath(c *gin.Context, id string) (int, error) {
	val := c.Params.ByName(id)
	return strconv.Atoi(val)
}

func GetUserId(c *gin.Context) (int, error) {
	id, ok := c.Get("user_id")
	if !ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "user id not found"})
		return 0, errors.New("user id not found")
	}
	UserId, ok := id.(int)
	if !ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "user id is of invalid type"})
		return 0, errors.New("invalid type")
	}
	return UserId, nil
}
