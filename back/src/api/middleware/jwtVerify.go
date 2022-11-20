package middleware

import (
	"net/http"
	"strings"

	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/gin-gonic/gin"
)

func JWTverify() gin.HandlerFunc {
	return func(c *gin.Context) {
		signedToken := c.GetHeader("access_token")
		if signedToken == "" {
			signedToken = c.Query("token")
		}
		if signedToken == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "empty access_token header")
			return
		}
		signedToken = strings.Trim(signedToken, "\"")
		userService := business.UserService{}
		claims, err := userService.VerifyToken(signedToken)
		if err != nil {
			if strings.Contains(err.Error(), "token is expired") {
				c.AbortWithStatusJSON(403, err.Error())
				return
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, "invalid token")
			return
		}
		c.Set("user_id", claims.UserId)
		c.Set("role", claims.Role)
		c.Next()
	}
}
