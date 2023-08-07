const User = require('../models/User');
const Category = require('../models/Category');
const Flashcard = require('../models/Flashcard');
const ExpressError = require('../util/express-error');

// HELPER FUNCTIONS SHARED BETWEEN CONTROLLERS

// Fetch and validate a flashcard
module.exports.findFlashcard = async id => {
    const flashcard = await Flashcard.findById(id);
    if(!flashcard) {
        throw new ExpressError(400, 'GET_FLASHCARD_ERR', 'Failed to locate flashcard with that id.');
    }
    return flashcard;
}

// Fetch and validate a category
module.exports.findCategory = async id => {
    const { name } = await Category.findById(id);
    if(!name) {
        throw new ExpressError(400, 'GET_CATEGORY_ERR', 'Failed to locate category with that id.');
    }
    const completed = await Flashcard.find({ category: id, completed: true });
    const notCompleted = await Flashcard.find({ category: id, completed: false });

    return { name, flashcards: { completed, notCompleted }};
}

// Fetch a validated fully populated user
module.exports.findUser = async id => {
    const foundUser = await User.findById(id).populate('categories');

    if(!foundUser) {
        throw new ExpressError(500, 'GET_USER_ERR', 'Failed to locate user with that id.')
    }
    
    return foundUser;
}


