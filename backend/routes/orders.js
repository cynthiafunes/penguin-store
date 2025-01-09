const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const verificarToken = require('../middleware/auth');

router.get('/orders', verificarToken, function(req, res) {
    Order.find()
        .then(function(orders) {
            res.render('orders/list', { 
                orders: orders,
                query: req.query 
            });
        })
        .catch(function(error) {
            res.send('Error al cargar pedidos');
        });
});

router.get('/orders/:id', verificarToken, function(req, res) {
    Order.findById(req.params.id)
        .then(function(order) {
            res.render('orders/detail', { 
                order: order,
                query: req.query 
            });
        })
        .catch(function(error) {
            res.send('Error al cargar el pedido');
        });
});

module.exports = router;