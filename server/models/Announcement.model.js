const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    content: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);