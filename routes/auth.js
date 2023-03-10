const express = require("express");
const {handleError} = require("../utils/errors.js");
const {
    checkUserByEmail,
    checkUserByName,
    createUser,
    createJWT,
    findUserByEmail,
    comparePassword
} = require("../utils/authFunctions.js");
const { 
    verifyJWT,
    findUserById
} = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/registration", async (req, res) => {
    try {
        await checkUserByEmail(req);
        await checkUserByName(req);
        const newUser = await createUser(req);
        const token = createJWT(newUser);
        res.json({ token });
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await findUserByEmail(req);
        comparePassword(req, user);
        const token = createJWT(user);
        res.json({ token });
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/user", async (req, res) => {
    try {
        let userData = verifyJWT(req);
        const user = await findUserById(userData);
        res.json(user);
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;