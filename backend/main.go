package main

import (
	"log"

	"github.com/navaz-alani/navaz.me/api"

	"github.com/navaz-alani/dotenv"
)

func main() {
	var env *dotenv.Env
	var err error
	env, err = dotenv.Load(".env", true)
	if err != nil {
		log.Fatalln("env vars load err: " + err.Error())
	}
	if apiImpl, err := api.NewAPI(env); err != nil {
		log.Fatalln("api init err: " + err.Error())
	} else {
		log.Fatalln(apiImpl.Serve())
	}
}
