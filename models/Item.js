const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customFieldsSchema = new Schema()

const itemSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
    },
    Tags: {
        type: String,
        required: true,
    },
    customFields: customFieldsSchema,
},{
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema, 'Items_db');

module.exports = Item;