const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer_debit', 'transfer_credit', 'login'],
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);