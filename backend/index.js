const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/login');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error conectando a MongoDB:', err));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders'); 

app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', orderRoutes);  

app.listen(3000, () => {
  console.log(`Server running http://localhost:${3000}`);
});