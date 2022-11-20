package storage

import (
	"context"
	"errors"
	"fmt"
	"math"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/jackc/pgx/v4"
)

type TransactionDAO struct{}

var (
	BankAccountId    int    = 1
	transactionTable string = "transactions"
)

func GetUserBalance(userAccountId int) (float64, []*models.TransactionHistory, error) {
	var UserBalance float64
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, nil, err
	}

	rows, err := conn.Query(context.Background(),
		fmt.Sprintf("Select id,remittance,receiver_id,sender_id,date_of_transaction,message,comment from "+transactionTable+
			" where receiver_id=$1 or sender_id=$2 and confirmed=true order by id"),
		userAccountId, userAccountId)

	if err != nil {
		return 0, nil, err
	}
	UserBalance, transaction_history, err := CalculateBalance(rows, userAccountId)

	if err != nil {
		return 0, nil, err
	}

	return UserBalance, transaction_history, err
}

func CalculateBalance(rows pgx.Rows, userAccountId int) (float64, []*models.TransactionHistory, error) {
	var balance float64
	transactionHistoryArray := make([]*models.TransactionHistory, 0)

	var s int
	for rows.Next() {
		t := models.TransactionHistory{}
		if err := rows.Scan(
			&s,
			&t.Remittance,
			&t.ReceiverId,
			&t.SenderId,
			&t.DateOfTransaction,
			&t.Message,
			&t.Comment,
		); err != nil {
			return 0, nil, err
		}

		t.Remittance = math.Floor(t.Remittance*100) / 100

		if t.SenderId == userAccountId && t.SenderId != t.ReceiverId {
			balance -= math.Floor(t.Remittance*100) / 100

		} else {
			balance += math.Floor(t.Remittance*100) / 100
		}

		t.MoneyAfterTransaction = math.Floor(balance*100) / 100
		transactionHistoryArray = append(transactionHistoryArray, &t)
	}
	return math.Floor(balance*100) / 100, transactionHistoryArray, nil
}

func (t *TransactionDAO) CreateDefaultTransaction(ReceiverId int) error {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return err
	}

	tx, err := conn.BeginTx(context.Background(), pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	defer func() {
		cerr := tx.Commit(context.Background())
		if err != nil {
			err = cerr
		}
	}()

	if err != nil {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return rollbackError
		}
		return err
	}

	if err != nil {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return rollbackError
		}
		return err
	}

	_, err = tx.Exec(context.Background(),
		fmt.Sprintf("INSERT INTO "+transactionTable+
			" (Remittance,Receiver_id,Sender_id,date_of_transaction,confirmed,message,comment)"+
			" VALUES (0, $1,$2,NOW(),true,'Bank account initialization','')"),
		ReceiverId,
		BankAccountId)

	if err != nil {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return rollbackError
		}
		return err
	}
	return err
}

func (t *TransactionDAO) Create(transaction models.Transaction) (int, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, err
	}
	tx, err := conn.BeginTx(context.Background(), pgx.TxOptions{IsoLevel: pgx.ReadCommitted})

	defer func() {
		cerr := tx.Commit(context.Background())
		if err != nil {
			err = cerr
		}
	}()

	if err != nil {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return 0, rollbackError
		}
		return 0, err
	}

	var UserBalance float64
	rows, err := tx.Query(context.Background(),
		fmt.Sprintf("Select id,remittance,receiver_id,sender_id,date_of_transaction,message,comment from "+transactionTable+
			" where receiver_id=$1 or sender_id=$2 and confirmed=true order by id"),
		transaction.SenderId, transaction.SenderId)
	if err != nil {
		return 0, err
	}

	UserBalance, _, err = CalculateBalance(rows, transaction.SenderId)
	if err != nil {
		return 0, err
	}

	if UserBalance < transaction.Remittance {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return 0, rollbackError
		}
		return 0, errors.New("not enough funds")
	}

	var transactionId int
	err = tx.QueryRow(context.Background(),
		fmt.Sprintf("INSERT INTO "+transactionTable+
			" (Remittance,Receiver_id,Sender_id,date_of_transaction,confirmed,message,comment)"+
			" VALUES ($1,$2,$3,NOW(),$4,$5,$6) RETURNING Id"),
		transaction.Remittance,
		transaction.ReceiverId,
		transaction.SenderId,
		transaction.Confirmed,
		transaction.Message,
		transaction.Comment,
	).Scan(&transactionId)

	if err != nil {
		rollbackError := tx.Rollback(context.Background())
		if rollbackError != nil {
			return 0, rollbackError
		}
		return 0, err
	}
	return transactionId, err
}
func (t *TransactionDAO) ConfirmTransaction(transactionId, userId int) error {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return err
	}
	var bankAccountid int
	err = conn.QueryRow(context.Background(),
		fmt.Sprintf("Select sender_id from "+transactionTable+" where id=%d", transactionId)).Scan(&bankAccountid)
	if err != nil {
		return err
	}

	_, err = GetBankAccountByAccountId(bankAccountid, userId)
	if err != nil {
		return errors.New("user not allowed")
	}

	query := fmt.Sprintf("Update "+transactionTable+
		" set confirmed = true where id = %d and sender_id=%d", transactionId, bankAccountid)
	_, err = conn.Exec(context.Background(), query)
	return err
}
