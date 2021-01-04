package github

import (
	"sync"
	"time"
)

// `cacheLifetime` is the maximum amount of time that a piece of data lives in
// the cache.
const cacheLifetime = time.Minute

type dataKey = string

// keys of the data managed by the `cache`
const (
	pinnedReposKey dataKey = "pinned-repos"
)

// `cache` is a cache for the GitHub client. It caches key pieces of data needed
// by the client. A value added to the cache is valid for `cacheLifetime` amount
// of time, after which it becomes stale and will not be returned on a lookup.
type cache struct {
	mu        *sync.Mutex
	pinned    []Repository
	timeAdded map[dataKey]time.Time
}

func newCache() *cache {
	return &cache{
		mu:        &sync.Mutex{},
		timeAdded: make(map[dataKey]time.Time),
	}
}

func (c *cache) getPinnedRepos() []Repository {
	c.mu.Lock()
	defer c.mu.Unlock()
	if t, ok := c.timeAdded[pinnedReposKey]; !ok {
		// no initial value has been set
		return nil
	} else {
		if time.Since(t) > cacheLifetime {
			// value has stayed in the cache for a long time (stale); don't return it;
			// lose ref to cached value;
			c.pinned = nil
		}
		return c.pinned
	}
}

func (c *cache) setPinnedRepos(repos []Repository) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.timeAdded[pinnedReposKey] = time.Now()
	c.pinned = repos
}
