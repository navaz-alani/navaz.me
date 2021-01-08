package api

import (
	"encoding/json"
	"net/http"

	"github.com/navaz-alani/navaz.me/mail"
)

func (api *API) sendMailTest(w http.ResponseWriter, r *http.Request) {
	const endpoint = "/send-mail-test"
	var req mail.Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(
			w,
			"["+endpoint+"] request decode err: "+err.Error(),
			http.StatusInternalServerError,
		)
	}
}
