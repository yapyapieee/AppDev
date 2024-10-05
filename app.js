const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
