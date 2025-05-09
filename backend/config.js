const mysql = require('mysql2');

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // default MySQL username in XAMPP
  password: '', // default password is empty
  database: 'clinic', // replace with your database name
});

module.exports = pool.promise(); // This returns a promise-based API
