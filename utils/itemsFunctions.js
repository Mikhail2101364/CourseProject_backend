const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/User.js");
const Collection = require("../models/Collection");
const {Item, itemSchema} = require("../models/Item");
const { generateError } = require("./errors")

async function createNewItem(collectionData, itemFields) {
    try {
        const itemFieldsObj = setItemFieldsObj(itemFields);
        const newItem = new Item({
            collectionId: collectionData._id, 
            collectionTitle: collectionData.title,
            theme: collectionData.theme,
            authorName: collectionData.authorName,
            customFields: itemFieldsObj});
        return await newItem.save();   
    } catch (error) {
        generateError(400, "Failed to create item");
    }
}

function setItemFieldsObj(itemFields) {
    let itemFieldsObj = {};
    itemFields.map((field) => (
        itemFieldsObj = {
            ...itemFieldsObj,
            ...field,
        }
    ));
    return itemFieldsObj;
}

async function updateCollection(collectionID, itemID, action) {
    try {
        const updatedCollection = await Collection.updateOne({_id: collectionID}, {[action]: {items: itemID}});
        console.log('updatedCollection: ', updatedCollection)
        return updatedCollection;   
    } catch (error) {
        generateError(400, "Failed to update collection");
    }
}

async function deleteItemById(itemID) {
    try {
        await Item.deleteOne({ _id: itemID });
    } catch (error) {
        generateError(400, "Item was not deleted");
    }
};

async function findLastItem() {
    try {
        const lastItems = await Item.find()
            .sort({ updatedAt: -1 })
            .limit(3);
        return lastItems;
    } catch (error) {
        generateError(400, "Failed to find last items");
    }
};

// async function findLastItemsCollections(lastItems) {
//     try {
//         // const collectionID = [];
//         let itemsCollections = [];
//         lastItems.map(async (i)=>{
//             let collectionID = i.collectionId
//             const collectionData = await Collection.findById(collectionID);
//             itemsCollections.push(collectionData);
//         });
//         console.log('collectionID array: ',collectionID)
//         //const itemsCollections = await Collection.find({ _id: collectionID });
        
//         return itemsCollections;
//     } catch (error) {
//         generateError(400, "Failed to find last items collections");
//     }
// };

// function setLastItemsFields(lastItems, itemsCollections) {
//     console.log('Last 3 items: ',lastItems)
//     console.log('Last 3 items coll: ',itemsCollections)
//     let itemsFieldsArray = [];
//     lastItems.map((item,index)=>{
//         itemsFieldsArray.push({
//             itemID: item._id,
//             itemName: item.customFields.String_Title,
//             collectionName: itemsCollections[index].title,
//             author: itemsCollections[index].authorName,
//             theme: itemsCollections[index].theme,
//         })
//     })
//     return itemsFieldsArray;
// }

module.exports = {
    createNewItem,
    updateCollection,
    deleteItemById,
    findLastItem,
    // findLastItemsCollections,
    // setLastItemsFields,
};