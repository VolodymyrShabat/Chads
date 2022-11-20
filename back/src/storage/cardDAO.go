package storage

import (
	"context"
	"fmt"
	"log"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type CardDAO struct{}

var (
	tableCard string = "card"
)

func (cc *CardDAO) Create(c *models.Card, cardNameId int) (*models.Card, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return c, err
	}

	_, err = conn.Exec(context.Background(), "INSERT INTO "+tableCard+" (card_number, cvv, type_of_card, currency,"+
		" created_at, expiration_date, isBlocked, account_number_id, card_name_id)"+
		" VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		c.CardNumber, c.Cvv, c.Type, c.Currency, c.CreatedAt,
		c.ExpirationDate, c.IsBlocked, c.AccountNumberId, cardNameId)
	if err != nil {
		return nil, err
	}

	return c, nil
}

func (cc *CardDAO) GetCard(card_number, accountNumber int) (*models.Card, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	c := &models.Card{}
	query := fmt.Sprintf("SELECT * FROM %s WHERE card_number=$1 AND account_number_id=$2", tableCard)
	row := conn.QueryRow(context.Background(), query, card_number, accountNumber)
	err = row.Scan(&c.CardNumber, &c.Cvv, &c.Type, &c.Currency, &c.CreatedAt,
		&c.ExpirationDate, &c.IsBlocked, &c.AccountNumberId, &c.CardNameId)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (cc *CardDAO) GetCards(accountNumber int) ([]*models.Card, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("SELECT * FROM %s WHERE account_number_id=$1", tableCard)
	rows, err := conn.Query(context.Background(), query, accountNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	_ = conn
	cards := make([]*models.Card, 0)
	for rows.Next() {
		c := models.Card{}
		err := rows.Scan(&c.CardNumber, &c.Cvv, &c.Type, &c.Currency, &c.CreatedAt,
			&c.ExpirationDate, &c.IsBlocked, &c.AccountNumberId, &c.CardNameId)
		if err != nil {
			log.Println(err)
			continue
		}
		cards = append(cards, &c)
	}
	return cards, nil
}

func (cc *CardDAO) Delete(id, accountNumber int) (*models.Card, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	card, err := cc.GetCard(id, accountNumber)
	if err != nil {
		return nil, err
	}
	{
		query := fmt.Sprintf("DELETE FROM %s WHERE card_number=$1 AND account_number_id=$2", tableCard)
		_, err := conn.Exec(context.Background(), query, id, accountNumber)
		if err != nil {
			return nil, err
		}
	}
	return card, nil
}

func (cc *CardDAO) BlockCard(id, accountNumber int) (*models.Card, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}

	query := fmt.Sprintf("UPDATE %s SET isBlocked =$3 WHERE card_number=$1 AND account_number_id=$2;", tableCard)
	_, err = conn.Exec(context.Background(), query, id, accountNumber, true)
	if err != nil {
		return nil, err
	}

	card, err := cc.GetCard(id, accountNumber)
	return card, err
}
