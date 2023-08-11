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

module.exports.findCategoryFlashcards = async categoryId => {
    const completed = await Flashcard.find({ category: categoryId, completed: true });
    const notCompleted = await Flashcard.find({ category: categoryId, completed: false });

    if(!completed || ! notCompleted) {
        throw new ExpressError(400, 'GET_FLASHCARDS_ERR', 'Failed to locate flashcards for this category.')
    }

    return { completed, notCompleted }
}

// Fetch and validate a category
module.exports.findCategory = async id => {
    const { name } = await Category.findById(id);
    if(!name) {
        throw new ExpressError(400, 'GET_CATEGORY_ERR', 'Failed to locate category with that id.');
    }

    return { name };
}

// Fetch a validated fully populated user
module.exports.findUser = async id => {
    const foundUser = await User.findById(id).populate('categories');

    if(!foundUser) {
        throw new ExpressError(500, 'GET_USER_ERR', 'Failed to locate user with that id.')
    }
    
    return foundUser;
}


