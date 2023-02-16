
function generateError(status, message) {
    const error = new Error(message);
    error.statusCode = status;
    throw error;
}

function handleError (error, res) {
    const statusCode = error.statusCode || 500;
    console.log('Server error: '+error.message+'; Status code: '+error.statusCode);
    res.status(statusCode).json({
        message: error.message
    });
};
  
module.exports = {handleError, generateError};