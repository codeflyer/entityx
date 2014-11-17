var util = require('util');
var CoreObject = require('./CoreObject');

var ValueObject = function() {
  CoreObject.call(this);
};
util.inherits(ValueObject, CoreObject);

ValueObject.prototype._getStructuredValueForSave = function() {
  return this._data;
};

module.exports = ValueObject;
