package business

import (
	"errors"
	"fmt"

	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type TransactionService struct {
	transactionDAO storage.TransactionDAO
	userDAO        storage.UserDAO
}

func NewTransactionService(transactionDAO storage.TransactionDAO, userDAO storage.UserDAO) *TransactionService {
	return &TransactionService{
		transactionDAO: transactionDAO,
		userDAO:        userDAO,
	}
}

func (ts TransactionService) TransferFunds(
	userId int,
	senderAccountId int,
	receiverAccountId int,
	Remittance float64,
	Confirmed bool,
	message string,
	comment string,
) (int, error) {

	transaction := models.Transaction{}
	transaction.Remittance = Remittance
	transaction.SenderId = senderAccountId
	transaction.ReceiverId = receiverAccountId
	transaction.Confirmed = Confirmed
	transaction.Message = message
	transaction.Comment = comment
	_, err := storage.GetBankAccountByAccountId(senderAccountId, userId)
	if err != nil {
		return 0, err
	}
	id, err := ts.transactionDAO.Create(transaction)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (ts *TransactionService) CheckTransactionLimit(accountId int, userId int, remittance float64) error {
	account, err := storage.GetBankAccountByAccountId(accountId, userId)
	if err != nil {
		return err
	}

	if account.TransactionLimit < remittance {
		return errors.New("transaction limit reached")
	}
	return nil
}

func (ts *TransactionService) ConfirmTransaction(userId,
	transactionId int, code string) error {
	phoneNumber, err := ts.userDAO.GetUserPhoneNumber(userId)
	if err != nil {
		return fmt.Errorf("cannot get phone number for user %w", err)
	}
	err = NewUserService(storage.UserDAO{}).ConfrimPhone(phoneNumber, code)
	if err != nil {
		return fmt.Errorf("wrong code %w", err)
	}
	err = ts.transactionDAO.ConfirmTransaction(transactionId, userId)
	return err
}
