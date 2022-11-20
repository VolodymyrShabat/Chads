package models

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID                int    `json:"id"`
	Phonenumber       string `json:"phoneNumber"`
	Email             string `json:"email"`
	Confirmed_email   bool   `json:"confirmedEmail"`
	Password          string `json:"password"`
	Date_of_birth     string `json:"dateOfBirth"`
	Secret_question   string `json:"secretQuestion"`
	Username          string `json:"username"`
	Address           string `json:"address"`
	Avatar_path       string `json:"avatarPath"`
	Registration_date string `json:"registrationDate"`
	Two_fa            bool   `json:"twoFa"`
}

func (user *User) HashPassword() error {

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.MinCost)

	if err != nil {
		return err
	}
	user.Password = string(hash)
	return nil
}

func (user *User) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
