var util = require('util');
var ValueObject = require('./../../../../../lib/entities/ValueObject');

var ValueInherit = function(params) {
  ValueObject.call(this);
  this._setData('name', params.name);
  this._setData('surname', params.surname);
};
util.inherits(ValueInherit, ValueObject);

ValueInherit.prototype.setName = function(name) {
  return this._setData('name', name);
};

ValueInherit.prototype.getName = function() {
  return this._getData('name');
};

ValueInherit.prototype.setSurname = function(surname) {
  return this._setData('surname', surname);
};

ValueInherit.prototype.getSurname = function() {
  return this._getData('surname');
};

module.exports = ValueInherit;
