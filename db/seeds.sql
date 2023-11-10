INSERT INTO departments (department_id, department_name)
VALUES 
(1, "Orthopedic Surgery"),
(2, "Radiology");

INSERT INTO roles (role_id, title, salary, department_id)
VALUES 
(1, "Radiologist", 434000, 2),
(2, "Orthopedic Surgeon", 287000, 1),
(3, "Radiology Technician", 64000, 2),
(4, "Orthopedic Physician Assistant", 1260000, 1);

INSERT INTO employees (employee_id, first_name, last_name, title, manager_id)
VALUES 
(1, "Susan", "Parker", 4, 2),
(2, "Timothy", "Young", 3, 1),
(3, "Ava", "Green", 2, null),
(4, "Patricia", "Torres", 1, null),
(5, "Chris", "Anders", 3, 1),
(6, "Jessica", "Burges", 3, 1),
(7, "Jackson", "Cory", 4, 2);

