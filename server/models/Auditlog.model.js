const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete', 'read'],
        required: true,
    },
    collectionName: {
        type: String,
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
    },
    changes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
