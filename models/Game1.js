 const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    tooltip: {
        type: String,
        required: true,
    },
});

module.exports = Game = mongoose.model('first_game', GameSchema);