package handler

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/ServicesKursova/UserMicroservice/src/api/helpers"
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/render"
)

type userService interface {
	RegisterUser(user *models.User) error
	LoginUser(phoneNumber, password string) (*models.User, error)
	CreateTokenPair(id int, role string) (map[string]business.Token, error)
	VerifyToken(token string) (business.CustomClaims, error)
	RefreshToken(refreshToken string) (map[string]business.Token, error)
	GenerateQRCode(phoneNumber string) ([]byte, error)
	ConfrimPhone(phoneNumber, code string) error
	SendEmail(receiver []string, body string) error
}

type Auth struct {
	auth userService
}

func NewAuth(userService userService) *Auth {
	return &Auth{
		auth: userService,
	}
}

type SignInPayload struct {
	PhoneNumber string `json:"phoneNumber"`
	Password    string `json:"password"`
}
type ConfirmPayload struct {
	PhoneNumber string `json:"phoneNumber"`
	Code        string `json:"code"`
}
type QRPayload struct {
	PhoneNumber string `json:"phoneNumber"`
}
type ConfirmEmailPayload struct {
	Receivers []string `json:"receivers"`
}

func (a *Auth) SignIn(c *gin.Context) {

	payload := SignInPayload{}
	err := c.BindJSON(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError,
			fmt.Errorf("sign in payload: %w", err).Error())
		return
	}
	user, err := a.auth.LoginUser(payload.PhoneNumber, payload.Password)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	userDAO := &storage.UserDAO{}
	role, err := userDAO.GetUserRole(uint64(user.ID))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
		return
	}
	token, err := a.auth.CreateTokenPair(user.ID, role)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	accessToken := token["access_token"]
	refreshToken := token["refresh_token"]
	c.Header("access_token", accessToken.TokenString)
	c.Header("refresh_token", refreshToken.TokenString)

	c.JSON(http.StatusOK, "Login in!")
}

func (a *Auth) SignUp(c *gin.Context) {
	payload := models.User{}
	err := c.BindJSON(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError,
			fmt.Errorf("sign up payload:\n %w", err).Error())
		return
	}
	err = a.auth.RegisterUser(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "user has been created!!!")
}

func (a *Auth) LogOut(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(c.Writer, cookie)
	c.JSON(http.StatusOK, "cookies has been deleted, logged out!")
}

func (a *Auth) GenerateQRConfirmPhone(c *gin.Context) {
	payload := QRPayload{}
	err := c.BindJSON(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError,
			fmt.Errorf("qr payload:\n %w", err).Error())
		return
	}
	qr, err := a.auth.GenerateQRCode(payload.PhoneNumber)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.Render(http.StatusOK,
		render.Data{
			ContentType: "image/jpeg",
			Data:        qr,
		})
}
func (a *Auth) ConfirmPhone(c *gin.Context) {
	payload := ConfirmPayload{}
	err := c.BindJSON(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	err = a.auth.ConfrimPhone(payload.PhoneNumber, payload.Code)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "phone number has been confirmed!")

}
func (a *Auth) SendEmail(c *gin.Context) {
	payload := ConfirmEmailPayload{}
	err := c.BindJSON(&payload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	err = a.auth.SendEmail(payload.Receivers, "test message")
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "email has been sent!")

}

func (a *Auth) RefreshToken(c *gin.Context) {
	refToken := c.GetHeader("refresh_token")
	refToken = strings.Trim(refToken, "\"")
	if refToken == "" {
		helpers.ErrorResponse(c, http.StatusInternalServerError, "empty refresh_token")
		return
	}
	token, err := a.auth.RefreshToken(refToken)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	accessToken := token["access_token"]
	refreshToken := token["refresh_token"]
	c.Header("access_token", accessToken.TokenString)
	c.Header("refresh_token", refreshToken.TokenString)
	c.JSON(http.StatusOK, "tokens has been refreshed!")

}
func (a *Auth) TestJWTRoute(c *gin.Context) {
	token := c.GetHeader("access_token")
	c.JSON(http.StatusOK, token)
}
