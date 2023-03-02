const express = require("express");
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const { 
    createNewItem,
    updateCollection,
    deleteItemById,
    findLastItem,
} = require("../utils/itemsFunctions.js");
const { 
    findCollectionById,
    findItemById,
    filterCustomFields,
} = require("../utils/collectionsFunctions.js");

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        await  verifyJWT(req);
        const { collectionID, itemFields } = req.body;
        const collectionData = await findCollectionById(collectionID);
        const itemData = await createNewItem(collectionData, itemFields)
        await updateCollection(collectionData._id, itemData._id, '$push')
        res.json({ 
            message: 'Item was created', 
            itemData: itemData,
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/show/:id", async (req, res) => {
    try {
        const itemID = req.params.id;
        const itemData = await findItemById(itemID);
        const item = filterCustomFields(itemData.customFields);
        const collectionData = await findCollectionById(itemData.collectionId);
        res.json({
            collection: collectionData,
            item: item,
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/delete", async (req, res) => {
    try {
        await verifyJWT(req);
        const { collectionID, itemID } = req.body;
        await deleteItemById(itemID);
        await updateCollection(collectionID, itemID, '$pull')
        res.json({
            message: 'Item deleted'
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/last", async (req, res) => {
    try {
        const data = await findLastItem();
        // const itemsCollections = await findLastItemsCollections(lastItems);
        // const data = setLastItemsFields(lastItems, await itemsCollections);
        console.log('Last 3 items fields: ',data)
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;