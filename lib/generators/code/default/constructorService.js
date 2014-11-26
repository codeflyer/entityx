var util = require('util');
var ServiceAbstract = require('../../../services/ServiceAbstract');

module.exports = function(attributes) {
  function returnFunction() {
    ServiceAbstract.call(this);
  }
  util.inherits(returnFunction, ServiceAbstract);
  return returnFunction;
};
