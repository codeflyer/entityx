var util = require('util');
var HelperAbstract = require('../../../helpers/HelperAbstract');

module.exports = function(attributes) {
  function returnFunction() {
    HelperAbstract.call(this);
  }
  util.inherits(returnFunction, HelperAbstract);
  return returnFunction;
};
