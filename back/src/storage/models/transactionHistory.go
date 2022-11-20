package models

import "time"

type TransactionHistory struct {
	Remittance            float64   `db:"Remittance"`
	ReceiverId            int       `db:"Receiver_id"`
	SenderId              int       `db:"Sender_id"`
	DateOfTransaction     time.Time `db:"Date_of_transaction"`
	MoneyAfterTransaction float64   `db:"MoneyAfterTransaction"`
	Message               string
	Comment               string
}
