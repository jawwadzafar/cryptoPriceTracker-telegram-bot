var HttpStatus = require('http-status-codes');

module.exports = {
    LOGGED_IN: "User Logged In",

    /**
     * @param  {Object} res
     * @param  {String} msg
     * @param  {Object} data
     */
    sendRes: function (res, message = null, data = null) {
        res.status(HttpStatus.OK).send({
            success: true,
            message: message,
            data: data
        });
    },
    /**
     * @param  {Object} res
     * @param  {Number} errorcode
     * @param  {String} message=null
     */
    sendError: function (res, errorCode, message = null, data = null) {
        res.status(!!errorCode ? errorCode : 400).send({
            success: false,
            message: message,
            data: data,
        });
    },
}