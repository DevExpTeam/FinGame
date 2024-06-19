 const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    gameType: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Scores = mongoose.model('score', ScoreSchema);