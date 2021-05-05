let createDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: "What is the name of the department you want to add?",
        validate: departmentName => {
            if (departmentName) {
                return true;
            } else {
                console.log("Please enter the department's name!");
                return false;
            }
        }
    }
];

module.exports = createDepartmentQuestions;