package business

import (
	"fmt"

	"github.com/ServicesKursova/UserMicroservice/src/storage"
	"github.com/ServicesKursova/UserMicroservice/src/storage/models"
	"github.com/skip2/go-qrcode"
	"github.com/xlzd/gotp"
)

type UserService struct {
	userDAO storage.UserDAO
}

func NewUserService(userDAO storage.UserDAO) *UserService {
	return &UserService{
		userDAO: userDAO,
	}
}

func (u *UserService) RegisterUser(newUser *models.User) error {
	user, _ := u.userDAO.Find(newUser.Phonenumber)
	if user != nil {
		return fmt.Errorf("user already exists")
	}
	err := newUser.HashPassword()
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}
	newUser.Confirmed_email = true
	_, err = u.userDAO.Create(newUser)
	if err != nil {
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

func (u *UserService) LoginUser(phoneNumber, password string) (*models.User, error) {
	user, err := u.userDAO.Find(phoneNumber)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	err = user.CheckPassword(password)
	if err != nil {
		return nil, fmt.Errorf("wrong password: %w", err)
	}
	return user, nil
}

func (u *UserService) GenerateQRCode(phoneNumber string) ([]byte, error) {
	secretTotp := gotp.RandomSecret(20)
	totp := gotp.NewDefaultTOTP(secretTotp)
	str := totp.ProvisioningUri("Bank A", fmt.Sprintf("phone: %s", phoneNumber))
	err := u.userDAO.AddTOTPSecret(phoneNumber, secretTotp)
	if err != nil {
		return nil, err
	}
	qr, err := qrcode.Encode(str, qrcode.Medium, 512)
	if err != nil {
		return nil, err
	}
	return qr, nil
}

func (u *UserService) ConfrimPhone(phoneNumber string, code string) error {
	secretTotp, err := u.userDAO.GetTOTPSecret(phoneNumber)
	if err != nil {
		return err
	}
	totp := gotp.NewDefaultTOTP(secretTotp)
	if code == totp.Now() {
		return nil
	}
	return fmt.Errorf("wrong code")
}

func (u *UserService) GetAccountHistoryByBankAccountId(bankAccountId int) ([]*models.TransactionHistory, error) {
	_, array, err := storage.GetUserBalance(bankAccountId)
	if err != nil {
		return nil, err
	}
	return array, nil
}

func (u *UserService) GetAccountAmountByBankAccountId(bankAccountId int) (float64, error) {
	amount, _, err := storage.GetUserBalance(bankAccountId)
	if err != nil {
		return 0, err
	}
	return amount, nil
}

func (u *UserService) GetBankAccountsByUserId(userId int) ([]*models.AccountNumber, error) {
	return storage.GetBankAccountsByUserId(userId)
}

func (u *UserService) GetBankAccountByAccountId(accountId, userId int) (*models.AccountNumber, error) {
	return storage.GetBankAccountByAccountId(accountId, userId)
}

func (u *UserService) UpdateAccountTransactionLimit(userId, bankAccountId int, newLimit float64) error {
	_, err := storage.GetBankAccountByAccountId(bankAccountId, userId)
	if err != nil {
		return err
	}
	err = storage.UpdateTransactionLimit(bankAccountId, newLimit)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) GetUserInformation(userId int) (*models.User, error) {
	user, err := u.userDAO.FindById(userId)
	if err != nil {
		return nil, fmt.Errorf("user already exists")
	}
	return user, nil
}
