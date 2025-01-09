const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    res.redirect('/login');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.redirect('/login');
      return;
    }
    req.admin = decoded;
    next();
  });
}

module.exports = checkAuth;