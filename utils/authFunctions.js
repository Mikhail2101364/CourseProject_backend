const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { generateError } = require("./errors")

async function findUserById(userID) {
    try {
        const userData = await User.findById(userID);
        return userData;
    } catch (error) {
        generateError(400, "User not found");
    }
};

async function checkUserByEmail(req) {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        generateError(400, "User already exists");
    }
}

async function checkUserByName(req) {
    const {username} = req.body;
    const user = await User.findOne({ username });
    if (user) {
        generateError(400, "This username is already taken");
    }
}

function createHash(password) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt);
}

async function createUser(req) {
    const { username, email, password } = req.body;
    const hashedPassword = createHash(password);
    const role = email===process.env.AdminAllowedEmail ? 'admin' : 'user';
    const newUser = new User({ username, email, passwordHash: hashedPassword, role: role });
    return newUser.save();
}

function createJWT(user) {
    const {_id} = user;
    return jwt.sign({ userID: _id }, process.env.JWT_Secret, );
}

async function findUserByEmail(req) {
    const {email} = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        generateError(400, "Incorrect password or email" );
    }
    return user;
}

function comparePassword(req, user) {
    const {password} = req.body;
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
        generateError(400, "Incorrect password or email" );
    }
}

module.exports = {
    checkUserByEmail,
    checkUserByName,
    createUser,
    createJWT,
    findUserByEmail,
    comparePassword,
    findUserById,
};