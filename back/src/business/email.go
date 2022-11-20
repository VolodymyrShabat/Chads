package business

import (
	"github.com/go-gomail/gomail"
)

var (
	sender         = "nazardubneko2@gmail.com"
	senderPassword = "da1618vinci"
)

func (u *UserService) SendEmail(receiver []string, body string) error {

	m := gomail.NewMessage()
	m.SetHeader("From", sender)
	m.SetHeader("To", receiver...)
	m.SetHeader("Subject", "Gomail test subject")
	m.SetBody("text/plain", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, sender, senderPassword)

	//d.TLSConfig = &tls.Config{InsecureSkipVerify: false}

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil

}
