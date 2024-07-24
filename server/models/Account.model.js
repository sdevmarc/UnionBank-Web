const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountno: {
        type: String,
        unique: true,
        required: true
    },
    accountType: {
        type: String,
        enum: ['savings', 'checking'],
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    isactive: {
        type: Boolean,
        required: true,
        default: true //July 06, 2024 from false to true
    }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
