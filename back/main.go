package main

import (
	"os"

	"github.com/ServicesKursova/UserMicroservice/src/api"
	"github.com/ServicesKursova/UserMicroservice/src/app"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	zap.ReplaceGlobals(logger)
	services := app.CreateServices()

	port := "8080"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}
	httpServer := api.New(&api.Config{Port: port}, services)
	zap.S().Fatal(httpServer.ListenAndServe())
}
