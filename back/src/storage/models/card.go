package models

import "time"

type Card struct {
	CardNumber      int       `json:"cardNumber"`
	Cvv             int       `json:"cvv"`
	Type            string    `json:"type"`
	Currency        string    `json:"currency"`
	CreatedAt       time.Time `json:"createdAt"`
	IsBlocked       bool      `json:"isBlocked"`
	AccountNumberId int       `json:"accountNumberId"`
	CardNameId      int       `json:"cardNameId"`
	ExpirationDate  time.Time `json:"expirationDate"`
}
