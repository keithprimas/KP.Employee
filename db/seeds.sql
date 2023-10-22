INSERT INTO department (id, name)
VALUES (001, "Orthopedic Surgery"),
       (002, "Radiology");

INSERT INTO role (id, title, salary, department_id)
VALUES (01, "Radiologist", 434000, 002),
       (02, "Orthopedic Surgeon", 287000, 001),
       (03, "Radiology Technician", 64000, 002),
       (04, "Orthopedic Physician Assistant", 1260000, 001);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Susan", "Parker", 04, 02),
       (2, "Timothy", "Young", 03, 01),
       (3, "Ava", "Green", 02, null),
       (4, "Patricia", "Torres", 01, null),
       (5, "Chris", "Anders", 03, 01),
       (6, "Jessica", "Burges", 03, 01),
       (7, "Jackson", "Cory", 04, 02);

