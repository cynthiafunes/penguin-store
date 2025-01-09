const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

router.get('/login', function(req, res) {
    res.render('login', { error: null });
});

router.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

router.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    Admin.findOne({ username: username })
        .then(function(admin) {
            if (!admin || admin.password !== password) {
                return res.render('login', { error: 'Usuario o contraseña incorrectos' });
            }

            let token = jwt.sign(
                { adminId: admin._id },
                process.env.JWT_SECRET
            );

            res.render('dashboard', { token: token });
        })
        .catch(function(error) {
            res.render('login', { error: 'Error del servidor' });
        });
});

module.exports = router;