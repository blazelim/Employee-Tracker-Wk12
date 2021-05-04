INSERT INTO department (name)
VALUES
    ("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Lead Engineer", 150000, 1),
    ("Software Engineer", 120000, 1),
    ("Sales Lead", 100000, 2),
    ("Salesperson", 80000, 2),
    ("Accountant", 125000, 3),
    ("Junior Accountant", 60000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Doe", 1, NULL),
    ("Jane", "Smith", 2, 1),
    ("Kevin", "Bastion", 2, 1),
    ("Derek", "Chang", 3, NULL),
    ("Steve", "Pars", 4, 4),
    ("Lester", "Sleeps", 4, 4),
    ("Mary", "Price", 5, NULL),
    ("Larry", "Shmoe", 6, 7),
    ("Joey", "Moey", 6, 7),
    ("Sue", "Yu", 7, NULL),
    ("Bob", "Parr", 8, 10),
    ("Jack", "Car", 8, 10);