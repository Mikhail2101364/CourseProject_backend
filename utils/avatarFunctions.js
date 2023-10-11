const User = require("../models/User.js");
const { generateError } = require("./errors")

async function modifyUserAvatar(userID, avatarUrlString) {
    try {
        await User.updateOne({_id: userID}, {
            avatarUrl: avatarUrlString 
        });
        const updatedUser =  await User.findById(userID);
        return updatedUser;
    } catch (error) {
        generateError(400, "Failed to modify user avatar");
    }
};

async function deleteUserAvatar(userID) {
    try {
        await User.updateOne({_id: userID}, {
            avatarUrl: null 
        });
        const updatedUser =  await User.findById(userID);
        return updatedUser;
    } catch (error) {
        generateError(400, "Failed to delete user avatar");
    }
};

module.exports = {
    modifyUserAvatar,
    deleteUserAvatar
};