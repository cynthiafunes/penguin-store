const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerName: String,
    address: String,
    products: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: String,
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', orderSchema);