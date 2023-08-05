const Flashcard = require('../models/Flashcard');
const ExpressError = require('../util/express-error');
const catchAsync = require('../util/catch-async');
const { returnCategories, findCategory, findFlashcard } = require('./helpers');

module.exports.getOne = catchAsync(async (req, res) => {
    const { flashcardId } = req.params;
    const foundFlashcard = await findFlashcard(flashcardId);
    res.status(200).send({ flashcard: foundFlashcard });
});

module.exports.create = catchAsync(async (req, res) => {
    const { question, answer } = req.body; 
    const { userId, categoryId } = req.params;
    
    // Create flashcard
    const newCard = await Flashcard.create({ question: question, answer: answer });
    if(!newCard) {
        throw new ExpressError(500, 'CREATE_FLASHCARD_ERR', 'Failed to create new flashcard.');
    }

    // Push new card to category
    const foundCategory = await findCategory(categoryId);
    foundCategory.flashcards.push(newCard);
    await foundCategory.save();

    // Return categories to client
    returnCategories(res, userId);
});

module.exports.updateCompleted = catchAsync(async (req, res) => {
    const { userId, flashcardId } = req.params;

    // Find flashcard
    const foundFlashcard = await findFlashcard(flashcardId);

    // Update state
    foundFlashcard.completed = !foundFlashcard.completed;
    await foundFlashcard.save();

    // Return categories to client
    returnCategories(res, userId);
});

module.exports.resetAllCompleted = catchAsync(async (req, res) => {
    const { userId, categoryId } = req.params;

    // Find category
    const foundCategory = await findCategory(categoryId);

    // Update all flashcards in category and save
    foundCategory.flashcards.forEach(async flashcard => {
        flashcard.completed = false;
        await flashcard.save();
    });

    await foundCategory.save();

    // Return categories to client
    returnCategories(res, userId);
});

module.exports.updateOne = catchAsync(async (req, res) => {
    const { userId, categoryId, flashcardId } = req.params;
    const { question, answer, category } = req.body;

    // Find flashcard
    const foundFlashcard = await findFlashcard(flashcardId);

    // Update state
    foundFlashcard.question = question;
    foundFlashcard.answer = answer;
    await foundFlashcard.save();

    // If different category is provided, move flashcard to its new category
    if(categoryId !== category) {
        // Get current category and new category
        const currentCategory = await findCategory(categoryId);
        const newCategory = await findCategory(category);

        // Remove from current category and add to new category
        await currentCategory.flashcards.pull(flashcardId);
        await currentCategory.save();
        await newCategory.flashcards.push(foundFlashcard);
        await newCategory.save();
    }

    // Return categories to client
    returnCategories(res, userId);
});

module.exports.deleteOne = catchAsync(async (req, res) => {
    const { userId, flashcardId } = req.params;
    const errName = 'DELETE_FLASHCARD_ERR';

    // Delete flashcard from db
    const { deletedCount } = await Flashcard.deleteOne({_id: flashcardId });
    if(deletedCount < 1) {
        throw new ExpressError(500, errName, 'Failed to delete this item from the database.')
    }

    // Return categories to client
    returnCategories(res, userId);
});

