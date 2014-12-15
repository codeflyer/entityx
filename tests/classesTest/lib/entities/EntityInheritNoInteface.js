var util = require('util');
var Entity = require('./../../../../lib/entities/Entity');

var EntityInherit = function() {
  Entity.call(this,
      {'useTimestamp': true, repositoryName: 'TestModule/Inherit'});
};
util.inherits(EntityInherit, Entity);

module.exports = EntityInherit;
