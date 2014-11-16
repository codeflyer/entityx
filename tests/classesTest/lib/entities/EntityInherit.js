var util = require('util');
var Entity = require('./../../../../lib/entities/Entity');

var EntityInherit = function() {
  Entity.call(this,
      {'useTimestamp': true, repositoryName: 'TestModule/Inherit'});
};
util.inherits(EntityInherit, Entity);

EntityInherit.prototype._loadDetails = function(details, callback) {
  this._setData('name', details.name);
  return details;
};

EntityInherit.prototype.setName = function(name) {
  return this._setData('name', name);
};

EntityInherit.prototype.getName = function() {
  return this._getData('name');
};

module.exports = EntityInherit;
