const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        enum: ['Books', 'Paintings', 'Music Instruments'],
        required: true
    },
    itemSchema: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    items: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        }
    ],
    avatarUrl: String,
},{
    timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema, 'Collections_db');

module.exports = Collection;