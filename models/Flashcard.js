const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema({ 
    question: String, 
    answer: String,
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);