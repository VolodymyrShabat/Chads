package handler

import (
	"net/http"

	"github.com/ServicesKursova/UserMicroservice/src/api/helpers"
	"github.com/ServicesKursova/UserMicroservice/src/business"
	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/gin-gonic/gin"
)

type cardCRUD interface {
	CreateCard(userId, cardNumber, cvv, cardNameId int,
		cardType, currency string) error
	GetCards(accountId int) ([]*business.Card, error)
	GetCard(cardNumber, accountId int) (*business.Card, error)
	DeleteCard(cardNumber, accountId int) error
	BlockCard(cardNumber, accountId int) error
	CreateCardName(cardName *business.CardName) error
	GetCardNames() ([]*business.CardName, error)
	UpdateCardNames(cardName *business.CardName) error
}

type Card struct {
	cardService cardCRUD
}

func NewCard(cardService *business.CardService) *Card {
	return &Card{
		cardService: cardService,
	}
}

type CreateCardPayload struct {
	CardNumber int    `json:"card_number"`
	Cvv        int    `json:"cvv"`
	Type       string `json:"type"`
	Currency   string `json:"currency"`
	CardNameId int    `json:"card_name_id"`
}

type CardPayload struct {
	CardNumber int    `json:"card_number"`
	Cvv        int    `json:"cvv"`
	Type       string `json:"type"`
	Currency   string `json:"currency"`
	CardNameId int    `json:"card_name_id"`
}

type CreateCardNamePayload struct {
	Id       int     `json:"id"`
	CardName string  `json:"card_name"`
	Fee      float64 `json:"fee"`
}

func (card *Card) CreateCard(c *gin.Context) {
	var userId int
	userId, err := helpers.GetUserId(c)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	createCardPayload := CreateCardPayload{}
	err = c.BindJSON(&createCardPayload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	err = card.cardService.CreateCard(userId, createCardPayload.CardNumber, createCardPayload.Cvv,
		createCardPayload.CardNameId,
		createCardPayload.Type, createCardPayload.Currency)

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "Success")
}

func (card *Card) GetCards(context *gin.Context) {
	var userId int
	userId, err := helpers.GetUserId(context)
	if err != nil {
		helpers.ErrorResponse(context, http.StatusInternalServerError, err.Error())
		return
	}
	var accountNumberId int
	userBankAccounts, err := storage.GetBankAccountsByUserId(userId)

	if err != nil {
		helpers.ErrorResponse(context, http.StatusInternalServerError, err.Error())
		return
	}

	cards := make([]*business.Card, 0)
	for _, bankAccount := range userBankAccounts {
		accountNumberId = bankAccount.Id
		c, err := card.cardService.GetCards(accountNumberId)
		if err != nil {
			helpers.ErrorResponse(context, http.StatusInternalServerError, err.Error())
			return
		}
		cards = append(cards, c...)
	}
	context.JSON(http.StatusOK, cards)
}

func (cc *Card) GetCard(c *gin.Context) {
	id, err := helpers.GetPath(c, "id")
	if err != nil {
		return
	}

	accountNumberId, err := storage.GetBankAccountByCardNumber(id)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	card, err := cc.cardService.GetCard(id, accountNumberId)

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, card)
}

func (cc *Card) DeleteCard(c *gin.Context) {
	id, err := helpers.GetPath(c, "id")
	if err != nil {
		return
	}

	accountNumberId, err := storage.GetBankAccountByCardNumber(id)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	err = cc.cardService.DeleteCard(id, accountNumberId)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "Success")
}

func (cc *Card) BlockCard(c *gin.Context) {
	id, err := helpers.GetPath(c, "id")
	if err != nil {
		return
	}

	accountNumberId, err := storage.GetBankAccountByCardNumber(id)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	err = cc.cardService.BlockCard(id, accountNumberId)

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "Success")
}

func (cc *Card) CreateCardName(c *gin.Context) {
	var userId int
	userId, err := helpers.GetUserId(c)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	isAdmin, err := storage.IsUserAdmin(userId)
	if !isAdmin {
		helpers.ErrorResponse(c, http.StatusForbidden, "Only admin is allowed")
		return
	}

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	createCardNamePayload := CreateCardNamePayload{}
	err = c.BindJSON(&createCardNamePayload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	cardName := business.CardName{}
	cardName.Id = createCardNamePayload.Id
	cardName.CardName = createCardNamePayload.CardName
	cardName.Fee = createCardNamePayload.Fee
	err = cc.cardService.CreateCardName(&cardName)

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "Success")
}

func (card *Card) GetCardNames(c *gin.Context) {
	cards, err := card.cardService.GetCardNames()
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, cards)
}

func (cc *Card) UpdateCardNames(c *gin.Context) {
	var userId int
	userId, err := helpers.GetUserId(c)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	isAdmin, err := storage.IsUserAdmin(userId)
	if !isAdmin {
		helpers.ErrorResponse(c, http.StatusForbidden, "Only admin is allowed")
		return
	}

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	createCardNamePayload := CreateCardNamePayload{}
	err = c.BindJSON(&createCardNamePayload)
	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	cardName := business.CardName{}
	cardName.Id = createCardNamePayload.Id
	cardName.CardName = createCardNamePayload.CardName
	cardName.Fee = createCardNamePayload.Fee

	err = cc.cardService.UpdateCardNames(&cardName)

	if err != nil {
		helpers.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "Success")
}
