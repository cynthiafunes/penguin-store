const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  Admin.findOne({ username: username }, function(err, admin) {
    if (err) {
      res.render('login', { error: 'Error del servidor' });
      return;
    }

    if (!admin) {
      res.render('login', { error: 'Usuario no encontrado' });
      return;
    }

    if (admin.password !== password) {
      res.render('login', { error: 'Contraseña incorrecta' });
      return;
    }

    const token = jwt.sign({ 
      username: admin.username 
    }, process.env.JWT_SECRET);

    res.cookie('token', token);
    res.redirect('/dashboard');
  });
});

module.exports = router;