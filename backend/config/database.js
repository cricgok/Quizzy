const mysql = require('mysql2');
const url = require('url');

const dbUrl = process.env.DATABASE_URL;
const parsedUrl = url.parse(dbUrl);
const [username, password] = parsedUrl.auth.split(':');

const db = mysql.createConnection({
  host: parsedUrl.hostname,
  port: parsedUrl.port,
  user: username,
  password: password,
  database: parsedUrl.pathname.split('/')[1],
  connectTimeout: 30000 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.code, err.fatal, err.message);
    return;
  }
  console.log('Connected to database');
});

module.exports = db;
