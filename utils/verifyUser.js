const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const { generateError } = require("./errors")

function verifyJWT (req) {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    // console.log('Token: '+token)
    try {
        const decoded = jwt.verify(token, process.env.JWT_Secret);
        return decoded;
    } catch (error) {
        generateError(401, "Unauthorized");
    }
};

async function findUserById(tokenDecoded) {
    const userID = tokenDecoded.userID;
    const userData = await User.findOne({ _id: userID });
    if (!userData) {
        generateError(400, "User not found in BD" );
    };
    return { id: userData._id, username: userData.username, role: userData.role, avatarUrl: userData.avatarUrl ? userData.avatarUrl : null };
}

module.exports = {
    verifyJWT,
    findUserById
};