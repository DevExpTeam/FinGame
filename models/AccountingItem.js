 const mongoose = require('mongoose');

const AccountingItemSchema = new mongoose.Schema({
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

module.exports = Game = mongoose.model('accounting_item', AccountingItemSchema);