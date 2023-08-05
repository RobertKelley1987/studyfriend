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
const sessionConfig = require('./session-config');
const errorHandler = require('./handle-errors');
const path = require('path');

// CONNECT TO DB
mongoose.connect(DB_URL);

// CONFIG APP - GENERAL
app.use(express.static('build'));
app.use(express.json());
app.use(sessionConfig(DB_URL));

// CONFIG APP - ROUTES
const categoryRoutes = require('./routes/categories');
const flashcardRoutes = require('./routes/flashcards');
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
app.use('/api/users/:userId/categories', categoryRoutes);
app.use('/api/users/:userId/categories/:categoryId/flashcards', flashcardRoutes);

// TEST ROUTE FOR API
app.get('/api/test', (req, res) => res.send({ successMessage: 'OK' }));
// SEND REACT BUILD FOR ALL NON-API REQUESTS
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

// ADD ERROR HANDLING
app.use(errorHandler);

// START APP ON DB CONNECTION
mongoose.connection.once('connected', err => {
    if(err) {
        console.log(err)
    } else {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
});