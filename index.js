const cTable = require('console.table')
const mainMenuPrompt = require('./questions/mainMenuPrompt');
const createDepartmentQuestions = require('./questions/addDepartmentPrompt')
const createRoleQuestions = require('./questions/addRolePrompt');
const inquirer = require('inquirer');
const db = require('./db/connection');
const createEmployeeQuestions = require('./questions/addEmployeeQuestions')

let sql = ``;
let wait = '';
let params = [];
let currentDepartments = [];
let resultingArray = [];
let departmentID = '';
let splitString = [];
let inquirerEmployee = [];
let currentRoles = [];
let currentEmployees = [];
let empRole = '';
let roleID = '';


function waitABit() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 250);
    });
  }

async function simpleQuery(sqlQuery) {
    db.query(sqlQuery, (err, rows) => {
        if (err) {
            console.log( `error: ${err.message}`);
            return;
        }
        console.table(rows);
    })
}

async function parameterQuery(sqlQuery, params) {
    db.query(sqlQuery, params, (err, rows) => {
        if (err) {
            console.log( `error: ${err.message}`);
            return;
        }


        console.table(rows);
    })
}


async function mainMenuFunc () {
    let mainMenuSelect = await inquirer.prompt(mainMenuPrompt);

    switch(mainMenuSelect.answer) {
        case "View All Departments":
            sql = `SELECT * FROM department`;

            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "View All Roles":
            sql = `SELECT roles.id AS role_id, roles.title, roles.salary, department.name AS department_name 
                    FROM roles
                    LEFT JOIN department 
                    ON department.id = roles.department_id`;
                    

            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case  "View All Employees":
            sql = `SELECT employee.id AS employee_id, employee.first_name, employee.last_name, roles.title, department.name AS department_name, roles.salary, concat(manager.first_name, ' ', manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN roles ON employee.role_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "Add a Department":
            let inquirerDepartment = await inquirer.prompt(createDepartmentQuestions);

            sql = `INSERT INTO department (name) VALUES (?);`
            params = [inquirerDepartment.departmentName];

            await parameterQuery(sql, params);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "Add a Role":
            params = [];

            let inquirerRole = await inquirer.prompt(createRoleQuestions);

            params.push(inquirerRole.roleName, inquirerRole.salary);

            currentDepartments = [];
            resultingArray = []; 

            db.query(`SELECT concat(department.id, ' ', department.name) AS Department FROM department`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            for (var i = 0; i < resultingArray.length; i++) {
                currentDepartments.push(resultingArray[i].Department);
            }

            let roleDept = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'departmentRole',
                        message: "What is the role's department?",
                        choices: currentDepartments
                    }
                ]
            )
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            
            splitString = roleDept.departmentRole.split(' ');
            departmentID = splitString[0];

            params.push(departmentID);
            sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`
            parameterQuery(sql, params);
            wait = await waitABit();
            break;

        case "Add an Employee":
            params = [];

            inquirerEmployee = await inquirer.prompt(createEmployeeQuestions);

            params.push(inquirerEmployee.firstName, inquirerEmployee.lastName);

            currentRoles = [];
            resultingArray = []; 

            db.query(`SELECT concat(roles.id, ' ', roles.title) AS Roles FROM roles`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            for (var i = 0; i < resultingArray.length; i++) {
                currentRoles.push(resultingArray[i].Roles);
            }

            empRole = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: "What is the employee's role?",
                        choices: currentRoles
                    }
                ]
            )
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            
            splitString = empRole.employeeRole.split(' ');
            roleID = splitString[0];
            params.push(roleID)



            resultingArray = []; 
            currentEmployees = [];

            db.query(`SELECT concat(employee.id, ' ', employee.first_name, ' ', employee.last_name) AS Manager FROM employee`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            for (var i = 0; i < resultingArray.length; i++) {
                currentEmployees.push(resultingArray[i].Manager);
            }

            let employeeManager = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'Manager',
                        message: "Who is the employee's manager?",
                        choices: currentEmployees
                    }
                ]
            )
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();

            splitString = employeeManager.Manager.split(' ');
            let managerID = splitString[0];
            params.push(managerID)
            
            sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
            
            parameterQuery(sql, params);
            wait = await waitABit();
            break;

        case "Update Employee Role":
            params = [];
            resultingArray = []; 
            currentEmployees = [];

            db.query(`SELECT concat(employee.id, ' ', employee.first_name, ' ', employee.last_name) AS EmployeeList FROM employee`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            for (var i = 0; i < resultingArray.length; i++) {
                currentEmployees.push(resultingArray[i].EmployeeList);
            }

            let employeeList = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'employee',
                        message: "Which employee do you want to update?",
                        choices: currentEmployees
                    }
                ]
            )    
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();

            splitString = employeeList.employee.split(' ');
            let employeeID = splitString[0];
           
       
            db.query(`SELECT concat(roles.id, ' ', roles.title) AS Roles FROM roles`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            for (var i = 0; i < resultingArray.length; i++) {
                currentRoles.push(resultingArray[i].Roles);
            }

            empRole = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: "What is the employee's role?",
                        choices: currentRoles
                    }
                ]
            )
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            
            splitString = empRole.employeeRole.split(' ');
            roleID = splitString[0];
            params.push(roleID, employeeID);

            sql = `UPDATE employee SET role_id = ? WHERE id = ?;`

            parameterQuery(sql, params);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();

            break;

        default:
            console.log(`
            ====================================
            Press 'Ctrl + C' if you want to quit
            ====================================
            `);
            
            break;
    }

    mainMenuFunc ();
}

mainMenuFunc();