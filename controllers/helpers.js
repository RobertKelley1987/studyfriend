const User = require('../models/User');
const Category = require('../models/Category');
const Flashcard = require('../models/Flashcard');
const ExpressError = require('../util/express-error');

// HELPER FUNCTIONS SHARED BETWEEN CONTROLLERS

// Fetch and validate a flashcard
module.exports.findFlashcard = async (id) => {
    const flashcard = await Flashcard.findById(id);
    if(!flashcard) {
        throw new ExpressError(400, 'GET_FLASHCARD_ERR', 'Failed to locate flashcard with that id.');
    }
    return flashcard;
}

// Fetch and validate a category
module.exports.findCategory = async (id) => {
    const category = await Category.findById(id).populate('flashcards');
    if(!category) {
        throw new ExpressError(400, 'GET_CATEGORY_ERR', 'Failed to locate category with that id.');
    }
    return category;
}

// Fetch a validated user and return their categories to client
module.exports.returnCategories = async (res, userId) => {
    const foundUser = await User.findById(userId).populate({ 
        path: 'categories', 
        populate: { path: 'flashcards' }
    });

    if(!foundUser) {
        throw new ExpressError(500, 'GET_USER_ERR', 'Failed to locate user with that id.')
    }
    
    res.status(200).send({ categories: foundUser.categories });
}


