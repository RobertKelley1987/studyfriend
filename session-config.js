
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = url => session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: url })
});

module.exports = sessionConfig;