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
let employeeManager = [];
let managerID = '';
let inquirerArray = [];

// function to allow a bit of wait time between promise functions to prevent them from overlapping
function waitABit() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 250);
    });
  }

// query function for simple table readouts
async function simpleQuery(sqlQuery) {
    db.query(sqlQuery, (err, rows) => {
        if (err) {
            console.log( `error: ${err.message}`);
            return;
        }
        console.table(rows);
    })
}

// query function for queries with parameters involved
async function parameterQuery(sqlQuery, params) {
    db.query(sqlQuery, params, (err, rows) => {
        if (err) {
            console.log( `error: ${err.message}`);
            return;
        }


        console.table(rows);
    })
}

// Over encompassing main menu function loop
async function mainMenuFunc () {
    // question prompt to allow main menu selection
    let mainMenuSelect = await inquirer.prompt(mainMenuPrompt);

    // case switch to accomodate for each answer from the main menu
    switch(mainMenuSelect.answer) {
        case "View All Departments":

            // simple sql call for all departments
            sql = `SELECT * FROM department`;

            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "View All Roles":
            // simple sql call for all roles, while attaching their appropriate department name
            sql = `SELECT roles.id AS role_id, roles.title, roles.salary, department.name AS department_name 
                    FROM roles
                    LEFT JOIN department 
                    ON department.id = roles.department_id`;
                    
            // inputting into db query
            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case  "View All Employees":

            // preprepared sql query for entire employee list out with salaries, roles, departments, and manager, etc
            sql = `SELECT employee.id AS employee_id, employee.first_name, employee.last_name, roles.title, department.name AS department_name, roles.salary, concat(manager.first_name, ' ', manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN roles ON employee.role_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

            // inputting into db query
            await simpleQuery(sql);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "Add a Department":

            // ask for new department's name
            let inquirerDepartment = await inquirer.prompt(createDepartmentQuestions);

            sql = `INSERT INTO department (name) VALUES (?);`
            params = [inquirerDepartment.departmentName];

            await parameterQuery(sql, params);
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();
            break;

        case "Add a Role":
            // empty arrays
            params = [];
            currentDepartments = [];
            resultingArray = []; 

            // sending a db query to sql
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

            // if statement to check if there are any departments to put the role in
            if (currentDepartments.length === 0) {
                console.log(`
                ========================================
                Please create a department for the role
                ========================================
                `);
                break;
            }

            // get role information
            let inquirerRole = await inquirer.prompt(createRoleQuestions);

            params.push(inquirerRole.roleName, inquirerRole.salary);


            // allowing user to select the department from list of existing departments
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
            
            // split string to obtain department ID
            splitString = roleDept.departmentRole.split(' ');
            departmentID = splitString[0];
            
            // pushing 
            params.push(departmentID);
            sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`
            parameterQuery(sql, params);
            wait = await waitABit();
            break;

        case "Add an Employee":
            //emptying arrays
            params = [];
            currentRoles = [];
            resultingArray = []; 
            inquirerArray = [];
            
            // checking to see if there are roles to assign to the employee
            db.query(`SELECT concat(roles.id, ' ', roles.title) AS Roles FROM roles`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();
            // for loop to push current roles into an array
            for (var i = 0; i < resultingArray.length; i++) {
                currentRoles.push(resultingArray[i].Roles);
            }

            // if statement to check if there are any departments to put the role in
            if (currentRoles.length === 0) {
                console.log(`
                ========================================
                Please create a role for the employee
                ========================================
                `);
                break;
            }

            // asking the name for the employee
            inquirerEmployee = await inquirer.prompt(createEmployeeQuestions);

            // pushing the employee names into an array
            params.push(inquirerEmployee.firstName, inquirerEmployee.lastName);

           // asking user what the employee's role is
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
            
            // pushing necessary information into the parameters array
            splitString = empRole.employeeRole.split(' ');
            roleID = splitString[0];
            params.push(roleID)

            resultingArray = []; 
            currentEmployees = [];

            //query for getting the names of the rest of the employees
            db.query(`SELECT concat(employee.id, ' ', employee.first_name, ' ', employee.last_name) AS Manager FROM employee`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
            })
            wait = await waitABit();

            // push the list of employees into an array
            for (var i = 0; i < resultingArray.length; i++) {
                currentEmployees.push(resultingArray[i].Manager);
            }
            
            // push the list of employees into an array prepared for 
            if (currentEmployees.length != 0) {
                for (var i = 0; i < currentEmployees.length; i++) {
                    inquirerArray.push(currentEmployees[i])
                }
            }

            inquirerArray.push('None')
  
            employeeManager = await inquirer.prompt(
                    [
                        {
                            type: 'list',
                            name: 'Manager',
                            message: "Who is the employee's manager?",
                            choices: inquirerArray
                        }
                    ]
                )
            // inquirer prompt appears too quickly, need to set artificial delay
            wait = await waitABit();

            // obtain manager id from the string 
            splitString = employeeManager.Manager.split(' ');
            managerID = splitString[0];

            // if statements to create the sql query
            if (managerID === 'None') {
                sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL);`
            } else {
                params.push(managerID);
                sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
            }
            
            // push the prepared sql statement into the database
            parameterQuery(sql, params);
            wait = await waitABit();
            break;

        case "Update Employee Role":
            params = [];
            resultingArray = []; 
            currentEmployees = [];
            managerID = '';
            currentRoles = [];

            // db query to get list of employees
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

            // restart loop if there are no employees
            if (currentEmployees.length = 0) {
                console.log(`
                ========================================
                You have no employees to update!
                ========================================
                `);
                break;
            }

            // choose which employee to update
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
           
            // query to get list of roles
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

            // inquirer prompt to ask which role the employee is
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