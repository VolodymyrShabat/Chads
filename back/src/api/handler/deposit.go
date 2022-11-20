package handler

import (
	"net/http"

	"github.com/ServicesKursova/UserMicroservice/src/api/helpers"
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type depositCRUD interface {
	CreateDeposit(userId, accId int, d *models.Deposit) (int, error)
	GetAllDeposits(userId int) ([]*models.Deposit, error)
	GetDepositById(userId, accId, depId int) (*models.Deposit, error)
	UpdateDepositById(userId, accId, depId int, input models.UpdateDepositsInput) error
	DeleteDepositById(accId, depId int) error
	GetAllDepositsByBankAcc(userId, accId int) ([]*models.Deposit, error)
}

type Deposit struct {
	depositService depositCRUD
}

func NewDeposit(depositService *business.DepositService) *Deposit {
	return &Deposit{
		depositService: depositService,
	}
}

// Handler for get all deposits.
func (d *Deposit) GetAllDeposits(c *gin.Context) {

	userId, err := helpers.GetUserId(c)
	if err != nil {
		return
	}

	zap.L().Sugar().Info("Get all deposits for user with id:", userId)

	var deposits []*models.Deposit
	deposits, err = d.depositService.GetAllDeposits(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Cannot get all deposits"})
		return
	}

	c.JSON(http.StatusOK, deposits)
}

//Handler for create new deposit.
func (d *Deposit) CreateDeposit(c *gin.Context) {

	userId, err := helpers.GetUserId(c)
	if err != nil {
		return
	}

	deposit := models.Deposit{}

	if err = c.BindJSON(&deposit); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Bad deposit data"})
		return
	}

	userBankAccounts, err := storage.GetBankAccountsByUserId(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Cannot get user accounts"})
		return
	}
	for i, bankAccount := range userBankAccounts {
		if deposit.Id == bankAccount.Id {
			_ = i
			var id int
			id, err = d.depositService.CreateDeposit(userId, deposit.Id, &deposit)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError,
					gin.H{"error": "Can't create deposit"})
				return
			}

			c.JSON(http.StatusCreated, map[string]interface{}{
				"id": id,
			})
			return
		}
	}

	c.AbortWithStatusJSON(http.StatusNotFound,
		gin.H{"error": "Page not fount"})

}

//Handler for Update existed deposit.
func (d *Deposit) UpdateDepositById(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		return
	}

	accId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid acc id param"})
		return
	}

	depId, err := helpers.GetPath(c, "depId")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid deposit id param"})
		return
	}

	var input models.UpdateDepositsInput
	if err := c.BindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Bad update data"})
		return
	}

	if err := d.depositService.UpdateDepositById(userId, accId, depId, input); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Can't update deposit"})
		return
	}

	c.JSON(http.StatusOK, "deposit updated")
}

//Handler for Delete deposit by id.
func (d *Deposit) DeleteDepositById(c *gin.Context) {

	accId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid acc id param"})
		return
	}

	depId, err := helpers.GetPath(c, "depId")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid deposit id param"})
		return
	}

	err = d.depositService.DeleteDepositById(accId, depId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound,
			gin.H{"error": "Can't delete deposit"})
		return
	}

	c.JSON(http.StatusOK, "deposit deleted")
	zap.L().Sugar().Infof("deposit with id: %d deleted", depId)
}

//Handler for get deposit by id.
func (d *Deposit) GetDepositById(c *gin.Context) {

	userId, err := helpers.GetUserId(c)
	if err != nil {
		return
	}

	accId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid acc id param"})
		return
	}

	depId, err := helpers.GetPath(c, "depId")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid deposit id param"})
		return
	}

	var deposit *models.Deposit
	deposit, err = d.depositService.GetDepositById(userId, accId, depId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound,
			gin.H{"error": "Deposit not found"})
		return
	}

	c.JSON(http.StatusOK, deposit)
	zap.L().Sugar().Infof("Find deposit with id %d", depId)
}

// Handler for get all deposits.
func (d *Deposit) GetAllDepositsByBankAcc(c *gin.Context) {

	userId, err := helpers.GetUserId(c)
	if err != nil {
		return
	}
	accId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "invalid acc id param"})
		return
	}

	zap.L().Sugar().Info("Get all deposits for account number:", accId)

	var deposits []*models.Deposit
	deposits, err = d.depositService.GetAllDepositsByBankAcc(userId, accId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound,
			gin.H{"error": "Deposits not found"})
		return
	}

	c.JSON(http.StatusOK, deposits)
}
