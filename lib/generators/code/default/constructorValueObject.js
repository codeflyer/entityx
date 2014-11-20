var util = require('util');
var ValueObject = require('../../../entities/ValueObject');

module.exports = function(attributes) {
  function returnFunction(details) {
    ValueObject.call(this);
    this._loadDetails(details);
  }
  util.inherits(returnFunction, ValueObject);
  return returnFunction;
};
