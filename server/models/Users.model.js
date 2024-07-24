const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileno: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['developer', 'hr', 'it', 'rb', 'user', 'admin'],
        required: true,
        default: 'user'
    },
    isactive: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
