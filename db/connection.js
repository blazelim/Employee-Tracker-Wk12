const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL usernaem
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'employeeDB'
    },
    console.log('Connected to the employee database.')
);


module.exports = db;