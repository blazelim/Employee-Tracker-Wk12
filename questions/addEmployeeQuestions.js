let createEmployeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "What is your employee's first name",
        validate: firstName => {
            if (firstName) {
                return true;
            } else {
                console.log("Please enter your employee's first name!");
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'lastName',
        message: "What is your employee's last name",
        validate: lastName => {
            if (lastName) {
                return true;
            } else {
                console.log("Please enter your employee's last name!");
                return false;
            }
        }
    }
];

module.exports = createEmployeeQuestions;