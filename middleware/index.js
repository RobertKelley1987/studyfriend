const ExpressError = require('../util/express-error');

module.exports.isLoggedIn = (req, res, next) => {
    console.log("Inside middleware:");
    console.log(req.session);
    if(!req.session.userId) {
        throw new ExpressError(401, 'AUTH_ERR', 'You must be logged in to access this content.');
    } else {
        next();
    }
}