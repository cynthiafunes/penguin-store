const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    let token = req.headers.authorization || req.query.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}

module.exports = verificarToken;