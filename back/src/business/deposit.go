package business

import (
	"errors"
	"time"

	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/robfig/cron/v3"
	"go.uber.org/zap"
)

type DepositService struct {
	depositDAO storage.DepositDAO
}

func NewDepositService(depositDAO storage.DepositDAO) *DepositService {
	return &DepositService{
		depositDAO: depositDAO,
	}
}

func newFalse() *bool {
	b := false
	return &b
}

func (ds *DepositService) CreateDeposit(userId, accId int, d *models.Deposit) (int, error) {

	ts := TransactionService{}
	_, err := ts.TransferFunds(userId, accId, 1, d.DepositAmount, true, "Opening a deposit", "")
	if err != nil {
		return 0, err
	}

	id, depositCreated, duration, err := ds.depositDAO.CreateDeposit(accId, d)
	zap.S().Info("deposit created with id: ", id)
	if err != nil {
		return 0, err
	}

	amountBack := func() {
		intRatePerMonth := d.InterestRate / 1200
		profitPerMonth := d.DepositAmount * intRatePerMonth
		totalAmountProfit := float64(d.Duration) * profitPerMonth
		totalAmountDeposit := d.DepositAmount + totalAmountProfit

		_, err = ts.TransferFunds(1, 1, accId, totalAmountDeposit, true, "Closing a deposit", "")
		if err != nil {
			return
		}
	}
	c := cron.New()

	durationConvert := (duration * 1000000000)
	checkEndDeposit := func() {
		depEnd := depositCreated.Local().Add(durationConvert)
		timeNow := time.Now().Local()

		g2 := timeNow.After(depEnd)
		if g2 {
			zap.S().Info("transaction: bank send money for deposit with id:", id)
			amountBack()
			ds.depositDAO.UpdateDepositById(accId, d.Id, models.UpdateDepositsInput{IsActive: newFalse()})
			if err != nil {
				return
			}
			c.Stop()
		} else if !g2 {
			zap.S().Info("timeNow < depEnd")
			return
		}
	}

	c.AddFunc("@every 5s", checkEndDeposit)
	zap.S().Info("Start cron")
	c.Start()

	return d.Id, nil

}

func (ds *DepositService) UpdateDepositById(userId, accId, depId int, input models.UpdateDepositsInput) error {
	if err := input.Validate(); err != nil {
		return err
	}

	Accounts_array, err := storage.GetBankAccountsByUserId(userId)
	if err != nil {
		return err
	}
	for i, bankAccount := range Accounts_array {
		if accId == bankAccount.Id {
			_ = i
			err = ds.depositDAO.UpdateDepositById(accId, depId, input)
			if err != nil {
				return err
			}
			return nil
		}
	}
	return errors.New("cannot update deposit")
}

func (ds *DepositService) DeleteDepositById(accId, depId int) error {
	return ds.depositDAO.DeleteById(accId, depId)
}

func (ds *DepositService) GetAllDeposits(userId int) ([]*models.Deposit, error) {
	return ds.depositDAO.SelectAll(userId)
}

func (ds *DepositService) GetDepositById(userId, accId, depId int) (*models.Deposit, error) {
	return ds.depositDAO.FindDepositById(userId, accId, depId)
}
func (ds *DepositService) GetAllDepositsByBankAcc(userId, accId int) ([]*models.Deposit, error) {
	return ds.depositDAO.FindDepositsByByBankAcc(userId, accId)
}
