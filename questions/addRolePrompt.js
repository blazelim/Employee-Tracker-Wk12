let createRoleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: "What is the name of the role you want to add?",
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please enter the role's name!");
                return false;
            }
        }
    }, 
    {
        type: 'input',
        name: 'salary',
        message: "Please enter the salary of this role. (Numbers only)",
        validate: salary => {
            if (parseInt(salary)) {
                return true;
            } else {
                console.log(".     Please enter this role's salary!");
                return '';
            }
        }
    } 
];

module.exports = createRoleQuestions;