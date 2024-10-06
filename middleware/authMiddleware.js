const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

// Middleware to check if the user is logged in
exports.authenticate = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied.'); // Send error if no token is found
    }

    // Check if the token is valid
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token.'); // Send error if the token is not valid
        }
        req.user = user; // Save the user info from the token in the request
        next(); // Move to the next middleware or route handler
    });
};
