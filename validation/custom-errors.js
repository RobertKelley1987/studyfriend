// Code to customize error messages returned to user from Joi validation based on error type
exports.emailMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
            err.message = 'Please provide an email address to continue.'
            break;
        case 'string.email':
            err.message = 'Please provide a valid email address to continue.'
            break;
        default:
            break;
    }
    return err;
}

exports.passwordMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
            err.message = 'Please provide a password to continue.'
            break;
        case 'string.min':
            err.message = 'Password length must be more than 8 characters.'
            break;
        default:
            break;
    }
    return err;
}

exports.categoryNameMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
            err.message = 'Please provide a name for this category to continue.'
            break;
        case 'string.pattern.name':
            err.message = 'Category name must contain at least one non-whitespace character.'
        default:
            break;
    }
    return err;
}

exports.questionMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
            err.message = 'Please provide a question to continue.'
            break;
        case 'string.pattern.name':
            err.message = 'Question must contain at least one non-whitespace character.'
        default:
            break;
    }
    return err;
}

exports.answerMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
            err.message = 'Please provide an answer to continue.'
            break;
        case 'string.pattern.name':
            err.message = 'Answer must contain at least one non-whitespace character.'
        default:
            break;
    }
    return err;
};

exports.categoryIdMessages = err => {
    switch (err.code) {
        case 'string.empty':
        case 'string.required':
        case 'string.pattern.name':
            err.message = 'Please provide a category id to continue.'
            break;
    }
    return err;
}