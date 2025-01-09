package main

import (
    "html/template"
    "log"
    "net/http"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.mongodb.org/mongo-driver/bson"
    "context"
)

type Product struct {
    Name        string  `bson:"name"`
    Description string  `bson:"description"`
    Price       float64 `bson:"price"`
    Stock       int     `bson:"stock"`
}

type PageData struct {
    Products []Product
}

func main() {
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        log.Fatal(err)
    }

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        ShowProducts(w, r, client)
    })

    log.Println("Servidor corriendo en http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func ShowProducts(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
    collection := client.Database("penguin-store").Collection("products")

    cursor, err := collection.Find(context.TODO(), bson.M{})
    if err != nil {
        http.Error(w, "Error al buscar productos", http.StatusInternalServerError)
        return
    }

    var productos []Product
    if err = cursor.All(context.TODO(), &productos); err != nil {
        http.Error(w, "Error al procesar productos", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles(
        "templates/layout.html",
        "templates/products.html",
    ))

    tmpl.ExecuteTemplate(w, "layout", PageData{Products: productos})
}