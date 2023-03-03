const express = require("express");
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const { 
    createNewItem,
    deleteItemById,
    findLastItem,
    modifyItem,
    findItemById,
} = require("../utils/itemsFunctions.js");
const { 
    findCollectionById,
    filterCustomFields,
    updateCollection,
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

router.post("/:id/modify", async (req, res) => {
    try {
        await  verifyJWT(req);
        const itemID = req.params.id;
        const { itemFields } = req.body;
        await modifyItem(itemFields, itemID)
        const itemData = await findItemById(itemID);
        res.json({ 
            message: 'Item was modified', 
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
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;