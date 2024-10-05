const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userFilePath = path.join(__dirname, '../data/data.json');
const SECRET_KEY = 'your_secret_key'; // Change this to a secure key in production

const readUsers = () => {
    const data = fs.readFileSync(userFilePath);
    return JSON.parse(data);
};

const writeUsers = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Validation schemas
const registerSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.ref('password'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Register
exports.register = (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const users = readUsers();
    const newUser = {
        id: users.length + 1,
        ...req.body,
    };

    users.push(newUser);
    writeUsers(users);
    res.status(201).send('User registered successfully');
};

// Login
exports.login = (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const users = readUsers();
    const user = users.find(u => u.email === req.body.email && u.password === req.body.password);

    if (!user) return res.status(401).send('Invalid email or password');

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.send({ token });
};

// Get Profile
exports.getProfile = (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
};
