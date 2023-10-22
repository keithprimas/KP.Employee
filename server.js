const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;


const db = mysql.createConnection(
  {
    host: 'localhost',
  
    user: 'root',
   
    password: '5ZAkQ*ob&',
    database: 'employee_db'
  }
  
  );




  db.query('SELECT * FROM department', function (err, results) {
    console.log(`Server running on port ${PORT}`);
    console.log(err, results);
  });


/*

  */
  

  