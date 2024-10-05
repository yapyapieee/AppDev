const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userFilePath = path.join(__dirname, '../data/users.json');
const SECRET_KEY = 'your_secret_key';


const readUsersFromFile = () => {
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

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

exports.register = (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = readUsersFromFile();
    const newUser = {
        id: users.length + 1,
        ...req.body,
    };

    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).send('User registered successfully');
};

exports.login = (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = readUsersFromFile();
    const foundUser = users.find(user => user.email === req.body.email && user.password === req.body.password);

    if (!foundUser) {
        return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ id: foundUser.id }, SECRET_KEY);
    res.send({ token });
};

exports.getProfile = (req, res) => {
    const users = readUsersFromFile();
    const userProfile = users.find(user => user.id === req.user.id);
    if (!userProfile) {
        return res.status(404).send('User not found');
    }
    res.send(userProfile);
};
