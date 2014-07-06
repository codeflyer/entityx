var util = require('util');

var ErrorMessage = function(code, message, error) {
    Error.call(this);
    this.code = code;
    this.message = message;
    if(error != null) {
        this.parentError = error;
    } else {
        this.parentError = null;
    }

    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
        return stack;
    };
    var err = new Error();
    Error.captureStackTrace(this, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    this.stack = stack;
};
util.inherits(ErrorMessage, Error);

ErrorMessage.prototype.getLogMessage = function(showStack) {
    var returnString = "Error: " + this.code + ' - ' + this.message;
    if(this.parentError != null) {
        if(this.parentError != null) {
            returnString += "\nParent: " + this.parentError.toString();
        }
    }
    if(showStack) {
        returnString += "\nStack: " + this.stack;
    } else {
        if(this.stack != null && this.stack[1] != null) {
            returnString += "\nError at: " + this.stack[1].getFileName() + ':' + this.stack[1].getLineNumber();
        }
    }
    return returnString;
};

module.exports = ErrorMessage;
