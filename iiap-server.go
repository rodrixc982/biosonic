package main

import (
	"fmt"
	"net"
	"net/http"
	"os/exec"
	"strings"
	"time"
)

func main() {
	serverAddress := "192.168.17.104:8080" // Cambia esto a la dirección y puerto que desees

	changeHeaderThenServe := func(h http.Handler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			// Obtén la dirección IP del cliente
			ip, _, _ := net.SplitHostPort(r.RemoteAddr)

			// Si la solicitud proviene de 127.0.0.1:8080, simplemente responde con estado HTTP 200 OK y no hagas nada más.
			if ip == "127.0.0.1" && r.URL.Port() == "8080" {
				w.WriteHeader(http.StatusOK)
				return
			}

			w.Header().Add("Access-Control-Allow-Origin", "*")

			if strings.Contains(r.URL.Path, ".wasm") {
				w.Header().Add("Content-Type", "application/wasm")
			}

			if strings.Contains(r.URL.Path, ".js") {
				var epoch = time.Unix(0, 0).Format(time.RFC1123)
				var noCacheHeaders = map[string]string{
					"Expires":         epoch,
					"Cache-Control":   "no-cache, private, max-age=0",
					"Pragma":          "no-cache",
					"X-Accel-Expires": "0",
				}

				for k, v := range noCacheHeaders {
					w.Header().Set(k, v)
				}
			}

			fmt.Println("Req:", r.Host, r.URL.Path)
			h.ServeHTTP(w, r)
		}
	}

	go func() {
		cmd := exec.Command("open", "-a", "Google Chrome", fmt.Sprintf("http://%s/", serverAddress))
		cmd.Output()
	}()

	fmt.Printf("\nListening on http://%s\n\n", serverAddress)
	http.Handle("/", changeHeaderThenServe(http.FileServer(http.Dir("."))))
	panic(http.ListenAndServe(serverAddress, nil))
}
