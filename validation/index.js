const ExpressError = require('../util/express-error');
const { userSchema, flashcardSchema, categorySchema } = require('./schemas');
const { DEFINED_ERRS } = require('../util/constants');

const { USER_VALIDATION_ERR, CATEGORY_VALIDATION_ERR, FLASHCARD_VALIDATION_ERR } = DEFINED_ERRS;

module.exports.validateUser = (req, res, next) => validateUser(req, next, USER_VALIDATION_ERR);
module.exports.validateNewFlashcard = (req, res, next) => validateFlashcard(req, next, FLASHCARD_VALIDATION_ERR);
module.exports.validateEditedFlashcard = (req, res, next) => validateFlashcard(req, next, FLASHCARD_VALIDATION_ERR);
module.exports.validateNewCategory = (req, res, next) => validateCategory(req, next, CATEGORY_VALIDATION_ERR);
module.exports.validateEditedCategory = (req, res, next) => validateCategory(req, next, CATEGORY_VALIDATION_ERR);

function validateFlashcard (req, next, errName) {
    const { question, answer } = req.body;
    const { categoryId } = req.params;

    const { error } = flashcardSchema.validate({ question, answer, category: categoryId });
    if(error) {
        const messages = error.details.map(err => err.message);
        throw new ExpressError(400, errName, messages);
    } 
    next();
}

function validateCategory (req, next, errName) {
    const { name } = req.body;

    const { error } = categorySchema.validate({ name });
    if(error) {
        const messages = error.details.map(err => err.message);
        throw new ExpressError(400, errName, messages);
    } 
    next();
}

function validateUser(req, next, errName) {
    const { email, password } = req.body;

    const { error } = userSchema.validate({ email, password });
    if(error) {
        const messages = error.details.map(err => err.message);
        throw new ExpressError(400, errName, messages);
    }  
    next();
}