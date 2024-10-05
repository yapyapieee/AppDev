const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Use the same key as in userController

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};
