package app

import (
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage"
)

type Services struct {
	User        *business.UserService
	Deposit     *business.DepositService
	Card        *business.CardService
	Transaction *business.TransactionService
}

func CreateServices() *Services {
	services := Services{
		User:    business.NewUserService(storage.UserDAO{}),
		Deposit: business.NewDepositService(storage.DepositDAO{}),
		Card: business.NewCardService(storage.CardDAO{}, storage.TransactionDAO{},
			storage.CardNameDAO{}, storage.BankAccountDAO{}),
		Transaction: business.NewTransactionService(storage.TransactionDAO{}, storage.UserDAO{}),
	}

	return &services
}
