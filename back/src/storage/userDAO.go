package storage

import (
	"context"
	"fmt"

	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
)

type UserDAO struct{}

var (
	tableName        string = "users"
	totpTable        string = "totp"
	bankAccountTable string = "account_numbers"
)

func (u *UserDAO) Create(user *models.User) (int, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return 0, err
	}
	tx, err := conn.Begin(context.Background())
	if err != nil {
		return 0, err
	}
	var newUserId int
	var newUserBankAccount int
	query := fmt.Sprintf("INSERT INTO %s(phone_number, email, confirmed_email, "+
		"password, secret_question, registration_date) "+
		"VALUES($1, $2, $3, $4, $5, NOW()) RETURNING id", tableName)
	err = tx.QueryRow(context.Background(), query,
		user.Phonenumber, user.Email, user.Confirmed_email, user.Password, user.Secret_question).Scan(&newUserId)

	if err != nil {
		tx.Rollback(context.Background())
		return 0, fmt.Errorf("insert user: %w", err)
	}

	query = "INSERT INTO roles(role_name, user_id) VALUES($1,$2)"
	_, err = tx.Exec(context.Background(), query, "User", newUserId)
	if err != nil {
		tx.Rollback(context.Background())
		return 0, fmt.Errorf("insert user role: %w", err)
	}

	query = fmt.Sprintf("INSERT INTO %s(userid) "+
		"VALUES($1) RETURNING id", bankAccountTable)

	err = tx.QueryRow(context.Background(), query, newUserId).Scan(&newUserBankAccount)
	if err != nil {
		tx.Rollback(context.Background())
		return 0, fmt.Errorf("insert bankAccount: %w", err)
	}
	tx.Commit(context.Background())
	var t TransactionDAO
	err = t.CreateDefaultTransaction(newUserBankAccount)
	if err != nil {
		tx.Rollback(context.Background())
		return 0, fmt.Errorf("insert user (transaction): %w", err)
	}

	return newUserId, nil
}
func (u *UserDAO) Find(phoneNumber string) (*models.User, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	user := &models.User{}
	query := fmt.Sprintf("SELECT id, phone_number, email, confirmed_email, password "+
		"FROM %s WHERE phone_number = $1", tableName)
	err = conn.QueryRow(context.Background(), query, phoneNumber).
		Scan(&user.ID, &user.Phonenumber, &user.Email, &user.Confirmed_email, &user.Password)
	if err != nil {
		return nil, fmt.Errorf("select user by phone number: %w", err)
	}
	return user, nil
}
func (u *UserDAO) FindById(id int) (*models.User, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return nil, err
	}
	user := &models.User{}
	query := fmt.Sprintf("SELECT id, phone_number, password "+
		"FROM %s WHERE id = $1", tableName)
	err = conn.QueryRow(context.Background(), query, id).
		Scan(&user.ID, &user.Phonenumber, &user.Password)
	if err != nil {
		return nil, fmt.Errorf("select user by id: %w", err)
	}
	return user, nil
}

func (u *UserDAO) AddTOTPSecret(phoneNumber string, totpSecret string) error {
	conn, err := GetConnection()

	defer conn.Close(context.Background())
	if err != nil {
		return err
	}

	query := fmt.Sprintf("INSERT INTO %s(phone_number, totp_secret) VALUES($1, $2)", totpTable)
	_, err = conn.Exec(context.Background(), query, phoneNumber, totpSecret)
	if err != nil {
		return fmt.Errorf("insert totp secret: %w", err)
	}
	return nil
}

func (u *UserDAO) GetTOTPSecret(phoneNumber string) (string, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return "", err
	}
	var totpSecret string
	query := fmt.Sprintf("SELECT totp_secret FROM %s WHERE phone_number = $1", totpTable)
	err = conn.QueryRow(context.Background(), query, phoneNumber).Scan(&totpSecret)
	if err != nil {
		return "", fmt.Errorf("select totp secret: %w", err)
	}
	return totpSecret, nil
}

func IsUserAdmin(userId int) (bool, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return false, err
	}

	var roleName string
	err = conn.QueryRow(context.Background(), "SELECT role_name FROM roles WHERE user_id = $1", userId).
		Scan(&roleName)

	return roleName == "admin", err
}

func (u *UserDAO) GetUserRole(userId uint64) (string, error) {
	var role string
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return "", err
	}
	row := conn.QueryRow(context.Background(), "SELECT role_name FROM roles WHERE user_id=$1", userId)
	err = row.Scan(&role)
	if err != nil {
		return "", err
	}
	return role, nil
}
func (u *UserDAO) GetUserPhoneNumber(userId int) (string, error) {
	conn, err := GetConnection()
	defer conn.Close(context.Background())
	if err != nil {
		return "", err
	}
	var phoneNumber string
	query := fmt.Sprintf("SELECT phone_number FROM %s WHERE id = $1", tableName)
	err = conn.QueryRow(context.Background(), query, userId).Scan(&phoneNumber)
	if err != nil {
		return "", fmt.Errorf("select phone number: %w", err)
	}
	return phoneNumber, nil
}
