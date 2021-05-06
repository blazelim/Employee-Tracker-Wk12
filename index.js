const cTable = require('console.table')
const mainMenuPrompt = require('./questions/mainMenuPrompt');
const createDepartmentQuestions = require('./questions/addDepartmentPrompt')
const createRoleQuestions = require('./questions/addRolePrompt');
const inquirer = require('inquirer');
const db = require('./db/connection');

let sql = ``;
let wait = '';
let params = [];
let currentDepartments = [];
let resultingArray = [];
let departmentID = '';
let splitString = [];

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
            console.log(params);

            currentDepartments = [];
            resultingArray = []; 

            db.query(`SELECT concat(department.id, ' ', department.name) AS Department FROM department`, (err, rows) => {
                if (err) {
                    console.log( `error: ${err.message}`);
                    return;
                }
                
                
                resultingArray = Object.values(JSON.parse(JSON.stringify(rows)));
                console.log(resultingArray[1].Department);
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
            break;

        case "Add an Employee":
            // code block
            console.log("Add an Employee was called");
            break;

        case "Update Employee Role":
            // code block
            console.log("Update Employee Role was called");
            break;

        default:
            // code block
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