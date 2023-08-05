if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ENV VARS
const PORT = process.env.PORT || 800;
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/flashcards';

// INIT REQUIRED PACKAGES
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./handle-errors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbUrl = DB_URL; 
const corsOrigin = 'https://studyfriend.netlify.app';

// CONNECT TO DB
mongoose.connect(dbUrl);

// CONFIG APP - GENERAL
// app.set('trust proxy', 1);
app.use(express.static('build'));
app.use(express.json());
app.use(cors({ origin: corsOrigin, credentials: true }));

// CONFIG SESSIONS
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 12 * 60 * 60
    },
    store: MongoStore.create({ mongoUrl: dbUrl })
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