package business

import (
	"time"

	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type Card struct {
	CardNumber      int       `json:"cardNumber"`
	Cvv             int       `json:"cvv"`
	Type            string    `json:"type"`
	Currency        string    `json:"currency"`
	CreatedAt       time.Time `json:"createdAt"`
	IsBlocked       bool      `json:"isBlocked"`
	AccountNumberId int       `json:"accountNumberId"`
	CardNameId      int       `json:"cardNameId"`
	ExpirationDate  time.Time `json:"expirationDate"`
	Balance         float64   `json:"cardBalance"`
}

type CardName struct {
	Id       int
	CardName string
	Fee      float64
}

type CardService struct {
	cardDAO        storage.CardDAO
	transactionDAO storage.TransactionDAO
	cardNameDAO    storage.CardNameDAO
	bankAccountDAO storage.BankAccountDAO
}

func NewCardService(cardDAO storage.CardDAO,
	transactionDAO storage.TransactionDAO,
	cardNameDAO storage.CardNameDAO,
	bankAccountDAO storage.BankAccountDAO) *CardService {
	return &CardService{
		cardDAO:        cardDAO,
		transactionDAO: transactionDAO,
		cardNameDAO:    cardNameDAO,
		bankAccountDAO: bankAccountDAO,
	}
}

func (cardService *CardService) CreateCard(userId, cardNumber, cvv, cardNameId int,
	cardType, currency string) error {
	card := models.Card{}
	card.CardNumber = cardNumber
	card.Cvv = cvv
	card.Type = cardType
	card.Currency = currency

	card.CreatedAt = time.Now()
	card.IsBlocked = false
	card.ExpirationDate = time.Now().AddDate(3, 0, 0)

	bankAccountId, err := cardService.bankAccountDAO.CreateBankAccount(userId)
	if err != nil {
		return err
	}
	err = cardService.transactionDAO.CreateDefaultTransaction(bankAccountId)

	if err != nil {
		return err
	}

	card.AccountNumberId = bankAccountId
	_, err = cardService.cardDAO.Create(&card, cardNameId)
	if err != nil {
		return err
	}

	return nil
}

func (card *CardService) GetCard(cardNumber, userId int) (*Card, error) {
	element, error := card.cardDAO.GetCard(cardNumber, userId)

	cardModel := Card{CardNumber: element.CardNumber,
		Cvv:             element.Cvv,
		Type:            element.Type,
		Currency:        element.Currency,
		CreatedAt:       element.CreatedAt,
		IsBlocked:       element.IsBlocked,
		AccountNumberId: element.AccountNumberId,
		CardNameId:      element.CardNameId,
		ExpirationDate:  element.ExpirationDate}

	return &cardModel, error
}

func (card *CardService) GetCards(accountId int) ([]*Card, error) {
	cardsDao, error := card.cardDAO.GetCards(accountId)

	var cards []*Card
	accountAmount, err := NewUserService(storage.UserDAO{}).GetAccountAmountByBankAccountId(accountId)
	if err != nil {
		return nil, err
	}
	for _, element := range cardsDao {
		card := Card{CardNumber: element.CardNumber,
			Cvv:             element.Cvv,
			Type:            element.Type,
			Currency:        element.Currency,
			CreatedAt:       element.CreatedAt,
			IsBlocked:       element.IsBlocked,
			AccountNumberId: element.AccountNumberId,
			CardNameId:      element.CardNameId,
			ExpirationDate:  element.ExpirationDate,
			Balance:         accountAmount}

		cards = append(cards, &card)
	}

	return cards, error
}

func (card *CardService) DeleteCard(cardNumber, accountId int) error {
	_, error := card.cardDAO.Delete(cardNumber, accountId)
	return error
}

func (card *CardService) BlockCard(cardNumber, accountId int) error {
	_, error := card.cardDAO.BlockCard(cardNumber, accountId)
	return error
}

func (card *CardService) CreateCardName(cardName *CardName) error {
	cardNameDao := models.Card_name{
		Id:        cardName.Id,
		Card_name: cardName.CardName,
		Fee:       cardName.Fee,
	}

	_, error := card.cardNameDAO.Create(&cardNameDao)
	return error
}

func (card *CardService) GetCardNames() ([]*CardName, error) {
	cardsNameDao, error := card.cardNameDAO.GetAll()
	var cards []*CardName
	for _, element := range cardsNameDao {
		card := CardName{
			Id:       element.Id,
			CardName: element.Card_name,
			Fee:      element.Fee,
		}

		cards = append(cards, &card)
	}
	return cards, error
}

func (card *CardService) UpdateCardNames(cardName *CardName) error {
	cardNameDao := models.Card_name{
		Id:        cardName.Id,
		Card_name: cardName.CardName,
		Fee:       cardName.Fee,
	}
	_, error := card.cardNameDAO.UpdateCardNames(&cardNameDao)
	return error
}
