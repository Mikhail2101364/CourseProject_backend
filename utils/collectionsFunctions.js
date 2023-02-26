const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/User.js");
const Collection = require("../models/Collection");
const Item = require("../models/Item");
const { generateError } = require("./errors")

const setInputType = (type) => {
    switch(type) {
        case "Number": return 'Number';
        case "String": return 'String';
        case "Text": return 'String';
        case "Date": return 'Date';
        case "Checkbox": return 'Boolean';
        default: break;
    }
}

function createCustomFieldsSchema(customFields) {
    let schemaObj = {};
    customFields.map((field) => (
        schemaObj = {
            ...schemaObj,
            [field.type+'_'+field.name]: {
                type: setInputType(field.type),
                required: true
            }
        }
    ));
    const customFieldsSchema = new Schema(schemaObj);
    return customFieldsSchema;
}

async function checkCollectionName(req, userId) {
    const usersCollections = await Collection.find({ author: userId });
    if (usersCollections) {
        usersCollections.map((i)=>{
            if (i.title === req.body.title) {
                generateError(400, "Collection with this name already exists");
            }
        })
    }
}

async function findUserById(userID) {
    try {
        const userData = await User.findById(userID);
        return userData;
    } catch (error) {
        generateError(400, "User not found");
    }
};

async function createCollection(req, userID) {
    try {
        const { title, description, theme, customFields } = req.body;
        const itemSchema = createCustomFieldsSchema(customFields);
        const userData = await findUserById(userID);
        const newCollection = new Collection({ title, author: userData._id, description, theme, itemSchema: itemSchema });
        return newCollection.save();
    } catch (error) {
        generateError(400, "Failed to create collection");
    }
};

async function findCollectionById(collectionID) {
    try {
        const collectionData = await Collection.findById(collectionID);
        return collectionData;
    } catch (error) {
        generateError(400, "Collection not found");
    }
};

async function findItemById(itemID) {
    try {
        const itemData = await Item.findById(itemID);
        return itemData;
    } catch (error) {
        generateError(400, "Item not found");
    }
};

async function setItems(itemsID) {
    const items = [];
    if (itemsID.length > 0) {
        itemsID.map(async (i)=>{
            items.push(await findItemById(i));
        })    
    } else {
        items.push({
            _id: null,
        })
    }
    return items;
}

function filterCollection(collectionData, userData) {
    const itemFields = [
        {
            name: 'Title',
            type: 'String',
        },
        {
            name: 'Tags',
            type: 'String',
        },
    ];
    console.log('obj:  ',collectionData.itemSchema.obj)
    // collectionData.itemSchema.obj.map((i)=>{
    //     itemFields.push(i);
    // })
    Object.keys(collectionData.itemSchema.obj).forEach((key) => {
        itemFields.push({
            name: key.split('_')[1],
            type: key.split('_')[0],
        });
      });
      console.log('itemFields:  ',itemFields)
    const collection = {
        name: collectionData.title,
        description: collectionData.description,
        authorName: userData.username,
        avatar: collectionData.avatarUrl ? collectionData.avatarUrl : "",
        fields: itemFields,
    }
    return collection;
}

async function showCollection(collectionID) {
    try {
        const collectionData = await findCollectionById(collectionID);
        console.log('Find coll')
        const userData = await findUserById(collectionData.author);
        console.log('find author')
        const items = await setItems(collectionData.items);
        console.log('set items')
        const collection = filterCollection(collectionData, userData)
        console.log('res collection: ', collection)
        console.log('res items: ', items)
        return {
            collection,
            items
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    checkCollectionName,
    createCollection,
    showCollection,
};