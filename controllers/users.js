const bcrypt = require('bcrypt');
const User = require('../models/User');
const catchAsync = require('../util/catch-async');
const ExpressError = require('../util/express-error');

// If session is not found, return empty string
module.exports.getSession = (req, res) => res.status(200).send({ userId: req.session.userId || '' });

module.exports.create = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const newUser = await User.create({ email: email, password: password });
    if(!newUser) {
        throw new ExpressError(500, 'NEW_USER_ERR', 'Failed to create new user.');
    }

    req.session.userId = newUser._id.toString();
    res.status(200).send({ userId: newUser._id });
});

module.exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        throw new ExpressError(400, 'LOGIN_ERR', 'Please provide an email and password to login.');
    }

    const foundUser = await User.findOne({ email: email });
    if(!foundUser) {
        throw new ExpressError(400, 'LOGIN_ERR', 'Incorrect username or password.');
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if(!passwordMatches) {
        throw new ExpressError(400, 'LOGIN_ERR', 'Incorrect username or password.')
    }

    req.session.userId = foundUser._id.toString();
    res.status(200).send({ userId: foundUser._id });
});

module.exports.logOut = (req, res) => {
    req.session.userId = '';
    res.status(200).send({ userId: '' });
}