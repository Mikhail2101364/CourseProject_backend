const { generateError } = require("./errors");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } = require("firebase/storage");
const { firebase } = require('../cloud/cloudInit.js');
const storage = getStorage(firebase);

async function uploadFile(file, userName) {
    try {
        // const userName = file.originalname
        const timestamp = new Date().getTime();
        const filename = `${timestamp}-${userName}`;
        const storageRef = ref(storage, `${process.env.HOST}/avatar-folder/${userName}/${filename}`);
        await uploadBytes(storageRef, file.buffer);
            console.log('Firebase file upload done!');
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.log('Firebase error: ',error);
        generateError(400, "Firebase upload error");
    }
};

async function deleteFolder(userName) {
    try {
        const folderRef = ref(storage, `${process.env.HOST}/avatar-folder/${userName}/`);
        const listResult = await listAll(folderRef);
        const deletePromises = listResult.items.map(async (item) => {
            try {
            await deleteObject(item);
            // console.log(`File '${item.fullPath}' deleted successfully.`);
            } catch (error) {
            // console.error('Error deleting file:', error);
            generateError(400, "Firebase delete file error");
            }
        });
        await Promise.all(deletePromises);
            console.log('Firebase folder deleted!');
        // return deletePromises;
    } catch (error) {
        console.log('Firebase error: ',error);
        generateError(400, "Firebase delete error");
    }
};

module.exports = {
    uploadFile,
    deleteFolder,
};