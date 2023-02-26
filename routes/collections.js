const express = require("express");
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const { 
    checkCollectionName,
    createCollection,
    showCollection,
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

router.get("/show/:id", async (req, res) => {
    try {
        console.log('recieve request')
        const collectionID = req.params.id;
        const data = await showCollection(collectionID)
        res.json({ 
            message: 'Collection was found', 
            data: data,
        });
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;