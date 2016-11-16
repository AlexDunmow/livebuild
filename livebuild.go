package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"ninjadojo/ninjarouter"
	"os"
	"path/filepath"
	"strings"
)

func Serve(h http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r)
	})
}

type Node struct {
	Name     string           `json:"name"`
	Type     string           `json:"type"`
	FileType string           `json:"fileType"`
	Path     string           `json:"path"`
	Children map[string]*Node `json:"children,omitempty"`
}

func getParent(parts []string, root *Node) *Node {
	var ok bool
	var xnode *Node
	node := root
	xnode = node

	for _, p := range parts {
		if node, ok = node.Children[p]; !ok {
			break
		}
		xnode = node
	}

	return xnode
}

func printFile(path string, info os.FileInfo, err error, root *Node) error {
	if path == "." || path == "./public/" {
		return nil
	}
	fi, err := os.Stat(path)

	path = strings.TrimPrefix(path, "public/")
	parts := strings.Split(path, "/")

	parent := getParent(parts, root)
	ftype := "directory"
	filetype := ""

	log.Println("NAME:", parts[len(parts)-1], path)
	name := parts[len(parts)-1]
	if !fi.IsDir() {
		ftype = "file"
		filetype = strings.TrimPrefix(filepath.Ext(path), ".")
	}

	newNode := Node{
		Name:     name,
		Type:     ftype,
		FileType: filetype,
		Path:     path,
		Children: make(map[string]*Node),
	}

	log.Println(name)
	log.Println(parent)

	parent.Children[name] = &newNode

	if err != nil {
		log.Print(err)
		return nil
	}
	fmt.Println(path)
	return nil
}

func files(w http.ResponseWriter, r *http.Request) {
	var root = Node{Name: "string", Type: "root", Children: make(map[string]*Node)}
	err := filepath.Walk("./public/", func(path string, info os.FileInfo, err error) error {
		return printFile(path, info, err, &root)
	})

	response, err := json.Marshal(root.Children)

	if err != nil {
		log.Fatal(err)
	}
	w.Write(response)
}

func cleanPath(path, prefix string) string {
	path = strings.TrimPrefix(path, prefix)
	path = strings.Replace(path, "..", "", -1)
	path = "./public" + path

	return path
}

func deleteFile(w http.ResponseWriter, r *http.Request) {
	path := cleanPath(r.URL.Path, "/build/delete")

	err := os.Remove(path)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	files(w, r)
	return
}

func getFile(w http.ResponseWriter, r *http.Request) {
	path := cleanPath(r.URL.Path, "/build/get")

	f, err := os.Open(path)

	if err == nil {
		defer f.Close()
		w.Header().Add("Content Type", "text/plain")

		br := bufio.NewReader(f)
		br.WriteTo(w)
	} else {
		w.WriteHeader(404)
	}

}

func saveFile(w http.ResponseWriter, r *http.Request) {

	path := r.URL.Path
	log.Println(path)

	path = strings.TrimPrefix(path, "/build/save")
	path = "./public" + path

	fmt.Println(r.FormValue("code"), "CODE")

	code := []byte(r.FormValue("code"))

	if err := ioutil.WriteFile(path, code, 0644); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	rtr := ninjarouter.New()
	rtr.GET("/build/files", files)
	rtr.GET("/build/get/*", getFile)
	rtr.DELETE("/build/delete/*", deleteFile)
	rtr.POST("/build/save/*", saveFile)
	rtr.GET("/build/*", Serve(http.StripPrefix("/build", http.FileServer(http.Dir("./frontend/livebuild/public/")))))
	rtr.GET("/*", Serve(http.FileServer(http.Dir("./public/"))))
	fmt.Println("Listening on port 9000...")
	if err := rtr.Listen(":9000"); err != nil {
		panic(err)
	}
}
