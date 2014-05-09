var util = require("util");
var CoreObject = require('./../../../../lib/entities/CoreObject');

var CoreObjectInherit = function() {
    CoreObject.call(this);
};
util.inherits(CoreObjectInherit, CoreObject);

CoreObjectInherit.prototype.setName = function(name) {
    return this._setData('name', name);
};

CoreObjectInherit.prototype.getName = function() {
    return this._getData('name');
};

module.exports = CoreObjectInherit;