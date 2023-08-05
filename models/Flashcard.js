const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema({ 
    question: String, 
    answer: String,
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);