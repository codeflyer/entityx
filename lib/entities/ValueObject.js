var util = require("util");
var CoreObject = require('./CoreObject');

var ValueObject = function() {
    CoreObject.call(this);
};
util.inherits(ValueObject, CoreObject);

module.exports = ValueObject;