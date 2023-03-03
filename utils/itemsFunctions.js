
const Collection = require("../models/Collection");
const Item = require("../models/Item");
const { generateError } = require("./errors")

async function findItemById(itemID) {
    try {
        const itemData = await Item.findById(itemID);
        return await itemData;
    } catch (error) {
        generateError(400, "Item not found");
    }
};

async function createNewItem(collectionData, itemFields) {
    try {
        const itemFieldsObj = setItemFieldsObj(itemFields);
        const newItem = new Item({
            collectionId: collectionData._id, 
            collectionTitle: collectionData.title,
            theme: collectionData.theme,
            authorName: collectionData.authorName,
            customFields: itemFieldsObj
        });
        return await newItem.save();   
    } catch (error) {
        generateError(400, "Failed to create item");
    }
}

async function modifyItem(itemFields, itemID) {
    try {
        const itemFieldsObj = setItemFieldsObj(itemFields);
        const updatedItem = await Item.updateOne({_id: itemID}, {$set: {customFields: itemFieldsObj}});
        return await updatedItem;   
    } catch (error) {
        generateError(400, "Failed to modify item");
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
        const updatedItems = await Item.updateMany({_id: { $in: newCollection.items }}, {
            $set: addFields,
            $unset: deleteFields 
        });
        return updatedItems;   
    } catch (error) {
        generateError(400, "Failed to update items");
    }
};

async function deleteManyItemsById(itemsID_array) {
    try {
        await Item.deleteMany({ _id: { $in: itemsID_array } });
    } catch (error) {
        generateError(400, "Items was not deleted");
    }
};

module.exports = {
    createNewItem,
    deleteItemById,
    findLastItem,
    modifyItem,
    findItemById,
    setItems,
    updateItemFields,
    deleteManyItemsById,
};