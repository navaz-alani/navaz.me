package github

import (
	"sync"
	"time"
)

// `cacheLifetime` is the maximum amount of time that a piece of data lives in
// the cache.
const cacheLifetime = time.Minute

// keys of the data managed by the `cache`
const (
	pinnedReposKey = "pinned-repos"
)

type cache struct {
	mu        *sync.RWMutex
	pinned    []Repository
	timeAdded map[string]time.Time
}

func newCache() *cache {
	return &cache{
		mu:        &sync.RWMutex{},
		timeAdded: make(map[string]time.Time),
	}
}

func (c *cache) getPinnedRepos() []Repository {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if t, ok := c.timeAdded[pinnedReposKey]; !ok {
		// no initial value has been set
		return nil
	} else {
		if time.Since(t) > cacheLifetime {
			// value has stayed in the cache for a long time (stale); don't return it
			return nil
		} else {
			// cached value is valid; return it
			return c.pinned
		}
	}
}

func (c *cache) setPinnedRepos(repos []Repository) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.timeAdded[pinnedReposKey] = time.Now()
	c.pinned = repos
}
