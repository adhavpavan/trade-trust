const getSuccessResponse = (statusCode, message, payload) => {
    return {
      success: true,
      message: message,
      status: statusCode,
      timestamp: new Date(),
      payload
    };
  };
  
const getErrorResponse = (statusCode, message, errors) => {
return {
    success: false,
    message: message,
    status: statusCode,
    errors: errors,
    timestamp: new Date(),
};
};
  
module.exports = {
 getErrorResponse,
 getSuccessResponse
};
  