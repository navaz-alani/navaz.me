package dos

import (
	"fmt"
	"net"
	"net/http"
	"time"
)

type ipQry struct {
	ip  string
	ret chan<- error
}

// DOSGuard rate limits requests based on their IP addresses.
type DOSGuard struct {
	ips      map[string]int
	ipStream chan ipQry
	done     chan struct{}
	maxQry   int
	dur      time.Duration
}

func NewDOSGuard(maxQry int, dur time.Duration) *DOSGuard {
	dg := &DOSGuard{
		ips:      make(map[string]int),
		ipStream: make(chan ipQry),
		done:     make(chan struct{}),
		maxQry:   maxQry,
		dur:      dur,
	}
	// only this routine accesses the `ips` map field;
	// this prevents lock contention for `ips` map in cases where many requests
	// are coming in;
	go func() {
		ticker := time.NewTicker(dg.dur)
		for {
			select {
			case <-dg.done:
				ticker.Stop()
				break
			case qry := <-dg.ipStream: // this does not read from `dg.ipStream` after `dg.maxQry + 1` reads
				dg.ips[qry.ip] += 1
				if dg.ips[qry.ip] >= dg.maxQry {
					qry.ret <- fmt.Errorf("dos guard: %s IP blocked - too many queries", qry.ip)
				} else {
					qry.ret <- nil
				}
			case <-ticker.C:
				// reset `ips`
				dg.ips = make(map[string]int)
			}
		}
	}()
	return dg
}

func (dg *DOSGuard) Guard(r *http.Request) error {
	if ip, err := FromRequest(r); err != nil {
		return fmt.Errorf("dos guard err: failed to parse sender IP - won't serve")
	} else {
		ret := make(chan error)
		// the following send is blocking for some reason after `dg.maxQry + 1` requests
		dg.ipStream <- ipQry{
			ip:  ip,
			ret: ret,
		}
		fmt.Println("sent qry")
		return <-ret
	}
}

func (dg *DOSGuard) Cleanup() {
	close(dg.done)
}

// FromRequest extracts the user IP address from req, if present.
// From: https://blog.golang.org/context/userip/userip.go
func FromRequest(req *http.Request) (string, error) {
	ip, _, err := net.SplitHostPort(req.RemoteAddr)
	if err != nil {
		return "", fmt.Errorf("userip: %q is not IP:port", req.RemoteAddr)
	}
	userIP := net.ParseIP(ip)
	if userIP == nil {
		return "", fmt.Errorf("userip: %q is not IP:port", req.RemoteAddr)
	}
	return userIP.String(), nil
}
