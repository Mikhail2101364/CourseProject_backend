const express = require("express");
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const {
    findUserById,
} = require("../utils/authFunctions.js");
const { 
    setItems,
    updateItemFields,
    deleteManyItemsById,
} = require("../utils/itemsFunctions.js");
const { 
    checkCollectionName,
    createCollection,
    findCollectionsByUserId,
    findLastCollections,
    deleteCollectionById,
    findCollectionById,
    modifyCollection,
    filterCollection,
} = require("../utils/collectionsFunctions.js");
const { 
    uploadFile,
} = require("../utils/cloudFunctions.js")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/create", upload.single('avatarFile'), async (req, res) => {
    try {
        let { userID } = verifyJWT(req);
        await checkCollectionName(req, userID);
        //uploadFile(req);
        const userData = await findUserById(userID);
        const newCollection = await createCollection(req, userData)
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
        await updateItemFields(collectionData, newCollection);
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
        // const data = await showCollection(collectionID)
        const collectionData = await findCollectionById(collectionID);
        const userData = await findUserById(collectionData.author);
        const items = await setItems(collectionData.items);
        const collection = filterCollection(collectionData, userData)
        res.json({
            collection,
            items
        });
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
        const collectionData = await findCollectionById(collectionID);
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