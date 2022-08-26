'use strict';

// Third party imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;

// Esoteric imports
const routesObject = require('./src/routes/routes.js');
const { authMiddleware } = require('./src/utils/auth.js');

// Application configuration
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Database connection confirmation
db.once('open', () => {
    console.log('Database connected!');
});

// Proof of life
app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/signup', routesObject.signup);
app.post('/login', routesObject.login);
app.post('/budget', authMiddleware, routesObject.budget);
app.get('/budget', authMiddleware, routesObject.getBudget);
app.put('/editExpenses', authMiddleware, routesObject.editExpenses);
app.put('/editBudget', authMiddleware, routesObject.editBudget);

// Server listener
app.listen(PORT, () => {
    console.log(`SERVER UP ON PORT ::: ${PORT}`);
});
