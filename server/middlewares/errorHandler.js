
// Express Error Haqndler
const errorHandler = (error, req, res, next) => {

    const errStatus = error.status || 500;
    const errMessage = error.message || 'Unknown error';

    return res.status(errStatus).json({
        message : errMessage,
        status  : errStatus,
        stack   : error.stack
    });

}


// Error Handler export
export default errorHandler;