// A function that returns an error object with a message and status code.
function error(status, msg) { // status, msg params from the error in index.mjs file.
    const err = new Error(msg); // err variable that contains an object created from the Error() constructor. the msg param will be passed to the Error() constructor.
    err.status = status; // err.status is set to the status param passed from the index.mjs file. This err.status will be used in the error-handling middleware in index.mjs.
    return err; // return the err object to the index.mjs file. This will be used in the error-handling middleware in index.mjs.
}

export default error;