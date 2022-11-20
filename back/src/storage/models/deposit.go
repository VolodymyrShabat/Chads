package models

import (
	"errors"
	"time"
)

//Deposit model definition.
type Deposit struct {
	Id            int           `json:"id"`
	Type          string        `json:"type"`
	DateCreated   time.Time     `json:"dateCreated"`
	Duration      time.Duration `json:"duration"`
	DepositAmount float64       `json:"depositAmount"`
	InterestRate  float64       `json:"interestRate"`
	IsActive      bool          `json:"isActive"`
}

type UpdateDepositsInput struct {
	Duration *int  `json:"duration"`
	IsActive *bool `json:"is_active"`
}

func (i UpdateDepositsInput) Validate() error {
	if i.Duration == nil && i.IsActive == nil {
		return errors.New("update structure has no values")
	}
	return nil
}
