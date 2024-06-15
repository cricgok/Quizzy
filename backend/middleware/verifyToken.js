const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Split to handle "Bearer <token>"
  if (!token) {
    return res.status(403).send({ success: false, message: 'No token provided' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
