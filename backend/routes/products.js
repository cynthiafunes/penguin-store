const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const verificarToken = require('../middleware/auth');

router.get('/products', verificarToken, function(req, res) {
    Product.find()
        .then(function(products) {
            res.render('products/list', { 
                products: products,
                query: req.query 
            });
        })
        .catch(function(error) {
            res.send('Error al cargar productos');
        });
});

router.get('/products/create', verificarToken, function(req, res) {
    res.render('products/create', { 
        query: req.query 
    });
});

router.post('/products', verificarToken, function(req, res) {
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    });

    product.save()
        .then(function() {
            res.redirect('/products?token=' + req.query.token);
        })
        .catch(function(error) {
            res.send('Error al guardar producto');
        });
});

router.get('/products/edit/:id', verificarToken, function(req, res) {
    Product.findById(req.params.id)
        .then(function(product) {
            res.render('products/edit', { 
                product: product,
                query: req.query 
            });
        })
        .catch(function(error) {
            res.send('Error al cargar producto');
        });
});

router.post('/products/edit/:id', verificarToken, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    })
    .then(function() {
        res.redirect('/products?token=' + req.query.token);
    })
    .catch(function(error) {
        res.send('Error al actualizar producto');
    });
});

router.get('/products/delete/:id', verificarToken, function(req, res) {
    Product.findByIdAndDelete(req.params.id)
        .then(function() {
            res.redirect('/products?token=' + req.query.token);
        })
        .catch(function(error) {
            res.send('Error al eliminar producto');
        });
});

module.exports = router;