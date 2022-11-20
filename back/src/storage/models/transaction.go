package models

type Transaction struct {
	Remittance float64 `db:"Remittance"`
	ReceiverId int     `db:"Receiver_id"`
	SenderId   int     `db:"Sender_id"`
	Confirmed  bool
	Message    string
	Comment    string
}
