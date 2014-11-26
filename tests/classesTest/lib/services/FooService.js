var util = require('util');
var ServiceAbstract = require('./../../../../lib/services/ServiceAbstract');

var FooService = function() {
  ServiceAbstract.call(this);
};
util.inherits(FooService, ServiceAbstract);

module.exports = FooService;
