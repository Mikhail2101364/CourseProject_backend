const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/User.js");
const Collection = require("../models/Collection");
const { Item } = require("../models/Item");
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
    // const customFieldsSchema = new Schema(schemaObj);
    // return customFieldsSchema;
    return schemaObj;
}

async function checkCollectionName(req, userID) {
    const usersCollections = await Collection.find({ author: userID });
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
        const newCollection = new Collection({ title, author: userData._id, authorName: userData.username, description, theme, itemSchema: itemSchema });
        return newCollection.save();
    } catch (error) {
        generateError(400, "Failed to create collection");
    }
};

async function modifyCollection(req, collectionID) {
    try {
        const { description, theme, customFields } = req.body;
        const itemSchema = createCustomFieldsSchema(customFields);
        await Collection.updateOne({_id: collectionID}, {
            description,
            theme, 
            itemSchema: itemSchema 
        });
        const updateCollection = await Collection.findById(collectionID);
        return updateCollection;
    } catch (error) {
        generateError(400, "Failed to modify collection");
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
        return await itemData;
    } catch (error) {
        generateError(400, "Item not found");
    }
};

async function setItems(itemsID) {
    try {
        if (itemsID.length > 0) {
            const items = await Item.find({ _id: itemsID });
            return await items;
        } else {
            const items = [];
            items.push({ 
                _id: null,
                customFields: null,
            });
            return items;
        }
    } catch (error) {
        generateError(400, "Items found error");
    }
}

function filterCustomFields(fieldsObj) {
    const itemFields = [];
    Object.keys(fieldsObj).forEach((key) => {
        itemFields.push({
            name: key.split('_')[1],
            type: key.split('_')[0],
            value: fieldsObj[key],
        });
    });
    return itemFields;
};

function filterCollection(collectionData, userData) {
    const itemFields = filterCustomFields(collectionData.itemSchema)
    const collection = {
        name: collectionData.title,
        description: collectionData.description,
        authorName: userData.username,
        theme: collectionData.theme,
        avatar: collectionData.avatarUrl ? collectionData.avatarUrl : "",
        fields: itemFields,
        itemSchema: Object.keys(collectionData.itemSchema),
    }
    return collection;
}

async function showCollection(collectionID) {
    try {
        const collectionData = await findCollectionById(collectionID);
        const userData = await findUserById(collectionData.author);
        const items = await setItems(collectionData.items);
        const collection = filterCollection(collectionData, userData)
        return {
            collection,
            items
        };
    } catch (error) {
        throw error;
    }
};

async function findCollectionsByUserId(userID) {
    try {
        const usersCollections = await Collection.find({ author: userID }, '_id title theme');
        return usersCollections;
    } catch (error) {
        generateError(400, "Failed to find user collections");
    }
};

async function findLastCollections() {
    try {
        const lastCollections = await Collection.find()
            .sort({ updatedAt: -1 })
            .limit(3)
            .select('_id title theme authorName avatarUrl');
        return lastCollections;
    } catch (error) {
        generateError(400, "Failed to find last collections");
    }
};

async function deleteManyItemsById(itemsID_array) {
    try {
        await Item.deleteMany({ _id: { $in: itemsID_array } });
    } catch (error) {
        generateError(400, "Items was not deleted");
    }
};

async function deleteCollectionById(collectionID) {
    try {
        await Collection.deleteOne({ _id: collectionID });
    } catch (error) {
        generateError(400, "Collection was not deleted");
    }
};

function getObjectDiff(obj1, obj2) {
    const diff = {};
    for (const key in obj1) {
        if (!(key in obj2)) {
            diff['customFields.'+key] = "";
        }
    }
    return diff;
}

async function updateItemFields(oldCollection, newCollection) {
    try {
        const addFields = getObjectDiff(newCollection.itemSchema, oldCollection.itemSchema);
        const deleteFields = getObjectDiff(oldCollection.itemSchema, newCollection.itemSchema);
console.log('addFields',addFields)
console.log('deleteFields',deleteFields)
         //   const update = { $set: { field2: 'newvalue2', field3: 'newvalue3' }, $unset: { field4: '' } };
        const updatedItems = await Item.updateMany({_id: { $in: newCollection.items }}, {
            $set: addFields,
            // "customFields": {$set: {"customFields": addFields}},
            // $set: Object.keys(addFields).map(name => {customFields[name] = null}) ,
            $unset: deleteFields 
        });
        return updatedItems;   
    } catch (error) {
        generateError(400, "Failed to update items");
    }
}

module.exports = {
    checkCollectionName,
    createCollection,
    showCollection,
    findCollectionsByUserId,
    findLastCollections,
    findCollectionById,
    findItemById,
    filterCustomFields,
    deleteManyItemsById,
    deleteCollectionById,
    modifyCollection,
    updateItemFields,
};