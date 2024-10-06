const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userModel = require('../models/userModel');

const SECRET_KEY = 'your_secret_key';

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
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    };

    users.push(newUser);
    writeUsersToFile(users);
    
    res.status(201).send({
        id: newUser.id,
        email: newUser.email,
    });
};

exports.login = (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const foundUser = userModel.findUserByEmail(req.body.email);
    if (!foundUser || foundUser.password !== req.body.password) {
        return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ id: foundUser.id }, SECRET_KEY);
    res.send({
        token,
        email: foundUser.email,
    });
};

exports.getProfile = (req, res) => {
    const userProfile = userModel.findUserById(req.user.id);
    if (!userProfile) {
        return res.status(404).send('User not found');
    }
    res.send(userProfile);
};
