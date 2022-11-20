package handler

import (
	"fmt"
	"net/http"

	"github.com/ServicesKursova/UserMicroservice/src/api/helpers"
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/gin-gonic/gin"
)

type ITransaction interface {
	TransferFunds(
		userId int,
		SenderCardNumber int,
		ReceiverCardNumber int,
		Remittance float64, Confirmed bool, message string, comment string) (int, error)
	CheckTransactionLimit(accountId, userId int, remittance float64) error
	ConfirmTransaction(userId,
		transactionId int, code string) error
}

type Transaction struct {
	transactionService ITransaction
}

type TransactionCardPayload struct {
	SenderCardNumber   int     `json:"senderNumber"`
	ReceiverCardNumber int     `json:"receiverNumber"`
	Remittance         float64 `json:"remittance"`
	Comment            string  `json:"transactionComment"`
}

type ConfirmTransactionPayload struct {
	Code string `json:"code"`
	Id   int    `json:"transactionId"`
}

func NewTransactionHandler(transactionService *business.TransactionService) *Transaction {
	return &Transaction{
		transactionService: transactionService,
	}
}

func (t *Transaction) TransferFundsFromCardToCard(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Cannot get user id"})
		return
	}

	transactionPayload := TransactionCardPayload{}
	err = c.BindJSON(&transactionPayload)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Bad transaction data"})
		return
	}

	senderAccountId, err := storage.GetBankAccountByCardNumber(transactionPayload.SenderCardNumber)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": fmt.Sprintf("Cannot get bank account by card: %v", transactionPayload.SenderCardNumber)})
		return
	}

	receiverAccountId, err := storage.GetBankAccountByCardNumber(transactionPayload.ReceiverCardNumber)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": fmt.Sprintf("Cannot get bank account by card: %v", transactionPayload.ReceiverCardNumber)})
		return
	}
	err = t.transactionService.CheckTransactionLimit(senderAccountId, userId, transactionPayload.Remittance)
	if err != nil {
		var id int
		id, err = t.transactionService.TransferFunds(userId,
			senderAccountId,
			receiverAccountId,
			transactionPayload.Remittance, false, fmt.Sprintf("Sending money from card %d to %d",
				transactionPayload.SenderCardNumber,
				transactionPayload.ReceiverCardNumber), transactionPayload.Comment)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError,
				gin.H{"error": "Not enough funds"})
			return
		}
		c.JSON(http.StatusMovedPermanently, gin.H{"id": id})
		return
	}

	_, err = t.transactionService.TransferFunds(userId,
		senderAccountId,
		receiverAccountId,
		transactionPayload.Remittance, true, fmt.Sprintf("Sending money from card %d to %d",
			transactionPayload.SenderCardNumber,
			transactionPayload.ReceiverCardNumber), transactionPayload.Comment)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Not enough funds"})
		return
	}
	c.JSON(http.StatusOK, "Success transaction")
}

func (t *Transaction) ConfirmTransaction(c *gin.Context) {
	userId, err := helpers.GetUserId(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Cannot get user id"})
		return
	}

	payload := ConfirmTransactionPayload{}
	err = c.BindJSON(&payload)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Bad transaction data"})
		return
	}

	err = t.transactionService.ConfirmTransaction(userId, payload.Id, payload.Code)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Error during confirming transaction"})
		return
	}
	c.JSON(http.StatusOK, "Transaction successfully confirmed")
}
