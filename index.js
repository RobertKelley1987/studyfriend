if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ENV VARS
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/flashcards';

// INIT REQUIRED PACKAGES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const errorHandler = require('./handle-errors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// CONNECT TO DB
mongoose.connect(DB_URL);

// CONFIG APP - GENERAL
app.use(express.static('build'));
app.use(express.json());

// CONFIG SESSIONS
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: DB_URL })
}));

// CONFIG APP - ROUTES
const categoryRoutes = require('./routes/categories');
const flashcardRoutes = require('./routes/flashcards');
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
app.use('/api/users/:userId/categories', categoryRoutes);
app.use('/api/users/:userId/categories/:categoryId/flashcards', flashcardRoutes);

// TEST ROUTE FOR CLIENT
app.get('/api/test', (req, res) => res.send({ successMessage: 'OK' }));

// ERROR HANDLING
app.use(errorHandler);

// START APP ON DB CONNECTION
mongoose.connection.once('connected', err => {
    if(err) {
        console.log(err)
    } else {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
});