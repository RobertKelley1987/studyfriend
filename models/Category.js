const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    flashcards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard' 
    }]
});

module.exports = mongoose.model('Category', categorySchema);