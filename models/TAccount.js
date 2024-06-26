 const mongoose = require('mongoose');

const TAccountSchema = new mongoose.Schema({
    problemArray: {
        type: Array,
        required: true,
    },
    debitDataArray: {
        type: Array,
        required: true,
    },
    creditDataArray: {
        type: Array,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
});

module.exports = TAccount = mongoose.model('t_account', TAccountSchema);