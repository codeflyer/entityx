var util = require('util');
var Entity = require('./../../../../lib/entities/Entity');
var Factory = require('./../../../../lib/Factory');

var EntityInherit = function() {
  Entity.call(this, {'useTimestamp': true});
};
util.inherits(EntityInherit, Entity);

/**
 * @interfaceMethod
 * @returns {*}
 * @private
 */
EntityInherit.prototype._getRepository = function() {
  return Factory.getRepository('TestModule/Inherit', this.getId());
};

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
