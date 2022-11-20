package storage

import (
	"context"
	"fmt"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type BankAccountDAO struct{}

var (
	tableAccountNumber string = "account_numbers"
)

func (b *BankAccountDAO) CreateBankAccount(userId int) (int, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, err
	}
	account := models.AccountNumber{}
	account.Userid = userId
	query := fmt.Sprintf("INSERT INTO %s (userid)"+
		" VALUES($1) RETURNING id", tableAccountNumber)
	if err = conn.QueryRow(context.Background(),
		query, account.Userid).Scan(&account.Id); err != nil {
		return 0, err
	}

	return account.Id, nil
}

func GetBankAccountByCardNumber(bankCardNumber int) (int, error) {
	accountNumber := models.AccountNumber{}
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, err
	}
	err = conn.QueryRow(context.Background(),
		fmt.Sprintf("Select account_number_id from "+tableCard+
			" where card_number=$1"),
		bankCardNumber).Scan(&accountNumber.Id)
	if err != nil {
		return 0, err
	}
	return accountNumber.Id, nil
}

func GetBankAccountsByUserId(userId int) ([]*models.AccountNumber, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("Select id,transaction_limit from "+tableAccountNumber+
		" where userid=%v order by id", userId)
	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	acountNumbers := make([]*models.AccountNumber, 0)
	for rows.Next() {
		ba := models.AccountNumber{}
		err = rows.Scan(&ba.Id, &ba.TransactionLimit)
		if err != nil {
			return nil, err
		}
		acountNumbers = append(acountNumbers, &ba)
	}
	for _, account := range acountNumbers {
		query = fmt.Sprintf("Select card_number from "+tableCard+
			" where account_number_id=%v", account.Id)
		err = conn.QueryRow(context.Background(), query).Scan(&account.CardNumber)
		if err != nil {
			account.CardNumber = 0
		}
	}
	return acountNumbers, nil
}

func UpdateTransactionLimit(bankAccountId int, newTransactionLimit float64) error {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return err
	}
	query := fmt.Sprintf("Update "+tableAccountNumber+
		" set transaction_limit = %.2f where id = %d", newTransactionLimit, bankAccountId)
	_, err = conn.Exec(context.Background(), query)
	if err != nil {
		return err
	}
	return nil
}

func GetBankAccountByAccountId(accountId, userId int) (*models.AccountNumber, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("Select userid,id,transaction_limit from "+tableAccountNumber+
		" where userid=%v and id=%v", userId, accountId)
	accountNumber := &models.AccountNumber{}
	err = conn.QueryRow(context.Background(), query).Scan(&accountNumber.Userid,
		&accountNumber.Id,
		&accountNumber.TransactionLimit)
	if err != nil {
		return nil, err
	}
	accountNumber.Amount, _, err = GetUserBalance(accountId)
	if err != nil {
		return nil, err
	}
	return accountNumber, nil
}
