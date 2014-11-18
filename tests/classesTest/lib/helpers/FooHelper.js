var util = require('util');
var HelperAbstract = require('./../../../../lib/helpers/HelperAbstract');

var FooHelper = function() {
  HelperAbstract.call(this);
};
util.inherits(FooHelper, HelperAbstract);

module.exports = FooHelper;
