const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '../data/users.json');

// Function to read users from the mock database (JSON file)
const readUsersFromFile = () => {
    if (!fs.existsSync(userFilePath)) {
        return [];
    }
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
};

// Function to write users to the mock database (JSON file)
const writeUsersToFile = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Function to create a new user
const createUser = (userData) => {
    const users = readUsersFromFile();
    const newUser = {
        id: users.length + 1,
        ...userData,
    };

    users.push(newUser);
    writeUsersToFile(users);
    return newUser;
};

// Function to find a user by email
const findUserByEmail = (email) => {
    const users = readUsersFromFile();
    return users.find(user => user.email === email);
};

// Function to find a user by ID
const findUserById = (id) => {
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
};

// Exporting the user model functions
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
};
