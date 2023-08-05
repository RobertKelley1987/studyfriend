const express = require('express');
const router = express.Router({ mergeParams: true });
const flashcards = require('../controllers/flashcards');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.route('/')
    .post(flashcards.create)
    .put(flashcards.resetAllCompleted);

router.route('/:flashcardId')
    .get(flashcards.getOne)
    .delete(flashcards.deleteOne)
    .put(flashcards.updateOne);

router.put('/:flashcardId/completed', flashcards.updateCompleted);

module.exports = router;