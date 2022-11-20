package handler

import (
	"fmt"
	"net/http"

	"github.com/ServicesKursova/UserMicroservice/src/api/helpers"
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/gin-gonic/gin"
)

type UserAccountService interface {
	GetAccountHistoryByBankAccountId(bankAccountId int) ([]*models.TransactionHistory, error)
	GetBankAccountsByUserId(userId int) ([]*models.AccountNumber, error)
	GetAccountAmountByBankAccountId(bankAccountId int) (float64, error)
	UpdateAccountTransactionLimit(userId, bankAccountId int, newLimit float64) error
	GetBankAccountByAccountId(accountId, userId int) (*models.AccountNumber, error)
	GetUserInformation(userId int) (*models.User, error)
}

type UserAccount struct {
	UserAccountService UserAccountService
}

func NewUserAccountHandler(UserAccountService *business.UserService) *UserAccount {
	return &UserAccount{
		UserAccountService: UserAccountService,
	}
}

type TransactionLimitPayload struct {
	Transaction_limit float64 `json:"transaction_limit"`
	Id                int     `json:"id"`
}

func (ua *UserAccount) GetAccountHistoryByBankAccountId(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get user id"})
		return
	}

	BankAccountId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get path id"})
		return
	}

	_, err = ua.UserAccountService.GetBankAccountByAccountId(BankAccountId, userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": fmt.Sprintf("Cannot get bank account by id: %v", BankAccountId)})
		return
	}

	Amount, err := ua.UserAccountService.GetAccountHistoryByBankAccountId(BankAccountId)
	for i, j := 0, len(Amount)-1; i < j; i, j = i+1, j-1 {
		Amount[i], Amount[j] = Amount[j], Amount[i]
	}
	if len(Amount) > 0 {
		Amount = Amount[:len(Amount)-1]
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": fmt.Sprintf("Cannot get transaction history for bankaccount with  id: %v", BankAccountId)})
		return
	}
	c.JSON(http.StatusOK, Amount)
}

func (ua *UserAccount) GetBankAccountsByUserId(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get user id"})
		return
	}

	var bankAccounts []*models.AccountNumber
	bankAccounts, err = ua.UserAccountService.GetBankAccountsByUserId(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Cannot get bankaccounts"})
		return
	}

	for _, bankAccount := range bankAccounts {
		bankAccount.Amount, err = ua.UserAccountService.GetAccountAmountByBankAccountId(bankAccount.Id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError,
				gin.H{"error": fmt.Sprintf("Cannot get amount for bank account with id: %v", bankAccount.Id)})
			return
		}
	}
	c.JSON(http.StatusOK, bankAccounts)
}

func (ua *UserAccount) UpdateAccountTransactionLimit(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get user id"})
		return
	}

	transactionLimitPayload := TransactionLimitPayload{}
	err = c.BindJSON(&transactionLimitPayload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Bad transaction limit data"})
		return
	}
	err = ua.UserAccountService.UpdateAccountTransactionLimit(userId, transactionLimitPayload.Id,
		transactionLimitPayload.Transaction_limit)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Error during updating limit"})
		return
	}
	c.JSON(http.StatusOK, fmt.Sprintf("Successfully updated transaction limit to: %.2f",
		transactionLimitPayload.Transaction_limit))
}

func (ua *UserAccount) GetBankAccountByAccountId(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get user id"})
		return
	}

	BankAccountId, err := helpers.GetPath(c, "id")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Cannot get path id"})
		return
	}

	account, err := ua.UserAccountService.GetBankAccountByAccountId(BankAccountId, userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Error during getting bank account"})
		return
	}
	c.JSON(http.StatusOK, account)
}

func (ua *UserAccount) GetUserInformation(c *gin.Context) {
	id := c.GetInt("user_id")
	user, err := ua.UserAccountService.GetUserInformation(id)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	jsonUser := models.User{
		ID:          user.ID,
		Username:    user.Username,
		Avatar_path: user.Avatar_path,
	}
	c.JSON(http.StatusOK, jsonUser)
}
