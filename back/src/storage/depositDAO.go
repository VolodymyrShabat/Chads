package storage

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"go.uber.org/zap"
)

type DepositDAO struct{}

var (
	tableDeposit        string = "deposits"
	tableDepositAcounts string = "accounts_deposits_relations"
	tableAccountNumbers string = "account_numbers"
)

// Method Create Deposit in database.
func (dd *DepositDAO) CreateDeposit(accId int, d *models.Deposit) (int, time.Time, time.Duration, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, time.Time{}, 0, err
	}
	tx, err := conn.Begin(context.Background())
	if err != nil {
		return 0, time.Time{}, 0, err
	}
	d.Id = 0

	createDepositQuery := fmt.Sprintf("INSERT INTO %s (deposit_type, duration, deposit_amount,"+
		" interest_rate, is_active) VALUES($1, $2, $3, $4, $5) RETURNING id, date_created, duration", tableDeposit)
	if err = conn.QueryRow(context.Background(),
		createDepositQuery, d.Type, d.Duration, d.DepositAmount, d.InterestRate, d.IsActive).
		Scan(&d.Id, &d.DateCreated, &d.Duration); err != nil {
		tx.Rollback(context.Background())
		return 0, time.Time{}, 0, err
	}

	createAccountsDepositQuery := fmt.Sprintf("INSERT INTO %s (deposit_id, account_id)"+
		" VALUES ($1, $2)", tableDepositAcounts)
	_, err = tx.Exec(context.Background(), createAccountsDepositQuery, d.Id, accId)
	if err != nil {
		tx.Rollback(context.Background())
		return 0, time.Time{}, 0, err
	}
	return d.Id, d.DateCreated, d.Duration, tx.Commit(context.Background())
}

//Method Find deposit by id in database.
func (dd *DepositDAO) FindDepositById(userId, accId, depId int) (*models.Deposit, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	d := &models.Deposit{}
	query := fmt.Sprintf("SELECT dp.* FROM %s dp INNER JOIN %s adr on dp.id = adr.deposit_id"+
		" INNER JOIN %s an on adr.account_id = an.id WHERE an.userid = $1 AND an.id = $2 AND dp.id = $3",
		tableDeposit, tableDepositAcounts, tableAccountNumbers)
	row := conn.QueryRow(context.Background(), query, userId, accId, depId)
	err = row.Scan(&d.Id, &d.Type, &d.Duration, &d.DepositAmount, &d.InterestRate, &d.IsActive, &d.DateCreated)
	if err != nil {
		return nil, err
	}
	return d, nil
}

//Method SelectAll in database.
func (dd *DepositDAO) SelectAll(userId int) ([]*models.Deposit, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}

	query := fmt.Sprintf("SELECT dp.* FROM %s dp INNER JOIN %s adr on dp.id = adr.deposit_id"+
		" INNER JOIN %s an on adr.account_id = an.id WHERE an.userid = $1",
		tableDeposit, tableDepositAcounts, tableAccountNumbers)
	rows, err := conn.Query(context.Background(), query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var deposits []*models.Deposit
	for rows.Next() {
		d := models.Deposit{}
		err := rows.Scan(&d.Id, &d.Type, &d.Duration, &d.DepositAmount, &d.InterestRate, &d.IsActive, &d.DateCreated)
		if err != nil {
			continue
		}
		deposits = append(deposits, &d)
	}
	return deposits, nil
}

//Method Delete by id in database.
func (dd *DepositDAO) DeleteById(accId, depId int) error {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return err
	}

	{
		query := fmt.Sprintf("DELETE FROM %s dp USING %s adr WHERE dp.id = adr.deposit_id"+
			" AND adr.account_id = $1 AND adr.deposit_id = $2", tableDeposit, tableDepositAcounts)
		_, err := conn.Exec(context.Background(), query, accId, depId)
		if err != nil {
			return err
		}
	}
	return nil
}

//Method Find deposit by account id in database.
func (dd *DepositDAO) FindDepositsByByBankAcc(userId, accId int) ([]*models.Deposit, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}

	query := fmt.Sprintf("SELECT dp.* FROM %s dp INNER JOIN %s adr on dp.id = adr.deposit_id"+
		" INNER JOIN %s an on adr.account_id = an.id WHERE an.userid = $1 AND an.id = $2",
		tableDeposit, tableDepositAcounts, tableAccountNumbers)
	rows, err := conn.Query(context.Background(), query, userId, accId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var deposits []*models.Deposit
	for rows.Next() {
		d := models.Deposit{}
		err := rows.Scan(&d.Id, &d.Type, &d.Duration, &d.DepositAmount, &d.InterestRate, &d.IsActive, &d.DateCreated)
		if err != nil {
			continue
		}
		deposits = append(deposits, &d)
	}
	return deposits, nil
}

//Updata method deposit by id.
func (dd *DepositDAO) UpdateDepositById(accId, depId int, input models.UpdateDepositsInput) error {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return err
	}
	fmt.Println(accId, depId)
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if input.Duration != nil {
		setValues = append(setValues, fmt.Sprintf("duration=$%d", argId))
		args = append(args, *input.Duration)
		argId++
	}

	if input.IsActive != nil {
		setValues = append(setValues, fmt.Sprintf("is_active=$%d", argId))
		args = append(args, *input.IsActive)
		argId++
	}

	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf("UPDATE %s dp SET %s FROM %s adr WHERE"+
		" dp.id = adr.deposit_id AND adr.deposit_id=$%d AND adr.account_id=$%d",
		tableDeposit, setQuery, tableDepositAcounts, argId, argId+1)

	args = append(args, depId, accId)
	zap.S().Debugf("updateQuery: %s", query)
	zap.S().Debugf("args: %s", args)
	_, err = conn.Exec(context.Background(), query, args...)
	if err != nil {
		return err
	}
	return err

}
