const express = require("express");
const router = express.Router();
const {handleError} = require("../utils/errors.js");
const { 
    verifyJWT
} = require("../utils/verifyUser.js");
const {
    findUserById,
} = require("../utils/authFunctions.js");
const { 
    uploadFile,
    deleteFolder,
} = require("../utils/cloudFunctions.js")
const { 
    modifyUserAvatar,
    deleteUserAvatar,
} = require("../utils/avatarFunctions.js")

const multer = require('multer');
const upload = multer().single("image");

router.post("/setavatar", upload, async (req, res) => {
    try {
        let { userID } = verifyJWT(req);
        const file = req.file;
        const userName = file.originalname;
        await deleteFolder(userName);
        const imageURL = await uploadFile(file, userName);
        const userData = await modifyUserAvatar(userID, imageURL);
        res.json({ 
            message: 'Avatar received', 
            userAvatar: userData.avatarUrl,
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/deleteavatar", async (req, res) => {
    try {
        let { userID } = verifyJWT(req);
        // const { avatarUrl } = req.body;
        const { username } = await findUserById(userID);
        await deleteFolder(username);
        const userData = await deleteUserAvatar(userID);
        res.json({ 
            message: 'Avatar deleted', 
            userAvatar: userData.avatarUrl,
        });
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;