const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '../data/users.json');

// Read users from the JSON file
const readUsersFromFile = () => {
    if (!fs.existsSync(userFilePath)) {
        return [];
    }
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
};

// Write users to the JSON file
const writeUsersToFile = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Create a new user and save it
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

// Find a user by their email address
const findUserByEmail = (email) => {
    const users = readUsersFromFile();
    return users.find(user => user.email === email);
};

// Find a user by their ID
const findUserById = (id) => {
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
};

// Export the functions so they can be used in other files
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
};
