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
const User = require("../models/User.js");

const router = express.Router();

router.post("/registration", async (req, res) => {
    try {
        await checkUserByEmail(req);
        await checkUserByName(req);
        const newUser = await createUser(req);
        const token = createJWT(newUser);
        res.send({ token });
        console.log('User '+newUser.username+' has registrated')
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await findUserByEmail(req);
        comparePassword(req, user);
        const token = createJWT(user);
        res.send({ token });
        console.log('User '+user.username+' has authorized')
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/user", async (req, res) => {
    try {
        let userData = verifyJWT(req);
        const user = await findUserById(userData);
        console.log(user)
        res.send(user);
        console.log('User '+user.username+' data were send to client')
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;