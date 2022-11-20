package api

import (
	"net/http"

	"github.com/ServicesKursova/UserMicroservice/src/api/handler"
	"github.com/ServicesKursova/UserMicroservice/src/api/middleware"
	"github.com/ServicesKursova/UserMicroservice/src/app"
	"github.com/gin-gonic/gin"
)

type Config struct {
	Port string
	Env  string
}

type API struct {
	*http.Server

	handlers *Handlers
}

type Handlers struct {
	auth        *handler.Auth
	deposit     *handler.Deposit
	card        *handler.Card
	transaction *handler.Transaction
	user        *handler.UserAccount
}

func New(conf *Config, services *app.Services) *API {

	engine := gin.Default()
	engine.Use(middleware.CORSMiddleware())
	api := API{
		handlers: &Handlers{
			auth:        handler.NewAuth(services.User),
			deposit:     handler.NewDeposit(services.Deposit),
			card:        handler.NewCard(services.Card),
			transaction: handler.NewTransactionHandler(services.Transaction),
			user:        handler.NewUserAccountHandler(services.User),
		},
	}

	api.InitRoutes(engine)

	api.Server = &http.Server{
		Handler: engine,
		Addr:    ":" + conf.Port,
	}

	return &api
}

func (a *API) InitRoutes(engine *gin.Engine) {
	h := a.handlers
	engine.POST("/refresh", h.auth.RefreshToken)
	engine.POST("/jwt-test", middleware.JWTverify(), h.auth.TestJWTRoute)
	auth := engine.Group("/auth")
	{
		auth.POST("/sign-in", h.auth.SignIn)
		auth.POST("/sign-up", h.auth.SignUp)
		auth.POST("/log-out", h.auth.LogOut)
		auth.POST("/qr-code", h.auth.GenerateQRConfirmPhone)
		auth.POST("/confirm-phone", h.auth.ConfirmPhone)
		auth.POST("/confirm-email", h.auth.SendEmail)
	}
	api := engine.Group("/api")
	{
		deposits := api.Group("/deposits")
		{
			deposits.GET("/", middleware.JWTverify(), h.deposit.GetAllDeposits)
			deposits.POST("/", middleware.JWTverify(), h.deposit.CreateDeposit)
			deposits.GET("/:id/:depId", middleware.JWTverify(), h.deposit.GetDepositById)
			deposits.GET("/:id", middleware.JWTverify(), h.deposit.GetAllDepositsByBankAcc)
			deposits.PUT("/:id/:depId", middleware.JWTverify(), h.deposit.UpdateDepositById)
			deposits.DELETE("/:id/:depId", middleware.JWTverify(), h.deposit.DeleteDepositById)
		}

		users := api.Group("/user")
		{
			users.GET("/accounts", middleware.JWTverify(), h.user.GetBankAccountsByUserId)
			users.GET("/accounts/:id", middleware.JWTverify(), h.user.GetAccountHistoryByBankAccountId)
			users.GET("/account/:id", middleware.JWTverify(), h.user.GetBankAccountByAccountId)
			users.PUT("/accounts/updateLimit", middleware.JWTverify(), h.user.UpdateAccountTransactionLimit)
			users.GET("/info", middleware.JWTverify(), h.user.GetUserInformation)
		}
		{
			transactions := api.Group("/transactions")
			{
				transactions.POST("/confirm", middleware.JWTverify(), h.transaction.ConfirmTransaction)
				transactions.POST("/", middleware.JWTverify(), h.transaction.TransferFundsFromCardToCard)
			}
		}
	}

	{
		cards := api.Group("/cards")
		{
			cards.GET("/", middleware.JWTverify(), h.card.GetCards)
			cards.POST("/", middleware.JWTverify(), h.card.CreateCard)
			cards.GET("/:id", middleware.JWTverify(), h.card.GetCard)
			cards.DELETE("/:id", middleware.JWTverify(), h.card.DeleteCard)
			cards.PUT("/:id/block", middleware.JWTverify(), h.card.BlockCard)
			cards.POST("/cardNames", middleware.JWTverify(), h.card.CreateCardName)
			cards.GET("/cardNames", middleware.JWTverify(), h.card.GetCardNames)
			cards.PUT("/cardNames/", middleware.JWTverify(), h.card.UpdateCardNames)
		}
	}

}
