package mail

import (
	"fmt"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type Client struct {
	client    *sendgrid.Client
	baseEmail *mail.Email
}

type Request struct {
	Name string `json:"name"`
	Addr string `json:"addr"`
	Subj string `json:"subj"`
	Body string `json:"body"`
}

func NewClient(key, name, addr string) *Client {
	return &Client{
		client:    sendgrid.NewSendClient(key),
		baseEmail: mail.NewEmail(name, addr),
	}
}

func (c *Client) Send(mailReq *Request) error {
	from := mail.NewEmail(mailReq.Name, mailReq.Addr)
	subject := fmt.Sprintf("[%s] %s", mailReq.Name, mailReq.Subj)
	message := mail.NewSingleEmail(from, subject, c.baseEmail, "?", mailReq.Body)
	_, err := c.client.Send(message)
	return err
}
