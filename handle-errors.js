const { DEFINED_ERRS } = require('./util/constants');

const handleErrors = (err, req, res, next) => {
    // If I created the error name (i.e. it's on this list), return message to client
    if(Object.values(DEFINED_ERRS).includes(err.name)) {
        res.send({ errorMessage: err.message });
    }

    // Error handling for new account with email already in database.
    if(err.code === 11000 && err.name === 'MongoServerError') {
        res.send({ errorMessage: 'This user already exists.' })
    }

    // Log error
    console.log(err);
}

module.exports = handleErrors;