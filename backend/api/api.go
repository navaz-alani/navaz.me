package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/navaz-alani/navaz.me/mail"

	"github.com/navaz-alani/dotenv"
	"github.com/navaz-alani/navaz.me/github"
)

// environment variable keys for the `github` component of the API.
const (
	ghUserKey  = "GH_USER"
	ghTokenKey = "GH_TOKEN"
)

// environment variable keys for the `mail` component of the API.
const (
	mailTokenKey = "MAIL_TOKEN"
	mailNameKey  = "MAIL_NAME"
	mailAddrKey  = "MAIL_ADDR"
)

// environment variable keys for the `router` component of the API.
const (
	routerHostKey = "ROUTER_HOST"
	routerPortKey = "ROUTER_PORT"
)

// API is the site's API implementation.
type API struct {
	ghc        github.Client
	mc         *mail.Client
	host, port string
}

// `NewAPI` creates a new API and initializes its components using the given
// `env`. If any required environment variables are not defined, then an error
// is returned, otherwise the returned error is `nil`.
func NewAPI(env *dotenv.Env) (*API, error) {
	// these are the keys which are required to be defined in the environment
	// vairables, `env`
	required := []string{
		// github env var keys
		ghUserKey, ghTokenKey,
		// mail env var keys
		mailTokenKey, mailNameKey, mailAddrKey,
		// router env var keys
		routerHostKey, routerPortKey,
	}
	if undef := env.CheckRequired(required); len(undef) != 0 {
		return nil, fmt.Errorf("variables not defined: %+v", undef)
	}
	api := new(API)
	// initialize GitHub client
	api.ghc = github.NewGQLClient(
		env.Get(ghUserKey), env.Get(ghTokenKey),
	)
	api.mc = mail.NewClient(
		env.Get(mailTokenKey), env.Get(mailNameKey), env.Get(mailAddrKey),
	)
	api.host = env.Get(routerHostKey)
	api.port = env.Get(routerPortKey)
	return api, nil
}

func (api *API) cleanup() {
	api.ghc.Cleanup()
}

func (api *API) Serve() error {
	defer api.cleanup()
	router := mux.NewRouter()

	// configure the router with the API endpoints
	router.HandleFunc("/projects", api.projects)
	router.HandleFunc("/send-mail", api.sendMail)

	return http.ListenAndServe(fmt.Sprintf("%s:%s", api.host, api.port), router)
}

// GET endpoint to obtain a list of GitHub projects.
func (api *API) projects(w http.ResponseWriter, r *http.Request) {
	const endpoint = "/projects"
	if repos, err := api.ghc.GetPinnedRepos(); err != nil {
		http.Error(
			w,
			"["+endpoint+"] GH Client err: "+err.Error(),
			http.StatusInternalServerError,
		)
	} else {
		if err := json.NewEncoder(w).Encode(repos); err != nil {
			http.Error(
				w,
				"["+endpoint+"] response encode err: "+err.Error(),
				http.StatusInternalServerError,
			)
		}
	}
}

// POST endpoint to send an email.
func (api *API) sendMail(w http.ResponseWriter, r *http.Request) {
	const endpoint = "/send-mail"
	var req mail.Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(
			w,
			"["+endpoint+"] request decode err: "+err.Error(),
			http.StatusInternalServerError,
		)
	} else if err := api.mc.Send(&req); err != nil {
		http.Error(
			w,
			"["+endpoint+"] mail send err: "+err.Error(),
			http.StatusInternalServerError,
		)
	}
}
