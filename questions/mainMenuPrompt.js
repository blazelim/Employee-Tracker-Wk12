let mainMenuQuestions = [
    {
        type: 'list',
        name: 'mainMenuSelection',
        message: 'What would you like to do?',
        choices: [
            "View All Departments", 
            "View All Roles", 
            "View All Employees", 
            // "View All Employees By Department", 
            // "View All Employees By Manager", 
            "Add a Department",
            "Add a Role",
            "Add an Employee", 
            // "Remove Department",
            // "Remove Role", 
            // "Remove Employee", 
            "Update Employee Role"//,
            // "Update Employee Manager",
            // "View The Total Utilized Budget of a Department"
        ]
    }
];

module.exports = mainMenuQuestions;