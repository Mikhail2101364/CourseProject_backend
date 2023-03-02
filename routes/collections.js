const express = require("express");
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const { 
    checkCollectionName,
    createCollection,
    showCollection,
    findCollectionsByUserId,
    findLastCollections,
    deleteManyItemsById,
    deleteCollectionById,
    findCollectionById,
    modifyCollection,
    updateItemFields,
} = require("../utils/collectionsFunctions.js");

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        let { userID } = verifyJWT(req);
        await checkCollectionName(req, userID);
        const newCollection = await createCollection(req, userID)
        res.json({ 
            message: 'Collection was created', 
            collectionID: newCollection._id,
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/modify/:id", async (req, res) => {
    try {
        const collectionID = req.params.id;
        verifyJWT(req);
        const collectionData = await findCollectionById(collectionID);
        const newCollection = await modifyCollection(req, collectionID);
        const updatedItems = await updateItemFields(collectionData, newCollection);
        // console.log('old: ',collectionData)
        // console.log('updatedItems: ',updatedItems)
        console.log('updatedItems: ',updatedItems)
        
        res.json({ 
            message: 'Collection was modified', 
            collectionID: collectionData._id,
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/show/:id", async (req, res) => {
    try {
        const collectionID = req.params.id;
        const data = await showCollection(collectionID)
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/user", async (req, res) => {
    try {
        let { userID } = verifyJWT(req);
        const data = await findCollectionsByUserId(userID);
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/last", async (req, res) => {
    try {
        const data = await findLastCollections();
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/delete", async (req, res) => {
    try {
        await verifyJWT(req);
        const { collectionID } = req.body;
        console.log('coll id: ', collectionID)
        const collectionData = await findCollectionById(collectionID);
        console.log('coll data: ', collectionData)
        await deleteManyItemsById(collectionData.items);
        await deleteCollectionById(collectionData._id);
        res.json({
            message: 'Collection deleted'
        });
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;