const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const verificarToken = require('../middleware/auth');


router.get('/login', function(req, res) {
    res.render('login', { error: null });
});

router.get('/dashboard', verificarToken, function(req, res) {
    const token = req.headers.authorization || req.query.token;
    res.render('dashboard', { token: token });
});

const crypto = require('crypto');

router.post('/login', function(req, res) {
    const hashedPassword = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex');

    Admin.findOne({ 
        username: req.body.username,
        password: hashedPassword 
    })
    .then(function(admin) {
        if (!admin) {
            return res.render('login', { error: 'Credenciales inválidas' });
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