package storage

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v4"
)

var (
	connection *pgx.Conn
)

func GetConnection() (*pgx.Conn, error) {
	if connection != nil {
		return connection, nil
	}
	conf, err := pgx.ParseConfig("postgres://qoolapua:MBYpiZRjsrLeIEGbtGqu-DlBWbzLyJow@tai.db.elephantsql.com/qoolapua")
	if err != nil {
		return nil, err
	}
	conn, err := pgx.ConnectConfig(context.Background(), conf)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return conn, nil
}
