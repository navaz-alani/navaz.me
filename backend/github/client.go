package github

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

type Repository struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Client interface {
	GetPinnedRepos() ([]Repository, error)
	Cleanup()
}

type GQLClient struct {
	user      string
	authToken string
	cache     *cache
	apiRoot   *url.URL
}

// `NewGQLClient` returns a new GitHub Client configured to make requests to the
// GitHub GraphQL V4 API with the `login` as `user` and the authorization token
// as `token`.
// This client has a cache for requested values which become stale in
// `cacheLifetime` amount of time. Therefore, returned values may be no older
// than `cacheLifetime` old.
func NewGQLClient(user, token string) Client {
	apiRoot, _ := url.Parse("https://api.github.com/graphql")
	return &GQLClient{
		user:      user,
		authToken: token,
		cache:     newCache(),
		apiRoot:   apiRoot,
	}
}

// `Cleanup` performs any cleanup needed by the `GQLClient`.
func (c *GQLClient) Cleanup() {}

func (c *GQLClient) newReq(qry string) *http.Request {
	return &http.Request{
		Method: "POST",
		URL:    c.apiRoot,
		Header: map[string][]string{
			"Authorization": {"token " + c.authToken},
		},
		Body: ioutil.NopCloser(strings.NewReader(qry)),
	}
}

func (c *GQLClient) GetPinnedRepos() ([]Repository, error) {
	// if a cached value exists, return that
	if repos := c.cache.getPinnedRepos(); repos != nil {
		return repos, nil
	}
	// cached value doesn't exist - perform request
	qry := fmt.Sprintf(`{
    "query":"{user(login: \"%s\") {pinnedItems(first: 6, types: REPOSITORY) {nodes {... on Repository {name description}}}}}"
  }`, c.user)
	var ghResponse struct {
		Message string `json:"message"`
		Data    struct {
			User struct {
				PinnedItems struct {
					Nodes []Repository `json:"nodes"`
				} `json:"pinnedItems"`
			} `json:"user"`
		} `json:"data"`
	}
	if resp, err := http.DefaultClient.Do(c.newReq(qry)); err != nil {
		return nil, err
	} else if err := json.NewDecoder(resp.Body).Decode(&ghResponse); err != nil {
		return nil, err
	}
	repos := ghResponse.Data.User.PinnedItems.Nodes
	// update cache with the new value
	c.cache.setPinnedRepos(repos)
	return repos, nil
}
