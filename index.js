const cTable = require('console.table')
const mainMenuPrompt = require('./questions/mainMenuPrompt');
const createDepartmentQuestions = require('./questions/addDepartmentPrompt')
const createRoleQuestions = require('./questions/addRolePrompt');
const inquirer = require('inquirer');

async function mainMenuFunc () {
    let mainMenuSelect = await inquirer.prompt(mainMenuPrompt);
    console.log(mainMenuSelect);
}

mainMenuFunc();