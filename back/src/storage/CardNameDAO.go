package storage

import (
	"context"
	"fmt"
	"log"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type CardNameDAO struct{}

var (
	tableCardName string = "card_names"
)

func (cc *CardNameDAO) Create(cardName *models.Card_name) (*models.Card_name, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return cardName, err
	}

	_, err = conn.Exec(context.Background(), "INSERT INTO "+tableCardName+" (id, card_name, fee)"+
		" VALUES($1, $2, $3)", cardName.Id, cardName.Card_name, cardName.Fee)

	if err != nil {
		return cardName, err
	}

	return cardName, nil
}

func (cc *CardNameDAO) GetCardName(id int) (*models.Card_name, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	c := &models.Card_name{}
	query := fmt.Sprintf("SELECT * FROM %s WHERE Id=$1", tableCardName)
	row := conn.QueryRow(context.Background(), query, id)
	err = row.Scan(&c.Id, &c.Card_name, &c.Fee)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (cc *CardNameDAO) GetAll() ([]*models.Card_name, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("SELECT * FROM %s", tableCardName)
	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	_ = conn
	cards := make([]*models.Card_name, 0)
	for rows.Next() {
		c := models.Card_name{}
		err := rows.Scan(&c.Id, &c.Card_name, &c.Fee)
		if err != nil {
			log.Println(err)
			continue
		}
		cards = append(cards, &c)
	}
	return cards, nil
}

func (cc *CardNameDAO) UpdateCardNames(cardName *models.Card_name) (*models.Card_name, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}

	{
		query := fmt.Sprintf("UPDATE %s SET card_name=$2, fee=$3 WHERE Id=$1", tableCardName)
		_, err = conn.Exec(context.Background(), query, cardName.Id, cardName.Card_name, cardName.Fee)

		if err != nil {
			return nil, err
		}
	}

	card, err := cc.GetCardName(cardName.Id)
	if err != nil {
		return nil, err
	}
	return card, nil
}
