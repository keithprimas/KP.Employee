const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;


const db = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: '5ZAkQ*ob&',
      database: 'employees_db'
    }
  );



  db.query('SELECT * FROM departments', function (err, results) {
    console.log(`Server running on port ${PORT}`);
    console.log(err, results);
  });

  function viewDepartments() {
    db.query('SELECT department_name, department_id FROM departments', (err, res) => {
        if (err) throw err;
        console.log('\nDepartments:');
        console.table(res, ['department_name', 'department_id']);
        displayMenu();
    });
}

function viewRoles() {
    db.query('SELECT title, role_id, department_id, salary FROM roles', (err, res) => {
        if (err) throw err;
        console.log('\nRoles:');
        console.table(res);
        displayMenu();
    })
}

function viewEmployees() {
    db.query('SELECT e.employee_id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, e2.first_name AS manager FROM employees e LEFT JOIN employees e2 ON e.manager_id = e2.employee_id JOIN roles r ON e.title = r.role_id JOIN departments d ON r.department_id = d.department_id', (err, res) => {
        if (err) throw err;
        console.log('\nEmployees:');
        console.table(res);
        displayMenu();
    });
}

function viewEmployeesByDepartment() {
    db.query('SELECT department_name FROM departments', (err, departments) => {
        if (err) throw err;

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'selectedDepartment',
                message: 'Select a department to view employees:',
                choices: departments.map((department) => department.department_name),
            },
        ])
        .then((departmentAnswer) => {
            const selectedDepartment = departmentAnswer.selectedDepartment;

            db.query('SELECT e.first_name, e.last_name, r.title, d.department_name AS department FROM employees e JOIN roles r ON e.title = r.role_id JOIN departments d ON r.department_id = d.department_id WHERE d.department_name = ?', selectedDepartment, (err, res) => {
                if (err) throw err;
                console.log(`\nEmployees in the ${selectedDepartment} department:`);
                console.table(res);
                displayMenu();
            });
        });
});
}



function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'Enter the department name:',
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter an ID for this department:',
            }
        ])
        .then((answers) => {
            const { department_name, department_id } = answers;
            const query = 'INSERT INTO departments (department_name, department_id) VALUES (?, ?)';

            db.query(query, [department_name, department_id], (err, res) => {
                if (err) throw err;
                console.log('Department added successfully!');
                displayMenu();
            });
        });
}

function addRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title for this role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for this role:',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter an ID for this role:',
        }
    ])
    .then((answers) => {
        const { title, salary, department_id, role_id } = answers;
        const query = 'INSERT INTO roles (title, salary, department_id, role_id) VALUES (?, ?, ?, ?)';

        db.query(query, [title, salary, department_id, role_id], (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            displayMenu();
        });
    });
}

function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter the role ID for this employee:',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID for this employee:',
        },
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter the ID for this employee:',
        },
    ])
    .then((answers) => {
        const { first_name, last_name, role_id, manager_id, employee_id } = answers;
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id, employee_id) VALUES (?, ?, ?, ?, ?)';

        db.query(query, [first_name, last_name, role_id, manager_id, employee_id], (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            displayMenu();
        });
    });
}



function getEmployeesWithRoles(callback) {
    db.query('SELECT employees.employee_id, employees.first_name, employees.last_name, employees.title, roles.title FROM employees INNER JOIN roles ON employees.title = roles.role_id'
    , (err, res) => {
        if (err) throw err;
        callback(res);
    });
}

function updateEmployeeRole() {
    getEmployeesWithRoles((employees) => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee,
                })),
            },
        ])
        .then((employeeAnswer) => {
            const selectedEmployee = employeeAnswer.employee;

            db.query('SELECT role_id, title FROM roles', (err, roleResults) => {
                if (err) throw err;

            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Select the new role for the employee:',
                    choices: roleResults.map((role) => ({
                        name: role.title,
                        value: role.role_id,
                    })),
                },
            ])
            .then((roleAnswer) => {
                const { newRole } = roleAnswer;
                const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';

                db.query(query, [newRole, selectedEmployee.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    displayMenu();
                });
            });
        });
    });
});
}


function updateEmployeeManager() {
    getEmployeesWithRoles((employees) => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee,
                })),
            },
            {
                type: 'list',
                name: 'newManager',
                message: 'Select the new manager for the employee',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.employee_id,
                })),
            },
        ])
        .then((managerAnswer) => {
            const { newManager} = managerAnswer;
            const selectedEmployee = managerAnswer.employee;

            const query = 'UPDATE employees SET manager_id = ? WHERE employee_id = ?';
            
            db.query(query, [newManager, selectedEmployee.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated successfully!');
                displayMenu();
            });
        });
    });
}



function displayMenu() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'Choose an option',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by department',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'Exit',
            ],
        },
    ])
    .then((answers) => {
        switch (answers.menuChoice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                displayMenu();
                break;
        }
    });
}

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    displayMenu();
});



app.get('/api/departments', (req, res) => {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});


app.get('/api/roles', (req, res) => {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});


app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

  

  