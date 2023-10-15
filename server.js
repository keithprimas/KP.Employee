const mysql = require('mysql2');

const PORT = process.env.PORT || 3306;


const db = mysql.createConnection(
  {
    host: 'localhost',
  
    user: 'root',
   
    password: '5ZAkQ*ob&',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.query('SELECT * FROM department_names', function (err, results) {
    console.log(`Server running on port ${PORT}`);
  });
  

  