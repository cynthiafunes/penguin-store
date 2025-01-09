package main

import (
    "html/template"
    "log"
    "net/http"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.mongodb.org/mongo-driver/bson"
    "context"
    "strconv"
)

type Product struct {
    Name        string  `bson:"name"`
    Description string  `bson:"description"`
    Price       float64 `bson:"price"`
    Stock       int     `bson:"stock"`
}

type Order struct {
    ProductName string  `bson:"productName"`
    CustomerName string `bson:"customerName"`
    Quantity    int     `bson:"quantity"`
    Total       float64 `bson:"total"`
}

func main() {
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        log.Fatal(err)
    }

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        showProducts(w, r, client)
    })

    http.HandleFunc("/order", func(w http.ResponseWriter, r *http.Request) {
        if r.Method == http.MethodGet {
            showOrderForm(w, r, client)
        } else if r.Method == http.MethodPost {
            createOrder(w, r, client)
        }
    })

    log.Println("Servidor corriendo en http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func showProducts(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
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

    tmpl.ExecuteTemplate(w, "layout", struct{ Products []Product }{Products: productos})
}

func showOrderForm(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
    productName := r.URL.Query().Get("productName")
    
    tmpl := template.Must(template.ParseFiles(
        "templates/layout.html", 
        "templates/order.html",
    ))

    tmpl.ExecuteTemplate(w, "layout", struct{ ProductName string }{ProductName: productName})
}

func createOrder(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
    productName := r.FormValue("productName")
    customerName := r.FormValue("customerName")
    quantity, _ := strconv.Atoi(r.FormValue("quantity"))

    collection := client.Database("penguin-store").Collection("products")
    var product Product
    err := collection.FindOne(context.TODO(), bson.M{"name": productName}).Decode(&product)
    if err != nil {
        http.Error(w, "Producto no encontrado", http.StatusNotFound)
        return
    }

    total := product.Price * float64(quantity)

    order := Order{
        ProductName:   productName,
        CustomerName:  customerName,
        Quantity:      quantity,
        Total:         total,
    }

    _, err = client.Database("penguin-store").Collection("orders").InsertOne(context.TODO(), order)
    if err != nil {
        http.Error(w, "Error al crear pedido", http.StatusInternalServerError)
        return
    }

    http.Redirect(w, r, "/", http.StatusSeeOther)
}