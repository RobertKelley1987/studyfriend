const filterFlashcards = category => {
    const completed = [], needReview = [];
    category.flashcards.forEach(flashcard => {
        flashcard.completed ? completed.push(flashcard) : needReview.push(flashcard)
    });
    return { completed, needReview }
}

module.exports = filterFlashcards;