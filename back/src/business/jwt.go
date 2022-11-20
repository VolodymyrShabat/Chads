package business

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var (
	jwtSecretKey = []byte("secureSecret")
)

type Token struct {
	TokenString string
	ExpiresAt   time.Time
}

type CustomClaims struct {
	UserId int    `json:"userId"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func (u *UserService) CreateTokenPair(id int, role string) (map[string]Token, error) {
	claims := CustomClaims{
		UserId: id,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "ABank",
			ExpiresAt: time.Now().Add(time.Minute * 10).Unix(),
			IssuedAt:  time.Now().Local().Unix(),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)
	signedAccessToken, err := accessToken.SignedString(jwtSecretKey)

	if err != nil {
		return nil, fmt.Errorf("create access token: %w", err)
	}
	refreshTokenClaims := CustomClaims{
		UserId: id,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "ABank",
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			IssuedAt:  time.Now().Local().Unix(),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &refreshTokenClaims)
	signedRefreshToken, err := refreshToken.SignedString(jwtSecretKey)
	if err != nil {
		return nil, fmt.Errorf("create refresh token: %w", err)
	}
	return map[string]Token{
		"access_token":  {TokenString: signedAccessToken},
		"refresh_token": {TokenString: signedRefreshToken},
	}, nil
}

func (u *UserService) VerifyToken(signedToken string) (CustomClaims, error) {
	token, err := jwt.ParseWithClaims(signedToken, &CustomClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return 0, fmt.Errorf("unexpected signing method")
			}
			return jwtSecretKey, nil
		})
	if err != nil {
		return CustomClaims{}, fmt.Errorf("parse token: %w", err)
	}
	claims, ok := token.Claims.(*CustomClaims)
	if !ok {
		return CustomClaims{}, fmt.Errorf("parse claims: %w", err)
	}

	return CustomClaims{
		UserId: claims.UserId,
		Role:   claims.Role,
	}, nil
}

func (u *UserService) RefreshToken(refreshToken string) (map[string]Token, error) {
	claims, err := u.VerifyToken(refreshToken)
	if err != nil {
		return nil, fmt.Errorf("verify token: %w", err)
	}
	fmt.Println(claims)
	user, err := u.userDAO.FindById(claims.UserId)
	if err != nil {
		return nil, fmt.Errorf("find user: %w", err)
	}
	tokenPair, err := u.CreateTokenPair(user.ID, claims.Role)
	if err != nil {
		return nil, fmt.Errorf("create token pair: %w", err)
	}
	return tokenPair, nil
}
