const db = require('../config/database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwtConfig');

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err) => {
    if (err) {
      console.error('Error registering user:', err);
      res.send({ success: false, message: 'Registration failed' });
      return;
    }
    res.send({ success: true, message: 'Registration successful' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.send({ success: false, message: 'Login failed' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.send({ success: true, message: 'Login successful', token, user });
    } else {
      res.send({ success: false, message: 'Invalid credentials' });
    }
  });
};
