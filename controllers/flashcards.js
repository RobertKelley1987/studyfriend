const Flashcard = require('../models/Flashcard');
const ExpressError = require('../util/express-error');
const catchAsync = require('../util/catch-async');
const { findFlashcard, findCategoryFlashcards } = require('./helpers');

module.exports.getAll = catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards });
});

module.exports.getOne = catchAsync(async (req, res) => {
    const { flashcardId } = req.params;
    const foundFlashcard = await findFlashcard(flashcardId);
    res.status(200).send({ flashcard: foundFlashcard });
});

module.exports.create = catchAsync(async (req, res) => {
    const { question, answer } = req.body; 
    const { categoryId } = req.params;
    
    // Create flashcard
    const newCard = await Flashcard.create({ question: question, answer: answer, category: categoryId });
    if(!newCard) {
        throw new ExpressError(500, 'CREATE_FLASHCARD_ERR', 'Failed to create new flashcard.');
    }

    // Return updated flashcards to client
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards });
});

module.exports.updateCompleted = catchAsync(async (req, res) => {
    const { categoryId, flashcardId } = req.params;

    // Find flashcard
    const foundFlashcard = await findFlashcard(flashcardId);

    // Update state
    foundFlashcard.completed = !foundFlashcard.completed;
    await foundFlashcard.save();

    // Return updated flashcards to client
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards, flashcard: foundFlashcard });
});

module.exports.resetAllCompleted = catchAsync(async (req, res) => {
    const { categoryId } = req.params;

    // Find category and update
    await Flashcard.updateMany({ category: categoryId }, { completed: false });
    
    // Return updated flashcards to client
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards });
});

module.exports.updateOne = catchAsync(async (req, res) => {
    const { categoryId, flashcardId } = req.params;
    const { question, answer } = req.body;

    // Find flashcard
    const foundFlashcard = await findFlashcard(flashcardId);

    // Update state
    foundFlashcard.question = question;
    foundFlashcard.answer = answer;
    await foundFlashcard.save();

    // Return updated flashcards to client
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards });
});

module.exports.deleteOne = catchAsync(async (req, res) => {
    const { categoryId, flashcardId } = req.params;

    // Delete flashcard from db
    const { deletedCount } = await Flashcard.deleteOne({_id: flashcardId });
    if(deletedCount < 1) {
        throw new ExpressError(500, 'DELETE_FLASHCARD_ERR', 'Failed to delete this item from the database.')
    }

    // Return updated flashcards to client
    const flashcards = await findCategoryFlashcards(categoryId);
    res.status(200).send({ flashcards });
});

