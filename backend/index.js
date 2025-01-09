const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.log('Error conectando a MongoDB:', err);
  });

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});