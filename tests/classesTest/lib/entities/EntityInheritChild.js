var util = require('util');
var EntityInherit = require('./EntityInherit');

var EntityInheritChild = function() {
  EntityInherit.call(this, {'useTimestamp': true});
};
util.inherits(EntityInheritChild, EntityInherit);

module.exports = EntityInheritChild;
