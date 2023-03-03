const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
    },
    collectionTitle: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    customFields: {
        type: Object,
        required: true,
    }
    
},{
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema, 'Items_db');

module.exports = Item;